'use strict';

module.exports = app => {
  class RegionService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.model = this.ctx.getModel('region');
    }

    * list() {
      const where = { category: 'province' };
      const data = yield this.model.find(where, { code: 1, name: 1, _id: 1 }, { sort: { code: 1 } });
      const res = {
        list: data,
      };
      return res;
    }

    * getCity(code) {
      const where = { category: 'city' };
      if (code) {
        where.ancestors = code;
      }

      const data = yield this.model.find(where, { code: 1, name: 1, _id: 1 }, { sort: { code: 1 } });
      const res = {
        list: data,
      };
      return res;
    }

    * getArea(code) {
      const where = { category: 'area' };
      if (code) {
        where.ancestors = code;
      }

      const data = yield this.model.find(where, { code: 1, name: 1, _id: 1 }, { sort: { code: 1 } });
      const res = {
        list: data,
      };
      return res;
    }
  }
  return RegionService;
};
