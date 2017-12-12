'use strict';
module.exports = app => {
  class StatisticsUserService extends app.Service {
    * customerAndBill(params) {
      const data = {};
      data.customer = yield this._beeCustomerCount(params); // 客户数
      data.bill = yield this._bill(params); // 交易信息
      return data;
    }

    * _beeCustomerCount(params) {
      const customer = yield this.ctx.getService('cust').countCustByBee(params.choice.user.id);
      return customer;
    }

    * _bill(params) {
      const res = { income: 0, total: 0 };
      params.choice.status = 0; // 排除已作废账单
      const data = yield this.ctx.getService('bill').list(params);
      if (data.total === 0) {
        return res;
      }

      const base_num = Math.pow(10, 6);

      data.list.forEach(one => {
        res.income = res.income + (one.income ? one.income : 0) * base_num;
      });
      res.income = res.income / base_num;
      res.total = data.total;
      return res;
    }
  }
  return StatisticsUserService;
};
