'use strict';

const CustConst = require('../common/cust.js');
const CustEnum = require('../common/cust_enum.js');
const { category: event_category } = require('../common/event-type.js');
const { agoTime } = require('../common/util');
const { client: { PC, weChat } } = require('../common/const');
const { SpruceError, ErrorStatus } = require('../common/spruce_error.js');
const { deepcmp } = require('../common/util');
const moment = require('moment');

module.exports = app => {

  class CustService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.model = this.getModel('cust');
      this.interact_model = this.getModel('cust_interact');
      this.taskenginee = this.ctx.service.eventEngine;
    }

    // 创建客户
    * createCust(params) {
      const { _id: id, info: { name }, from, shop } = this.ctx.me;
      params.belong = { id, name, from };
      params.shop = shop;
      params.create_time = moment();
      params.interact_update_time = moment();
      let data = yield this.model.create(params);
      data = data.toObject();

      if (data) {
        yield this.triggerFillDataTask(data); // 触发补全资料任务
        // 同步更新关联客户
        yield this.syncRelateCust(
          data.relate_cust,
          Object.assign({ id: data._id }, data.info)
        );
      }

      return data;
    }

    // 客户列表
    * getCustList(params) {
      const query = this.custQuery(params.query);
      const sort = this.custSort(params.sort);
      const limit = parseInt(params.size);
      const skip = params.size * (params.page - 1);

      const list = this.model.find(query).sort(sort)
        .limit(limit)
        .skip(skip)
        .lean();
      const count = this.model.count(query);
      const data = yield this.app.myutil.parallel([ list, count ], 0);

      if (data[0]) {
        this.batchGenPrefer(data[0]);
        // 清理无用字段
        for (const cust of data[0]) {
          let max_time = '';
          for (const line of cust.time_line) {
            if (max_time < line.interact_time) {
              max_time = line.interact_time;
            }
          }
          cust.interact_time = max_time;
          delete cust.time_line;
          delete cust.car_plan;
          delete cust.own_car;
        }
      }

      return { list: data[0], total: data[1] };
    }

    // 删除客户
    * deleteCustById(custId) {
      let result = false;
      const query = { _id: custId, delete: 0 };
      const doc = { delete: 1 };
      const data = yield this.model.updateOne(query, doc);
      if (data.ok && data.nModified) result = { cust_id: custId };
      return result;
    }

    // 更新客户
    * updateCust(custId, params) {
      const query = { _id: custId };
      const update = {
        $set: {
          info: params.info,
          relate_cust: !params.relate_cust ? [] : params.relate_cust,
          update_time: Date.now(),
        },
      };
      const data = yield this.model.findOneAndUpdate(
        query, update, { new: 1 }).lean();

      if (data) {
        yield this.triggerFillDataTask(data); // 触发补全资料任务
        yield this.syncCustInfo(data); // 更新互动中客户基本信息
        yield this.syncRelateCust( // 关联客户
          data.relate_cust,
          Object.assign({ id: data._id }, data.info)
        );
      }

      return data;

    }

    // 同步客户信息到互动记录
    * syncCustInfo(custinfo) {
      if (!custinfo) return;

      const query = { cust_id: custinfo.id };
      const update = {
        $set: {
          cust_name: custinfo.info.name,
          cust_tel: custinfo.info.tel,
          cust_belong: custinfo.belong,
        },
      };
      const rest = yield this.interact_model.updateMany(query, update);
      this.logger.info('syncCustInfo::%s', JSON.stringify(rest));

    }

    // 客户详情
    * getCustDetail(cust_id) {
      const query = { _id: cust_id, delete: 0 };
      const data = yield this.model.findOne(query).lean();

      if (data) {
        this.makeTransferCar(data);
        data.own_car = this.clearDeleteCar(data.own_car);
        this.makeDetail(data);
        this.devideCarPlan(data);
        this.sortTimeline(data);
      }
      return data;
    }


    getConfigName(name, number) {
      let config_name = '';
      if (!number) {
        return config_name;
      }
      if (CustEnum[name].length > 0) {
        for (const item of CustEnum[name]) {
          if (item.params[number]) {
            config_name = item.params[number];
          }
        }
      } else {
        if (CustEnum[name][number]) {
          config_name = CustEnum[name][number];
        }
      }
      return config_name;
    }

    /**
     * 增加客户时间线
     *
     * @param {int} custid 客户id
     * @param {object} content 具体内容
     *     - processor       操作人信息
     *     - type            任务类型
     *     - interact_time   互动时间
     *     - from_id         源记录id
     *     - abstract        内容摘要（如果是手动录入的客户互动传一组对象）
     *
     * 传参模板：
     *    {
     *      processor: {
     *        id: 'sfsfsfsfsfsfsfsf',
     *        from: 'plat',
     *        name: 'zhangsan'
     *      },
     *      type: 300,
     *      interact_time: '2017-10-01 12:23:11',
     *      from_id: 'sfsdfsfsfsfsf22211',
     *      abstract: '张林和客户聊了玛莎拉蒂置换计划，并更新了置换计划。'
     *    }
     *
     * @return {object} 客户信息
     */
    * addTimeline(custid, content) {
      this.logger.info(' addTimeline args %s::%s', custid, JSON.stringify(content));
      // 参数验证
      const check1 = custid && typeof custid === 'string';
      const check2 = content
        && (typeof content === 'object' || typeof content === 'string');
      if (!check1 || !check2) {
        this.logger.error('addTimeline::', arguments);
        throw new SpruceError(ErrorStatus.args_error);
      }

      const required = [
        'processor', 'type', 'interact_time', 'from_id', 'abstract',
      ];
      for (const field of required) {
        if (!content.hasOwnProperty(field)) {
          this.logger.error('addTimeline content::', JSON.stringify(content));
          throw new SpruceError(ErrorStatus.args_error);
        }
      }

      // add
      const query = { _id: custid };
      content.create_time = Date.now();
      const update = { $addToSet: { time_line: content }, interact_update_time: moment() };
      const options = { new: 1 };
      const data = yield this.model.findOneAndUpdate(query, update, options);
      if (!data) {
        this.logger.error(
          'addTimeline fail::', JSON.stringify(query), JSON.stringify(update));
        throw new SpruceError(ErrorStatus.timeline_fail);
      }

      return data;
    }

    // 搜索客户
    * searchCust(params) {
      const query = this.searchQuery(params.qkey);
      const sort = this.searchSort(params.sort);
      const doc = this.searchDoc(params.client);
      const limit = parseInt(params.size);
      const skip = parseInt(params.size) * (parseInt(params.page) - 1);
      const list = yield this.model.find(query, doc).sort(sort).limit(limit)
        .skip(skip)
        .lean();

      const count = this.model.count(query);
      const data = yield this.app.myutil.parallel([ list, count ]);
      const res = {
        list: this.makeSearchList(data[0], params.client),
        total: data[1],
      };
      return res;
    }


    // 已有车辆列表
    * getCarList(custid) {
      const query = { _id: custid };
      const data = yield this.model.findOne(query);

      return this.clearDeleteCar(data.own_car);
    }

    // 某已有车辆
    * getCarById(custid, owncarid) {
      const query = { _id: custid };
      const project = { own_car: { $elemMatch: { _id: owncarid } } };
      const data = yield this.model.findOne(query, project);
      return !data.own_car.length ? {} : data.own_car[0];
    }

    // 更新一个车
    * updateCarById(custid, owncarid, carinfo) {
      if (yield this.getOwnCarStatus(custid, owncarid)) {
        this.logger.error('updateCarById', custid, owncarid);
        throw new SpruceError(ErrorStatus.owncar_no_edit);
      }
      const query = { _id: custid, 'own_car._id': owncarid };
      const update = { $set: { 'own_car.$': carinfo } };
      const data = yield this.model.findOneAndUpdate(query, update, { new: 1 })
        .lean();
      if (data) {
        yield this.triggerOwnCarTask(data, owncarid);
      }
      return data;
    }

    // 增加一辆车
    * addOwnCar(custid, carinfo) {
      const query = { _id: custid };
      const update = { $push: { own_car: carinfo } };
      const options = { new: 1 };
      const data = yield this.model.findOneAndUpdate(query, update, options)
        .lean();

      if (data) yield this.triggerOwnCarTask(data, null, false);

      return data;
    }

    // 释放被置换的车辆
    * releaseOwnCar(custid, carplan) {
      const { transfer_cars, buy_date_type } = carplan;
      yield this.updateOwnCarResell(
        custid, transfer_cars, buy_date_type, false, true);
    }

    /**
     * 更新客户已有车辆计划出手时间状态和类型
     *  另外：目前产品定位置换车辆只能登记一台，所以此方法目前只更新一辆车
     * @param {string} custid 客户id
     * @param {array} car_ids 该车id
     * @param {int} resell_type 计划出手时间类型（一周内、一月内）
     * @param {boolean} is_exchange 是否是置换车辆
     * @param {boolean} trigger 默认触发任务
     * @return {object|null} 客户信息|null
     */
    * updateOwnCarResell(custid, car_ids, resell_type, is_exchange = false, trigger = true) {
      if (!custid || !car_ids || !resell_type) {
        this.logger.error('updateOwnCarResell::', JSON.stringify(arguments));
        throw new SpruceError(ErrorStatus.args_error);
      }
      if (!car_ids.length) {
        this.logger.info('car_ids:' + car_ids);
        return;
      }

      const car_id = car_ids[0];

      const query = { _id: custid, 'own_car._id': car_id };
      const update = {
        $set: {
          'own_car.$.resell_date_type': resell_type,
          'own_car.$.is_resell': is_exchange ?
            CustConst.resell_situation.exchange : CustConst.resell_situation.sell,
        },
      };
      const data = yield this.model.findOneAndUpdate(query, update, { new: 1 })
        .lean();

      if (data) {
        // 触发已有车辆任务
        if (trigger) yield this.triggerOwnCarTask(data, car_id);
      }

      return data;
    }

    // 删除某车
    * delOwnCar(custid, owncarid) {
      const query = { _id: custid, 'own_car._id': owncarid };
      const update = { 'own_car.$.delete': 1 };
      const cust_info = yield this.model.findOneAndUpdate(query, update).lean();

      if (cust_info) {
        yield this.triggerOwnCarTask(cust_info, owncarid, true);
      }

      return cust_info;
    }

    // 增加购车计划
    * addCarPlan(custid, params) {
      // 添加前检查是否有已存在的计划
      const plan = yield this.model.find({
        _id: custid,
        'car_plan.delete': 0,
      });
      if (plan.length > 0) {
        this.logger.error('addCarPlan > 1 plan::', custid);
        throw new SpruceError(ErrorStatus.carplan_exists);
      }

      const query = { _id: custid };
      const update = { $addToSet: { car_plan: params } };
      const data = yield this.model.findOneAndUpdate(
        query, update, { new: 1 }).lean();

      if (data) {
        yield this.triggerCarPlanTask(data, null, false); // 触发任务
      }

      return data;
    }

    // 更新购车计划
    * updateCarPlan(custid, carplanid, params) {
      const query = {
        _id: custid,
        'car_plan._id': carplanid,
        'car_plan.delete': 0,
      };
      const olddata = yield this.model.findOne(query).lean();
      const update = { 'car_plan.$': Object.assign({ _id: carplanid }, params) };
      const newdata = yield this.model.findOneAndUpdate(query, update, { new: 1 })
        .lean();

      if (newdata) {
        yield this.analysePlan(newdata, olddata, carplanid);
      }

      return newdata;
    }

    // 还原计划（由置换变为普通计划）
    * revertCarPlan(custid, carplanid) {
      const query = {
        _id: custid,
        'car_plan._id': carplanid,
        'car_plan.delete': 0,
      };
      const update = {
        'car_plan.$.is_transfer': 0,
        'car_plan.$.transfer_cars': [],
      };
      const data = yield this.model.findOneAndUpdate(query, update, { new: 1 });

      if (data) {
        yield this.triggerCarPlanTask(data, carplanid, false);
      }

      return data;
    }


    // 删除计划、变成历史计划(计划完成)
    * delCarPlan(custid, carplanid = null, finish = false) {
      // 获取购车计划
      const custinfo = yield this.getCarPlan(custid, carplanid);
      if (!custinfo || !custinfo._id || !custinfo.car_plan || custinfo.car_plan.length === 0) {
        return null;
      }
      const carplan = custinfo.car_plan;

      const query = { _id: custid, 'car_plan._id': carplan._id };
      let update = { $pull: { car_plan: { _id: carplanid } } }; // 删除计划
      if (finish) update = { 'car_plan.$.delete': 1 }; // 变历史

      const data = yield this.model.findOneAndUpdate(query, update).lean();

      if (data) {
        yield this.triggerCarPlanTask(data, carplan._id, true);
      }

      return data;
    }

    // 获取购车计划
    * getCarPlan(custid, carplanid = null) {
      const query = { _id: custid };
      const projection = { own_car: 1 };
      if (carplanid) {
        projection.car_plan = { $elemMatch: { _id: carplanid } };
      } else {
        projection.car_plan = { $elemMatch: { delete: 0 } };
      }

      const data = yield this.model.findOne(query, projection).lean();

      let rest = null;
      if (data && data.car_plan && data.car_plan.length > 0) {
        this.makeTransferCar(data);
        data.car_plan = data.car_plan[0];
        rest = data;
      }
      return rest;
    }

    // 通用方法：检查购车计划、已有车辆信息是否改变
    * checkDataChanged(propertyname, custid, propertyid, newdata) {
      if (!propertyname || !custid || !propertyid || !newdata
        || ![ 'carplan', 'owncar' ].includes(propertyname)) {
        this.logger.error('checkDataChanged::', arguments);
        throw new SpruceError(ErrorStatus.args_error);
      }
      const query = { _id: custid };
      const project = { _id: 0 };
      if (propertyname === 'carplan') {
        query['car_plan._id'] = propertyid;
        project['car_plan.$'] = 1;
        const olddata = yield this.model.findOne(query, project);
        if (!olddata) {
          this.logger.error('checkDataChanged::', custid);
          throw new SpruceError(ErrorStatus.cust_notfound);
        }

        const oldcarplan = olddata.car_plan[0];
        const cmp_res = deepcmp(newdata, oldcarplan);
        if (cmp_res.c === 1) {
          if (newdata.transfer_cars[0] !== oldcarplan.transfer_cars[0]) {
            if (cmp_res.ds.length === 1) {
              // 只有置换车辆变了
              return 'TRANSFER_CAR_CHANGED';
            }
            if (cmp_res.ds.length > 1) {
              return 'BOTH_CHANGED';
            }
          } else {
            return 'PLAN_CHANGED';
          }

        }

      } else if (propertyname === 'owncar') {

        query['own_car._id'] = propertyid;
        project['own_car.$'] = 1;
        const data = yield this.model.findOne(query, project);
        const owncar = data.own_car[0];

        if (deepcmp(newdata.resell_date_type, owncar.resell_date_type).c) {
          return 'RESELL_DATE_CHANGED';
        }

      }

      return 'NO_CHANGED';
    }

    // 统计bee的客户数
    * countCustByBee(bee_id) {
      const query = { 'belong.id': bee_id, delete: 0 };
      const count = this.model.count(query);
      return count;
    }


    /** ******************
     * 附属方法
     * start
     */

    custQuery(params) {
      const query = { delete: 0 };
      if (params) {
        if (params.name) {
          query['info.name'] = { $regex: `.*${params.name}.*` };
        }
        if (params.car && params.car.brand !== '*') {
          query['car_plan.delete'] = 0; // 不列出历史购车计划
          query['car_plan.prefer_cars.brand_id'] = params.car.brand;
          if (params.car.type && params.car.type !== '*') {
            query['car_plan.prefer_cars.type_id'] = params.car.type;
            if (params.car.model && params.car.model !== '*') {
              query['car_plan.prefer_cars.model_id'] = params.car.model;
            }
          }
        }
        if (params.hobby) {
          query['info.hobby'] = { $in: params.hobby };
        }
        if (params.occupation) {
          query['info.job.occupation'] = { $in: params.occupation };
        }
        if (params.car_use_to) { // 购车目的
          query['car_plan.use_to'] = params.car_use_to;
        }
        if (params.car_budget_type) { // 购车预算
          query['car_plan.budget_type'] = params.car_budget_type;
        }
        if (params.family_situation) {
          query['info.family.situation'] = params.family_situation;
        }
        if (params.eduction) {
          query['info.eduction'] = params.eduction;
        }
      }

      return this.addAuth(query);
    }

    custSort(params) {
      const sort = {};
      if (!params) {
        sort.create_time = -1;
      } else {
        // 最近互动时间
        if (params.interact_time) {
          sort.interact_update_time = params.interact_time;
        }
      }
      return sort;
    }

    // 批量生成购车意向
    batchGenPrefer(custlist) {
      if (!custlist || !Array.isArray(custlist)) {
        this.logger.error('batchGenPrefer::', arguments);
        throw new SpruceError(ErrorStatus.args_error);
      }

      for (const cust of custlist) {
        const [ carplan ] = this.getNewOldPlan(cust.car_plan);
        cust.buy_car_prefer = this.generateBuyCarPrefer(cust.own_car, carplan);
      }
    }

    // 生成购车意向
    generateBuyCarPrefer(owncarlist, carplan) {
      if (!owncarlist || !Array.isArray(owncarlist)) {
        this.logger.error('generateBuyCarPrefer::', arguments);
        throw new SpruceError(ErrorStatus.args_error);
      }

      let prefer_desc = []; // 保存客户对所有车辆的意向
      const no_prefer = '暂无成交意向';

      if (carplan && !carplan.is_transfer && carplan.buy_date_type !== 0) {
        const carplan_date = CustEnum.car_buy_time[carplan.buy_date_type];
        const car_type = CustEnum.car_type[carplan.car_type];
        prefer_desc.push(`${carplan_date}购买${car_type}`);
      }

      for (const owncar of owncarlist) {
        if (owncar.is_resell === CustConst.resell_situation.no_sell
          || typeof owncar.is_resell === 'undefined'
          || owncar.delete === 1) continue;

        const resell_type = CustEnum.resell_date_type[owncar.resell_date_type];

        if (owncar.is_resell === CustConst.resell_situation.sell) {
          prefer_desc.push(`${resell_type}出手[${owncar.model_name}]`);
        } else if (carplan
          && owncar.is_resell === CustConst.resell_situation.exchange
          && carplan.buy_date_type !== 0) {
          const carplan_date = CustEnum.car_buy_time[carplan.buy_date_type];
          const car_type = CustEnum.car_type[carplan.car_type];
          prefer_desc.push(`${carplan_date}置换${car_type}`);
        }
      }

      prefer_desc = !prefer_desc.length ? no_prefer : prefer_desc.join(',');

      return prefer_desc;

    }

    // 同步客户关系
    * syncRelateCust(receivers, sponsor) {
      if (receivers.length < 1) return;

      const { id: cust_id, name, tel, sex } = sponsor;
      const docs = { cust_id, name, tel };
      if (sponsor.family && sponsor.family.location) {
        docs.location = sponsor.family.location;
      }

      for (const cust of receivers) {
        const query = {
          _id: cust.cust_id,
          'relate_cust.cust_id': { $nin: [ cust_id ] },
        };
        // 添加客户对应关系
        docs.relation = this.getOppositeRelation(cust.relation, sex);
        const sponsor = { $addToSet: { relate_cust: docs } };
        const rest = yield this.model.update(query, sponsor);
        this.logger.info('syncRelateCust::', JSON.stringify(rest));
      }
    }

    // 根据客户关系查找对应关系
    getOppositeRelation(relationCode, sexCode) {
      if (!CustEnum.cust_relation_opposite[relationCode]) {
        this.logger.error('relationCode::', relationCode);
        throw new SpruceError(ErrorStatus.relatedcust_notfound);
      } else {
        const relations = CustEnum.cust_relation_opposite[relationCode]
          .split('/');
        return sexCode === 1 ? relations[0] : relations[1];
      }
    }

    // 划分新旧计划
    devideCarPlan(custinfo) {
      if (!custinfo) {
        this.logger.error('devideCarPlan::', arguments);
        throw new SpruceError(ErrorStatus.args_error);
      }
      const [ current, history ] = this.getNewOldPlan(custinfo.car_plan);
      custinfo.car_plan = current ? current : {};
      custinfo.history_car_plan = history;
    }

    getNewOldPlan(carplanlist) {
      if (!carplanlist || !Array.isArray(carplanlist)) {
        this.logger.error('getNewOldPlan::', arguments);
        throw new SpruceError(ErrorStatus.args_error);
      }

      let cur_car_plan = null;
      const history_car_plan = [];
      if (!carplanlist.length) {
        return [ cur_car_plan, history_car_plan ];
      }

      for (const [ i, carplan ] of Object.entries(carplanlist)) {
        if (!carplan.delete) {
          cur_car_plan = carplan;
        } else {
          history_car_plan.push(carplan);
        }
      }

      return [ cur_car_plan, history_car_plan ];
    }

    sortTimeline(custinfo) {
      const desc = [];
      for (const timeline of custinfo.time_line) {
        desc.unshift(timeline);
      }
      custinfo.time_line = desc;
    }

    // 客户详情
    makeDetail(detail) {
      if (!detail) {
        return;
      }
      // info
      if (detail.hasOwnProperty('info')) {
        if (detail.info.hasOwnProperty('sex')) {
          detail.info.sex_name = this.getConfigName('sex', detail.info.sex);
        }
        if (detail.info.hasOwnProperty('eduction')) {
          detail.info.eduction_name = this.getConfigName('eduction', detail.info.eduction);
        }
        if (detail.info.hasOwnProperty('hobby')) {
          const hobby_name = [];
          for (const hobby of detail.info.hobby) {
            hobby_name.push(this.getConfigName('hobby', hobby));
          }
          detail.info.hobby_name = hobby_name;
        }
        // info.family
        if (detail.info.hasOwnProperty('family')) {
          if (detail.info.family.hasOwnProperty('situation')) {
            detail.info.family.situation_name = this.getConfigName('family_condition', detail.info.family.situation);
          }
          if (detail.info.family.hasOwnProperty('earning')) {
            detail.info.family.earning_name = this.getConfigName('family_earning', detail.info.family.earning);
          }
        }
        // info.job
        if (detail.info.hasOwnProperty('job')) {
          if (detail.info.job.hasOwnProperty('occupation')) {
            detail.info.job.occupation_name = this.getConfigName('occupation', detail.info.job.occupation);
          }
        }
      }
      // own_car
      if (detail.hasOwnProperty('own_car')) {
        for (const own of detail.own_car) {
          // own_car.belong
          if (own.hasOwnProperty('car_color')) {
            own.car_color_name = this.getConfigName('car_color', own.car_color);
          }
          if (own.hasOwnProperty('car_inner_color')) {
            own.car_inner_color_name = this.getConfigName('car_inner_color', own.car_inner_color);
          }
          if (own.hasOwnProperty('resell_date_type')) {
            own.resell_date_type_name = this.getConfigName('resell_date_type', own.resell_date_type);
          }
        }
      }
      // car_plan
      if (detail.hasOwnProperty('car_plan')) {
        for (const plan of detail.car_plan) {
          if (plan.hasOwnProperty('use_to')) {
            plan.use_to_name = this.getConfigName('car_use_to', plan.use_to);
          }
          if (plan.hasOwnProperty('car_type')) {
            plan.car_type_name = this.getConfigName('car_type', plan.car_type);
          }
          // prefer_cars
          if (plan.hasOwnProperty('prefer_cars')) {
            for (const prefer_car of plan.prefer_cars) {
              if (prefer_car.hasOwnProperty('car_color')) {
                prefer_car.car_color_name = this.getConfigName('car_color', prefer_car.car_color);
              }
              if (prefer_car.hasOwnProperty('car_inner_color')) {
                prefer_car.car_inner_color_name = this.getConfigName('car_inner_color', prefer_car.car_inner_color);
              }
            }
          }
          if (plan.hasOwnProperty('budget_type')) {
            plan.budget_type_name = this.getConfigName('car_budget', plan.budget_type);
          }
          if (plan.hasOwnProperty('buy_date_type')) {
            plan.buy_date_type_name = this.getConfigName('car_buy_time', plan.buy_date_type);
          }
          if (plan.hasOwnProperty('brand_type')) {
            plan.brand_type_name = this.getConfigName('prefer_brand', plan.brand_type);
          }
          if (plan.hasOwnProperty('prefer_side')) {
            const prefer_name = [];
            for (const prefer of plan.prefer_side) {
              prefer_name.push(this.getConfigName('car_prefer_side', prefer));
            }
            plan.prefer_side_name = prefer_name;
          }
        }
      }
      // relate_cust
      if (detail.relate_cust && detail.relate_cust instanceof Array) {
        for (const cust of detail.relate_cust) {
          // relation
          if (cust.hasOwnProperty('relation')) {
            const relate = cust.relation.split('/');
            if (relate.length > 1) {
              const relate_list = [];
              if (detail.info.hasOwnProperty('sex') && detail.info.sex === 1) { // 男
                const man_list = relate[0].split('|');
                for (const man of man_list) {
                  relate_list.push(this.getConfigName('cust_relation', man));
                }
              } else if (detail.info.hasOwnProperty('sex') && detail.info.sex === 2) { // 女
                const man_list = relate[1].split('|');
                for (const man of man_list) {
                  relate_list.push(this.getConfigName('cust_relation', man));
                }
              }
              cust.relation_name = relate_list.join('/');
            } else {
              cust.relation_name = this.getConfigName('cust_relation', cust.relation);
            }
          }
        }
        detail.relate_cust_number = detail.relate_cust.length;
      }
      // 时间线
      if (detail.hasOwnProperty('time_line')) {
        for (const line of detail.time_line) {
          if (line.hasOwnProperty('type')) {
            line.type_name = this.getConfigName('interact_type', line.type);
          }
          line.create_time_name = agoTime(line.create_time);
          line.interact_time_name = agoTime(line.interact_time);
          switch (line.type) {
            case CustConst.interact_type.other: // 其它
              break;
            case CustConst.interact_type.new_car_sell: // 新车销售
              if (line.abstract.hasOwnProperty('car_color')) {
                line.abstract.car_color_name = this.getConfigName('car_color', line.abstract.car_color);
              }
              if (line.abstract.hasOwnProperty('car_inner_color')) {
                line.abstract.car_inner_color_name = this.getConfigName('car_inner_color', line.abstract.car_inner_color);
              }
              break;
            case CustConst.interact_type.old_car_sell: // 二手车销售
              if (line.abstract.hasOwnProperty('car_color')) {
                line.abstract.car_color_name = this.getConfigName('car_color', line.abstract.car_color);
              }
              if (line.abstract.hasOwnProperty('car_inner_color')) {
                line.abstract.car_inner_color_name = this.getConfigName('car_inner_color', line.abstract.car_inner_color);
              }
              break;
            case CustConst.interact_type.old_car_purchase: // 二手车收购
              if (line.abstract.hasOwnProperty('car_color')) {
                line.abstract.car_color_name = this.getConfigName('car_color', line.abstract.car_color);
              }
              if (line.abstract.hasOwnProperty('car_inner_color')) {
                line.abstract.car_inner_color_name = this.getConfigName('car_inner_color', line.abstract.car_inner_color);
              }
              break;
            case CustConst.interact_type.old_car_exchange: // 二手车置换
              if (line.abstract.hasOwnProperty('car_color')) {
                line.abstract.car_color_name = this.getConfigName('car_color', line.abstract.car_color);
              }
              if (line.abstract.hasOwnProperty('car_inner_color')) {
                line.abstract.car_inner_color_name = this.getConfigName('car_inner_color', line.abstract.car_inner_color);
              }
              if (line.abstract.hasOwnProperty('old')) {
                if (line.abstract.old.hasOwnProperty('car_color')) {
                  line.abstract.old.car_color_name = this.getConfigName('car_color', line.abstract.old.car_color);
                }
                if (line.abstract.old.hasOwnProperty('car_inner_color')) {
                  line.abstract.old.car_inner_color_name = this.getConfigName('car_inner_color', line.abstract.old.car_inner_color);
                }
              }
              break;
            case CustConst.interact_type.repair_maintain: // 维修保养
              if (line.abstract.hasOwnProperty('maintain') && line.abstract.maintain.hasOwnProperty('maintain_type')) {
                line.abstract.maintain.maintain_type_name = this.getConfigName('maintain_type', line.abstract.maintain.maintain_type);
              }
              break;
            case CustConst.interact_type.accident_car_repair: // 事故车维修
              break;
            case CustConst.interact_type.complaint: // 投诉
              if (line.abstract.hasOwnProperty('complaint_type')) {
                line.abstract.complaint_type_name = [];
                for (const ct of line.abstract.complaint_type) {
                  line.abstract.complaint_type_name.push(this.getConfigName('complaint_type', ct));
                }
              }
              line.create_time_name = agoTime(line.create_time);
              break;
            default: // 系统消息
              break;
          }
        }
      }

      return detail;
    }

    searchDoc(client) {
      let doc = {};
      if (client === PC) {
        doc = {
          'info.name': 1,
          'info.tel': 1,
          belong: 1,
        };
      } else if (client === weChat) {
        doc = {
          time_line: 0,
        };
      }

      return doc;
    }

    makeSearchList(data, client) {
      if (client === PC) {
        for (const item of data) {
          item.name = item.info.name;
          item.tel = item.info.tel;
          delete item.info;
        }
      } else if (client === weChat) {
        this.batchGenPrefer(data);
      }

      return data;
    }

    searchQuery(qkey) {
      const query = {
        $or: [
          { 'info.name': { $regex: `.*${qkey}.*` } },
          { 'info.tel': { $regex: `.*${qkey}.*` } },
        ],
        // 'shop._id': { $in: shopids },
        delete: 0,
      };

      return this.addAuth(query);
    }

    // 添加权限
    addAuth(query) {
      switch (this.ctx.me.from) {
        case 'shop_user':
          query['shop._id'] = this.ctx.me.shop._id;
          break;
        case 'bee_user':
          query['belong.id'] = this.ctx.me._id;
          break;
        default:
      }

      return query;
    }

    searchSort(params) {
      const sort = {};
      if (!params) {
        sort.interact_time = -1;
      } else {
        if (params.create_time) {
          sort.create_time = params.create_time;
        }
        if (params.interact_time) {
          sort.interact_time = params.interact_time;
        }
      }
      return sort;
    }

    // 转换transfer_cars成中文名
    makeTransferCar(custinfo) {
      if (!custinfo || !custinfo.car_plan || custinfo.car_plan.length === 0
        || custinfo.own_car.length === 0) {
        this.logger.info('makeTransferCar::', JSON.stringify(custinfo));
        return;
      }

      for (const plan of custinfo.car_plan) {
        const transfer_cars = plan.transfer_cars;
        const transfer_cars_detail = [];
        for (const car_id of transfer_cars) {
          for (const owncar of custinfo.own_car) {
            const owncar_id = owncar._id.toString();
            if (car_id === owncar_id) {
              transfer_cars_detail.push({
                car_id: owncar_id,
                car_model_name: owncar.model_name,
              });
            }
          }
        }
        plan.transfer_cars_detail = transfer_cars_detail;
      }
    }

    // 清理已删除的车
    clearDeleteCar(carlist) {
      const list = [];
      if (!carlist || carlist.length === 0) return list;

      for (const car of carlist) {
        if (!car.delete) list.push(car);
      }

      return list;
    }

    // 从car_plan中找出当前购车计划
    getFromArray(list, id = null) {
      let current = null;
      if (list.length === 0) return current;

      for (const plan of list) {
        if (id && plan._id.toString() !== id.toString()) continue;
        if (!id && plan.delete === 1) continue;
        current = plan;
        break;
      }
      return current;
    }

    // 获取已有车辆状态
    * getOwnCarStatus(custid, owncarid) {
      if (!custid || !owncarid) {
        this.logger.error('getOwnCarStatus::', custid, owncarid);
        throw new SpruceError(ErrorStatus.args_error);
      }
      const query = { _id: custid, 'own_car._id': owncarid };
      const proj = { _id: 0, 'own_car.$.is_resell': 1 };
      const rest = yield this.model.findOne(query, proj).lean();

      if (!rest) {
        this.logger.error('getOwnCarStatus::', custid, owncarid);
        throw new SpruceError(ErrorStatus.owncar_not_found);
      }

      return rest.own_car[0].is_resell;
    }

    /** ******************
     * 附属方法
     * end
     */


    /** ******************
     * 任务触发
     * start
     */

    // 更新购车计划时 任务分析
    * analysePlan(newdata, olddata, carplanid) {
      // 1. 触发最新计划
      yield this.triggerCarPlanTask(newdata, carplanid, false);

      // 2. 触发附加任务
      const newplan = this.getFromArray(newdata.car_plan, carplanid);
      const oldplan = this.getFromArray(olddata.car_plan, carplanid);

      if (!newplan || !oldplan) {
        this.logger.info('analysePlan no plan::', arguments);
        return;
      }

      if (
        newplan.is_transfer === 0 && oldplan.is_transfer === 1 // 置换变非置换
        || newplan.is_transfer === 1 && (newplan.transfer_cars[0] !== oldplan.transfer_cars[0]) // 置换车辆改变
      ) {
        // 释放车辆
        yield this.releaseOwnCar(newdata._id, oldplan);

      }


    }

    // 购车计划
    * triggerCarPlanTask(custInfo, carplanid = null, is_delete = false) {
      if (!custInfo) return;
      delete custInfo.time_line; // 不传时间线字段

      // 定位计划
      const car_plan = this.getFromArray(custInfo.car_plan, carplanid);

      if (!car_plan) {
        this.logger.info('triggerCarPlanTask no plan::',
          JSON.stringify(custInfo), carplanid);
        return;
      }

      const { _id, is_transfer, transfer_cars, buy_date_type } = car_plan;

      // 触发
      const eventtype = is_transfer === 0 ?
        event_category.buy_car_plan : event_category.replace_car_plan;

      if (is_delete) {
        // 删除计划

        yield this.taskenginee.removeRule(eventtype, { id: _id });
        // 如果是置换计划 释放被置换车辆
        if (is_transfer === 1) {
          yield this.releaseOwnCar(custInfo._id, car_plan);
        }

      } else if (car_plan.car_buy_time === 0) {
        // 暂不购车
        yield this.taskenginee.removeRule(eventtype, { id: _id });
      } else {
        const task_params = { cust: custInfo, car_plan_id: _id };
        yield this.taskenginee.process(eventtype, task_params);

        // 如果是置换计划 更新已有车辆
        if (is_transfer === 1) {
          yield this.updateOwnCarResell(
            custInfo._id, transfer_cars, buy_date_type, true, false);
        }
      }


    }

    // 已有车辆
    * triggerOwnCarTask(custInfo, own_car_id, is_remove = false) {
      if (!custInfo || !custInfo.own_car) {
        this.logger.error('triggerOwnCarTask::', arguments);
        throw new SpruceError(ErrorStatus.args_error);
      }

      // 找到符合条件的车
      const current_car = this.getFromArray(custInfo.own_car, own_car_id);

      if (!current_car) {
        this.logger.error('triggerOwnCarTask no current_car::%s::%s',
          own_car_id, JSON.stringify(custInfo.own_car));
        throw new SpruceError(ErrorStatus.trigger_fail);
      }

      const { _id: carid, is_resell, resell_date_type } = current_car;

      const taskCat =
        (Object.is(resell_date_type, null) || Object.is(resell_date_type, undefined)) ?
          event_category.care_car_plan : event_category.sell_car_plan;

      if (is_remove) {
        yield this.taskenginee.removeRule(taskCat, { id: carid });
        // 如果该车是置换的车，改对应购车计划
        if (is_resell === CustConst.resell_situation.exchange) {
          yield this._updPlanWhenDelTransferCar(custInfo._id, carid);
        }

      } else {
        const params = { cust: custInfo, car: current_car };
        yield this.taskenginee.process(taskCat, params);
      }

    }

    // 删除置换车辆后，需更新对应的置换计划为普通计划
    * _updPlanWhenDelTransferCar(custid, transfer_car_id) {
      if (!custid || !transfer_car_id) {
        this.logger.error('_updPlanWhenDelTransferCar::', arguments);
        throw new SpruceError(ErrorStatus.args_error);
      }

      const custinfo = yield this.getCarPlan(custid);

      if (!custinfo || !custinfo.car_plan) return;
      if (custinfo.car_plan.is_transfer === 0) return;
      if (custinfo.car_plan.transfer_cars[0].toString() !== transfer_car_id.toString()) return;

      yield this.revertCarPlan(custid, custinfo.car_plan._id);

    }

    // 客户资料补全任务
    * triggerFillDataTask(custInfo) {
      if (!custInfo) return;

      const params = Object.assign(
        { belong: custInfo.belong, cust_id: custInfo._id },
        custInfo.info
      );
      yield this.taskenginee.process(event_category.cust_info, params);
    }

    /** ******************
     * 任务触发
     * start
     */
  }

  return CustService;
};
