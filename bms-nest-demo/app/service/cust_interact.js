'use strict';

const Cust = require('../common/cust.js');
const CustEnum = require('../common/cust_enum.js');
const _ = require('lodash');
const { SpruceError, ErrorStatus } = require('../common/spruce_error.js');
const Util = require('../common/util');
const Const = require('../common/const.js');
const moment = require('moment');

module.exports = app => {
  const { NEST } = app.myutil.Code;

  class CustInteractService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.model = this.getModel('cust_interact');
      this.custservice = this.ctx.service.cust;

    }

    * createInteract(params) {
      params.bill_status = 0; // init bill status
      const { _id: id, info: { name }, from } = this.ctx.me;
      params.belong = { id, name, from };
      params = this._addTypeName(params);

      const cust = yield this.getModel('cust').findOne({ _id: params.cust_id });
      if (!cust) {
        this.logger.error('createInteract not found cust::' + JSON.stringify(params));
        throw new SpruceError(ErrorStatus.cust_notfound);
      }
      const data = yield this.model.create(params);

      if (data) {
        yield this._syncCustCar(data.type, data.cust_id, data.toObject());
        yield this.calculateBill(data.toObject(), Const.billStatus.createBill); // 提成

        yield this._addTimeline(data); // add timeline
      }
      return data;
    }

    /**
     * 创建互动后同步客户车辆、计划信息
     * @param {int} interact_type 互动类型
     * @param {string} custid 客户id
     * @param {object} interact 互动内容
     * @private
     */
    * _syncCustCar(interact_type, custid, interact) {

      switch (interact_type) {
        case Cust.interact_type.new_car_sell:
          // 新车销售：添加拥有车辆、购车计划变为“历史购车计划”
          yield this.custservice.addOwnCar(custid,
            Util.objrename(interact.new_car_sell, [ 'car_price' ], [ 'price' ]));
          yield this.custservice.delCarPlan(custid, null, true);
          break;
        case Cust.interact_type.old_car_sell:
          // 二手车销售：同新车销售
          yield this.custservice.addOwnCar(custid,
            Util.objrename(interact.old_car_sell, [ 'car_price' ], [ 'price' ]));
          yield this.custservice.delCarPlan(custid, null, true);
          break;
        case Cust.interact_type.old_car_purchase:
          // 二手车采购：清除已有车辆中的车
          yield this.custservice.delOwnCar(custid,
            interact.old_car_purchase.car_id);
          break;
        case Cust.interact_type.old_car_exchange:
          // 被置换车辆在“已有车辆”中清除
          // 二手车置换：购车计划变为“历史购车计划”，添加拥有车辆
          yield this.custservice.delOwnCar(custid,
            interact.old_car_exchange.old.car_id); // 被置换车辆在“已有车辆”中清除。
          yield this.custservice.delCarPlan(custid, null, true); // 购车计划变为“历史购车计划”
          yield this.custservice.addOwnCar(custid,
            Util.objrename(interact.old_car_exchange, [ 'car_price' ], [ 'price' ])); // 添加拥有车辆
          break;
        default:
          return;
      }
    }


    // 计算账单提成
    * calculateBill(interact_info, type) {
      if (!interact_info || !type) return;

      if ([
        Cust.interact_type.other,
        Cust.interact_type.complaint,
      ].includes(interact_info.type)) return; // 类型：投诉、其它不产生账单

      if (type === Const.billStatus.createBill) { // 创建账单
        const custinfo = yield this.getModel('cust').findOne(
          { _id: interact_info.cust_id },
          { _id: 0, shop: 1 }
        );
        interact_info.shop = custinfo.shop[0];

        yield app.mqPublisher.bill.createBill(interact_info);
      } else if (type === Const.billStatus.cancelBill) { // 作废账单

        yield app.mqPublisher.bill.cancelBill({ _id: interact_info._id });
      }
    }

    // 计算提成完同步账单状态
    * notifyCreateBillAck(params) {
      if (!params) {
        this.logger.error('notifyCreateBillAck::', JSON.stringify(params));
        throw new SpruceError(ErrorStatus.args_error);
      }
      const rest = yield this.model.update(
        { _id: params.id },
        { bill_status: params.status }
      );
      return rest;
    }

    _addTypeName(params) {
      params.type_name = CustEnum.interact_type[params.type];
      return params;
    }

    * _addTimeline(interact) {
      const custid = interact.cust_id;
      const abstract = this.getAbstractByType(interact.type, interact);
      const timeline = { // 时间线标准参数
        processor: {
          id: this.ctx.me._id,
          from: this.ctx.me.from,
          name: this.ctx.me.info.name,
        },
        interact_time: interact.interact_time,
        type: interact.type,
        from_id: interact._id,
        abstract,
      };

      yield this.custservice.addTimeline(custid, timeline);
    }

    getAbstractByType(type, data) {
      let content;
      switch (type) {
        case Cust.interact_type.new_car_sell:
          content = data.new_car_sell;
          break;
        case Cust.interact_type.old_car_sell:
          content = data.old_car_sell;
          break;
        case Cust.interact_type.old_car_purchase:
          content = data.old_car_purchase;
          break;
        case Cust.interact_type.old_car_exchange:
          content = data.old_car_exchange;
          break;
        case Cust.interact_type.repair_maintain:
          content = data.repair_maintain;
          break;
        case Cust.interact_type.accident_car_repair:
          content = data.accident_car_repair;
          break;
        case Cust.interact_type.complaint:
          content = data.complaint;
          break;
        case Cust.interact_type.other:
          content = data.other;
          break;
        default:
          this.logger.error('getAbstractByType::', arguments);
          throw new SpruceError(ErrorStatus.interact_errtype);
      }
      return content;
    }

    * listInteract(params) {
      const query = {
        $or: [
          { cust_name: { $regex: `.*${params.qkey}.*` } },
          { cust_tel: { $regex: `.*${params.qkey}.*` } },
          { 'cust_belong.name': { $regex: `.*${params.qkey}.*` } },
          { type_name: { $regex: `.*${params.qkey}.*` } },
        ],
        'belong.id': this.ctx.me._id,
        delete: 0,
      };

      const doc = {
        create_time: 1,
        cust_name: 1,
        cust_tel: 1,
        'cust_belong.name': 1,
        type_name: 1,
        type: 1,
        interact_time: 1,
        cust_id: 1,
      };

      const sort = this._custSort(params.sort);
      const limit = parseInt(params.size);
      const skip = params.size * (params.page - 1);
      const list = yield this.model.find(query, doc)
        .sort(sort)
        .limit(limit)
        .skip(skip);
      const count = this.model.count(query);
      const data = yield this.app.myutil.parallel([ list, count ]);
      const res = {
        list: data[0],
        total: data[1],
      };

      return res;
    }

    _custSort(sort_params) {
      const sort = {};
      if (!sort_params) {
        sort.create_time = -1;
      }

      return sort;
    }

    * detailInteract(params) {
      const query = { _id: params._id };
      const data = yield this.model.findOne(query).lean();
      return data ? this._makeDetail(data) : '';
    }

    _makeDetail(data) {
      // 新车销售
      if (data.hasOwnProperty('new_car_sell')) {
        if (data.new_car_sell.hasOwnProperty('car_color')) {
          data.new_car_sell.car_color_name = this.custservice.getConfigName('car_color', data.new_car_sell.car_color);
        }
        if (data.new_car_sell.hasOwnProperty('car_inner_color')) {
          data.new_car_sell.car_inner_color_name = this.custservice.getConfigName('car_inner_color', data.new_car_sell.car_inner_color);
        }
      }
      // 二手车销售
      if (data.hasOwnProperty('old_car_sell')) {
        if (data.old_car_sell.hasOwnProperty('car_color')) {
          data.old_car_sell.car_color_name = this.custservice.getConfigName('car_color', data.old_car_sell.car_color);
        }
        if (data.old_car_sell.hasOwnProperty('car_inner_color')) {
          data.old_car_sell.car_inner_color_name = this.custservice.getConfigName('car_inner_color', data.old_car_sell.car_inner_color);
        }
      }
      // 二手车收购
      if (data.hasOwnProperty('old_car_purchase')) {
        if (data.old_car_purchase.hasOwnProperty('car_color')) {
          data.old_car_purchase.car_color_name = this.custservice.getConfigName('car_color', data.old_car_purchase.car_color);
        }
        if (data.old_car_purchase.hasOwnProperty('car_inner_color')) {
          data.old_car_purchase.car_inner_color_name = this.custservice.getConfigName('car_inner_color', data.old_car_purchase.car_inner_color);
        }
      }
      // 二手车置换
      if (data.hasOwnProperty('old_car_exchange')) {
        if (data.old_car_exchange.hasOwnProperty('old')) {
          if (data.old_car_exchange.old.hasOwnProperty('car_color')) {
            data.old_car_exchange.old.car_color_name = this.custservice.getConfigName('car_color', data.old_car_exchange.old.car_color);
          }
          if (data.old_car_exchange.old.hasOwnProperty('car_inner_color')) {
            data.old_car_exchange.old.car_inner_color_name = this.custservice.getConfigName('car_inner_color', data.old_car_exchange.old.car_inner_color);
          }
        }
        if (data.old_car_exchange.hasOwnProperty('car_color')) {
          data.old_car_exchange.car_color_name = this.custservice.getConfigName('car_color', data.old_car_exchange.car_color);
        }
        if (data.old_car_exchange.hasOwnProperty('car_inner_color')) {
          data.old_car_exchange.car_inner_color_name = this.custservice.getConfigName('car_inner_color', data.old_car_exchange.car_inner_color);
        }
      }
      // 维修保养
      if (data.hasOwnProperty('repair_maintain')) {
        if (data.repair_maintain.hasOwnProperty('maintain') && data.repair_maintain.maintain.hasOwnProperty('maintain_type')) {
          data.repair_maintain.maintain.maintain_type_name = this.custservice.getConfigName('maintain_type', data.repair_maintain.maintain.maintain_type);
        }
      }
      // 投诉
      if (data.hasOwnProperty('complaint')) {
        if (data.complaint.hasOwnProperty('complaint_type')) {
          data.complaint.complaint_type_name = [];
          for (const ct of data.complaint.complaint_type) {
            data.complaint.complaint_type_name.push(this.custservice.getConfigName('complaint_type', ct));
          }
        }
      }

      return data;
    }

    getInteractType() {
      const prevs = this.ctx.me.prev;
      const type = Cust.interact_type;
      const access_type = [];

      if (prevs.includes(NEST.cust_interact_type_shop_saler)) {
        access_type.push([
          type.new_car_sell, type.old_car_sell, type.old_car_purchase,
          type.old_car_exchange, type.other ]);
      }
      if (prevs.includes(NEST.cust_interact_type_shop_customer)) {
        access_type.push([ type.complaint, type.other ]);
      }
      if (prevs.includes(NEST.cust_interact_type_shop_servicer)) {
        access_type.push([
          type.repair_maintain, type.accident_car_repair, type.other ]);
      }
      return _.union(_.flatten(access_type));

    }

    // 作废互动
    * invalidInteract(param) {
      const { _id: id, info: { name }, from } = this.ctx.me;
      // 删除互动，添加作废人信息
      const interact_doc = {
        invalid_belong: { id, name, from },
        invalid_reason: param.reason,
        invalid_time: moment(),
        delete: 1,
      };
      const delInteract = yield this.model.findOneAndUpdate({ _id: param._id }, interact_doc);
      // 删除时间线
      const time_line_query = {
        'time_line.from_id': param._id,
        _id: param.cust_id,
      };
      const time_line_doc = {
        'time_line.$.invalid_belong': { id, name, from },
        'time_line.$.invalid_reason': param.reason,
        'time_line.$.invalid_time': moment(),
        'time_line.$.delete': 1,
      };
      const delTimeLIne = yield this.getModel('cust').findOneAndUpdate(time_line_query, { $set: time_line_doc });
      const [ interact, timeLIne ] = yield app.myutil.parallel([ delInteract, delTimeLIne ]);
      if (!interact || !timeLIne) {
        this.logger.error('invalidInteract error');
        throw new SpruceError(ErrorStatus.interact_invalidError);
      }
      // 作废账单提成
      yield this.calculateBill(param, Const.billStatus.cancelBill); // 提成

      return delTimeLIne;
    }

    // 作废账单提成
    * notifyCancelBillAck(params) {
      if (!params || params.status === Const.status.error) {
        this.logger.error('notifyCancelBillAck::', JSON.stringify(params));
        throw new SpruceError(ErrorStatus.args_error);
      }
      yield this.model.update({ _id: params._id }, { bill_status: Const.reward.payStatus.cancel });
      this.logger.info('notifyCancelBillAck update bill_status success');
    }


  }

  return CustInteractService;
};
