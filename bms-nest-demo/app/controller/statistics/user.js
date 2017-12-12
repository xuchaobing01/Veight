'use strict';
const ValidateStatisticsUser = require('../../validate/statistics_user');
module.exports = app => {
  class UserController extends app.Controller {
    * index() {
      this.validate(ValidateStatisticsUser.customerAndBill);
      const data = yield this.getService('statisticsUser').customerAndBill(this.params);
      if (data) {
        this.success(data);
      } else {
        this.error('获取失败');
      }
    }
  }
  return UserController;
};
