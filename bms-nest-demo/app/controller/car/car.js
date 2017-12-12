'use strict';

// const validate = require('../../validate/car.js');

module.exports = app => {

  class CarController extends app.Controller {

    * search() {
      const qkey = this.params.qkey;
      const size = this.params.size;
      const data = yield this.getService('car').doSearch(qkey, size);
      data ? this.success(data) : this.error('查询失败');
    }

    * getBrandList() {
      const data = yield this.getService('car').getBrandList();
      data ? this.success(data) : this.error('查询失败');
    }

    * getTypeList() {
      const data = yield this.getService('car').getTypeListById(this.params.bid);
      data ? this.success(data) : this.error('查询失败');
    }

    * getModelList() {
      const data = yield this.getService('car').getModelListById(this.params.tid);
      data ? this.success(data) : this.error('查询失败');
    }


  }

  return CarController;
};
