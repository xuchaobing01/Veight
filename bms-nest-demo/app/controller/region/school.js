'use strict';
const ValidateSchool = require('../../validate/school');
module.exports = app => {
  class SchoolController extends app.Controller {
    * list() {
      this.validate(ValidateSchool.list);
      const param = this.params.school;
      const data = yield this.getService('school').list(param);
      if (data) {
        this.success(data);
      } else {
        this.error('获取列表失败');
      }
    }
  }
  return SchoolController;
};
