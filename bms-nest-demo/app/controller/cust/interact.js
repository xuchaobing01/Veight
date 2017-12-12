'use strict';

const Const = require('../../common/const');
const validate = require('../../validate/cust_interact.js');

module.exports = app => {
  const prevOps = require('../../common/prev-ops')(app);
  const { NEST } = app.myutil.Code;

  class InteractController extends app.Controller {
    constructor(ctx) {
      super(ctx);
      this.ops = {};
      this.ops[NEST.cust_interact_create] = prevOps.custInteract;
    }

    * create() {
      this.validate(validate.createRule, this.params);
      delete this.params.token;
      const data = yield this.getService('custInteract').createInteract(this.params);
      data ? this.success(data) : this.error('创建互动失败');
    }

    * list() {
      const data = yield this.getService('custInteract').listInteract(this.params);
      if (data) {
        data.ops = this.ctx.getOps(this.ops);
        this.success(data);
      } else {
        this.error('获取互动列表失败');
      }
    }

    * detail() {
      const data = yield this.getService('custInteract').detailInteract(this.params);
      data ? this.success(data) : this.error('获取互动记录失败');

    }

    * getType() {
      const data = this.getService('custInteract').getInteractType();
      data ? this.success(data) : this.error('获取互动类型失败');

    }

    // 互动作废
    * invalid() {
      this.validate(validate.invalidRule, this.params);
      const data = yield this.getService('custInteract').invalidInteract(this.params);
      data ? this.success(data) : this.error('互动作废失败！');
    }


  }

  return InteractController;
};
