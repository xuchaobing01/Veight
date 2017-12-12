'use strict';

const validate = require('../../validate/cust.js');
const CustEnum = require('../../common/cust_enum.js');

module.exports = app => {
  class CustController extends app.Controller {
    * save() {
      this.validate(validate.saveRule, this.params);
      let data = null;
      if (!this.params.id) {
        data = yield this.getService('cust').createCust(this.params);
      } else {
        const custId = this.params.id; delete this.params.id;
        data = yield this.getService('cust')
          .updateCust(custId, this.params);
      }

      data ? this.success(data) : this.error('新增客户资料失败');
    }

    * list() {
      const data = yield this.getService('cust').getCustList(this.params);
      data ? this.success(data) : this.error('获取客户列表失败');
    }

    * delete() {
      const custId = yield this.getService('cust')
        .deleteCustById(this.params.id);
      custId ? this.success(custId) : this.error('删除客户失败');
    }

    getConf() {
      const conf_names = this.params.conf_name.split(',');
      const configs = {};
      for (const name of conf_names) {
        if (CustEnum[name]) {
          configs[name] = CustEnum[name];
        }
      }
      this.success(configs);
    }

    // 客户详情
    * detail() {
      const data = yield this.getService('cust').getCustDetail(this.params.cust_id);
      data ? this.success(data) : this.error('获取客户详情失败！');
    }

    // 根据客户名称，手机号模糊查询客户
    // 最多显示20个，排序没有要求
    * search() {
      const data = yield this.getService('cust').searchCust(this.params);
      data ? this.success(data) : this.error('获取客户名称失败！');
    }

    // 根据客户id搜索已有车辆信息
    * getOwnCar() {
      const data = yield this.getService('cust').getCarList(this.params.cust_id);
      data ? this.success({ list: data }) : this.error('获取车辆列表失败！');
    }

    // 根据已有车辆id搜索车辆信息
    * getOneCar() {
      const data = yield this.getService('cust').getCarById(
        this.params.cust_id, this.params.car_id);
      data ? this.success(data) : this.error('获取车辆信息失败');
    }

    // 更新一个车
    * updateOneCar() {
      this.validate(validate.updOneCarRule, this.params);
      const data = yield this.getService('cust').updateCarById(
        this.params.cust_id, this.params.car_id, this.params.car_info);
      data ? this.success(data) : this.error('更新已有车辆失败');
    }

    * addOwnCar() {
      this.validate(validate.addOwnCarRule, this.params);
      const data = yield this.getService('cust').addOwnCar(
        this.params.cust_id, this.params.car_info);
      data ? this.success(data) : this.error('添加已有车辆失败');
    }

    * delOwnCar() {
      const data = yield this.getService('cust')
        .delOwnCar(this.params.cust_id, this.params.own_car_id);
      data ? this.success(data) : this.error('删除已有车辆失败');
    }

    * addCarPlan() {
      this.validate(validate.addCarPlanRule, this.params);
      const data = yield this.getService('cust').addCarPlan(
        this.params.cust_id,
        this.params.plan_info
      );
      data ? this.success(data) : this.error('添加购车计划失败');
    }

    * updateCarPlan() {
      this.validate(validate.updateCarPlanRule, this.params);
      const data = yield this.getService('cust').updateCarPlan(
        this.params.cust_id,
        this.params.car_plan_id,
        this.params.plan_info
      );
      data ? this.success(data) : this.error('更新购车计划失败');
    }

    * getCarPlan() {
      let data = yield this.getService('cust').getCarPlan(
        this.params.cust_id,
        this.params.car_plan_id
      );
      if (!data) data = {}; // 前端要求
      this.success(data);
    }

    * delCarPlan() {
      const data = yield this.getService('cust')
        .delCarPlan(this.params.cust_id, this.params.car_plan_id, false);
      data ? this.success(data) : this.error('删除购车计划失败');
    }

  }

  return CustController;
};
