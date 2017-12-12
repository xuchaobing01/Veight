'use strict';

const ValidateRewardRule = require('../../validate/reward_rule');

module.exports = app => {
  class RuleController extends app.Controller {


    /**
     * 查询4s店提成规则
     */
    * shopRules() {
      this.validate(ValidateRewardRule.shopRules);
      const data = yield this.getService('rewardRule').shopRules(this.params.shop_id);
      const res = data.length !== 0 ? data[0] : null;
      this.success(res);
    }

    /**
     * 设置提成规则
     */
    * update() {
      this.validate(ValidateRewardRule.update);
      // console.log('数据' + JSON.stringify(this.params));
      const rule = this.params;
      const data = yield this.getService('rewardRule').update(rule);
      if (data) {
        this.success(data);
      } else {
        this.error('设置失败');
      }
    }

    /**
     * 提成规则详情
     */
    * detail() {
      this.validate(ValidateRewardRule.detail);
      const { _id } = this.params;
      const data = yield this.getService('rewardRule').detail(_id);
      if (data) {
        this.success(data);
      } else {
        this.error('详情获取失败');
      }
    }

    /**
     * 某4S店历史提成规则
     */
    * historyRules() {
      this.validate(ValidateRewardRule.historyRules);
      const data = yield this.getService('rewardRule').historyRules(this.params);
      if (data) {
        this.success(data);
      } else {
        this.error('获取失败');
      }
    }

    /**
     * 4S店最新一条规则
     */
    * latestRule() {
      this.validate(ValidateRewardRule.shopRules);
      const data = yield this.getService('rewardRule').latestRule(this.params.shop_id);
      this.success(data);
    }
  }
  return RuleController;
};
