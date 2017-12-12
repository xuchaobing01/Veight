'use strict';
const ValidateBill = require('../../validate/bill');
module.exports = app => {
  class BillController extends app.Controller {
    /**
     * @description 账单列表
     * @param {Object} 查询列表参数
     *  {page, size, qkey, choice:{user,shop}, group:{},sort:{create_time:-1}}
     */
    * list() {
      this.validate(ValidateBill.billList);
      // console.log('数据' + JSON.stringify(this.params));
      const data = yield this.getService('bill').list(this.params);
      if (data) {
        this.success(data);
      } else {
        this.error('获取列表失败');
      }
    }

    * detail() {
      this.validate(ValidateBill.detail);
      const { _id } = this.params;
      const data = yield this.getService('bill').billDetail(_id);
      if (data) {
        this.success(data);
      } else {
        this.error('详情获取失败');
      }
    }

    * delete() {
      const { _id } = this.params;
      const data = yield this.getService('bill').delete(_id);
      if (data) {
        this.success(data);
      } else {
        this.error('账单删除失败');
      }
    }

    * cancel() {
      this.validate(ValidateBill.cancel);
      const bill = {
        _id: this.params,
      };
      bill.user = {
        id: this.ctx.me._id,
        name: this.ctx.me.username,
        from: this.ctx.me.from,
      };
      const data = yield this.getService('bill').cancel(bill);
      if (data) {
        this.success(data);
      } else {
        this.error('账单取消失败');
      }
    }

    * beeList() {
      this.validate(ValidateBill.billList);
      const params = this.params;
      const user = { id: this.ctx.me._id };
      if (!params.choice) {
        params.choice = {};
      }
      params.choice.user = user; // bee用户
      const data = yield this.getService('bill').list(params);
      if (data) {
        this.success(data);
      } else {
        this.error('获取列表失败');
      }
    }
  }
  return BillController;
};
