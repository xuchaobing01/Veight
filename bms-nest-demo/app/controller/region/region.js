'use strict';
const ValidateRegion = require('../../validate/region');
module.exports = app => {
  class RegionController extends app.Controller {
    /**
     * 获取省市列表
     */
    * list() {
      const data = yield this.getService('region').list();
      if (data) {
        this.success(data);
      } else {
        this.error('获取省市失败');
      }
    }

    /**
     * 获取省/市下市或区域信息
     */
    * getCity() {
      this.validate(ValidateRegion.getCity);
      const code = this.params.code;
      const data = yield this.getService('region').getCity(code);
      if (data) {
        this.success(data);
      } else {
        this.error('获取失败');
      }
    }

    /**
     * 根据市获取县信息
     */
    * getArea() {
      this.validate(ValidateRegion.getArea);
      const cityCode = this.params.code;
      const data = yield this.getService('region').getArea(cityCode);
      if (data) {
        this.success(data);
      } else {
        this.error('获取失败');
      }
    }
  }
  return RegionController;
};
