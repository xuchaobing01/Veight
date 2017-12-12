'use strict';

module.exports = app => {
  class SchoolService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.model = this.ctx.getModel('school');
    }

    * list(param) {
      const where = {};
      if (param.name) {
        where.name = param.name;
      }
      if (param.city) {
        where.city = param.city;
      }
      const data = yield this.model.find(where, { _id: 0 });
      const res = {
        list: data,
      };
      return res;
    }
  }
  return SchoolService;
};
