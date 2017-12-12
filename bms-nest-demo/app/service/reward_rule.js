'use strict';
const Const = require('../common/const');
const Util = require('../common/util');
module.exports = app => {
  class RewardRuleService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.model = this.ctx.getModel('reward_rule');
    }

    /**
     * 当前有效的规则
     *
     * @author Tim
     * @return {rule} list 有效规则列表
     * @memberof RewardService
     */
    * currentValidRuleMap() {
      yield this.makeValidRule();
      const result = yield this.getRuleByDateAndShopId(new Date());
      const map = result.reduce(function(map, rule) {
        console.log(`[RewardRuleService] 当前有效规则：id:${rule._id} shop:${JSON.stringify(rule.shop)}`);
        map.set(rule.shop.id, rule);
        return map;
      }, new Map());
      return map;
    }

    /**
     * 4s店某个日期的有效的规则
     *
     * @author Tim
     * @param {date} date 日期
     * @param {shopId} shopId 4s店id
     * @return {list} 有效规则
     * @memberof RewardService
     */
    * getRuleByDateAndShopId(date = new Date(), shopId = null) {
      const where = { delete: { $ne: Const.delete.yes } };// 未删除
      where.status = Const.reward.ruleStatus.available;
      if (shopId) {
        where['shop.id'] = shopId;
      }
      const time = Util.dateFormat(date);
      const end_time = Util.dayEnd(date);
      where.$or = [
        { begin_time: { $lte: time }, end_time: { $gte: end_time } },
        { begin_time: { $lte: time }, end_time: { $exists: false } }, // 当天无新规则，end_time为空
      ];
      const list = yield this.model.find(where).lean(true);
      return list;
    }


    /**
     * 4s店规则
     * @param {shopId} shopId 4s店
     * @return {list} 规则列表
     */
    * shopRules(shopId) {
      const data = yield this.getRuleByDateAndShopId(new Date(), shopId);
      if (data.length > 0) { // data空数组
        yield this._formateRule(data);
      }
      return data;
    }

    /**
     * 历史规则
     * 查询可用的历史规则
     * @param {param} param 4s店
     * @return {{list: *, total: *}} 历史规则
     */
    * historyRules(param) {
      const query = { delete: { $ne: Const.delete.yes } };// 未删除
      const begin_time = Util.dayStart(new Date());
      const end_time = Util.dayEnd(new Date());

      // 若包括当前规则
      if (param.include_current) {
        query.status = 1; // 生效的规则
        query.$or = [
          { begin_time: { $lte: begin_time }, end_time: { $lte: end_time } },
          { begin_time: { $lte: begin_time }, end_time: { $exists: false } },
        ];
      }

      if (param.shop) {
        query['shop.id'] = param.shop.id;
      }

      const opt = { lean: true, limit: 0, skip: 0 };
      const { page, size } = param;
      if (size) {
        opt.limit = parseInt(size);
      }
      if (page) {
        opt.skip = size * (page - 1);
      }

      // 默认以创建时间倒叙排序
      if (!param.sort) {
        opt.sort = { create_time: -1 };
      } else {
        opt.sort = param.sort;
      }
      const select = { _id: 1, creator: 1, create_time: 1, begin_time: 1, end_time: 1, status: 1 };
      const [ list, total ] = yield this.app.myutil.parallel([
        this.model.find(query, select, opt),
        this.model.count(query),
      ]);
      return { list, total };
    }


    * update(rule) {

      // 设置当前任务结束时间为当天24点
      const end_time = Util.dayEnd(new Date());
      // 更新该4s店的ent_time 为 null的规则的结束时间，表明当天结束,不改变可用状态
      yield this.model.update({ end_time: null, 'shop.id': rule.shop.id }, { $set: { end_time } });
      delete rule._id;
      delete rule.end_time;
      // 生成新的规则
      rule.creator = {
        id: this.ctx.me._id,
        name: this.ctx.me.info.name, // 姓名
        from: this.ctx.me.from,
      };
      const ruleData = yield this._create(rule);
      const data = yield this.detail(ruleData._id);
      return data;
    }


    * makeValidRule() {
      // 使状态为不可用&&结束时间为空的规则生效
      const query = { end_time: { $exists: false }, status: Const.reward.ruleStatus.disable };
      query.begin_time = Util.dayStart(new Date()); // 当天规则生效
      const result = yield this.model.update(query, { $set: { status: Const.reward.ruleStatus.available } }, { multi: true });
      console.log(`[RewardRuleService] makeValidRule 新规则生效数量:${result.nModified}`);
    }


    * detail(_id) {
      const data = yield this.model.findOne({ _id }).lean(true);
      yield this._formateRule(data);
      return data;
    }

    * latestRule(shopId) {
      if (!shopId) { return; }
      const query = {};
      if (shopId) {
        query['shop.id'] = shopId;
      }
      const opt = { sort: { create_time: -1 }, lean: true };
      const data = yield this.model.findOne(query, null, opt);
      if (data) {
        yield this._formateRule(data);
      }
      return data;
    }

    * _create(rule) {
      rule.create_time = Util.now();
      rule.begin_time = Util.dayStart(Util.dateAddDays(new Date(), 1));
      rule.status = Const.reward.ruleStatus.disable;// 默认不可用
      rule.rule = yield this._combineRules(rule.rule);
      const data = yield this.model.create(rule);
      return data;
    }

    * _combineRules(rule) {
      const data = [];
      for (const [ k, v ] of Object.entries(rule)) {
        v.category = Const.custService.category[k];
        data.push(v);
      }
      return data;
    }

    * _formateRule(rule) {
      const data = {};
      let category_name;

      if (rule instanceof Array) {
        rule.forEach(item => {
          item.rule.forEach(one => {
            for (const [ k, v ] of Object.entries(Const.custService.category)) {
              if (v === one.category) { category_name = k; }
            }
            delete one.category;
            data[category_name] = one;
          });
          item.rule = data;
        });
      } else {
        rule.rule.forEach(one => {
          for (const [ k, v ] of Object.entries(Const.custService.category)) {
            if (v === one.category) { category_name = k; }
          }
          delete one.category;
          data[category_name] = one;
        });
        rule.rule = data;
      }
    }
  }
  return RewardRuleService;
};
