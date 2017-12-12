'use strict';

// 规则：地址
const addrRule = {
  province: { type: 'string', required: false },
  province_name: { type: 'string', required: false },
  city: { type: 'string', required: false },
  city_name: { type: 'string', required: false },
  region: { type: 'string', required: false },
  region_name: { type: 'string', required: false },
  addr: { type: 'string', allowEmpty: true, required: false },
};

// 规则：基本信息
const infoRule = {
  name: { type: 'string', required: true },
  brith: { type: 'date', allowEmpty: true, required: false },
  sex: { type: 'number', required: true },
  eduction: { type: 'number', required: false },
  wechat: { type: 'string', allowEmpty: true, required: false },
  email: { type: 'string', allowEmpty: true, required: false },
  hobby: { type: 'array', required: false },
  tel: { type: 'string', required: true },
  family: {
    type: 'object',
    required: false,
    rule: {
      situation: { type: 'number', required: false },
      earning: { type: 'number', required: false },
      location: { type: 'object', rule: addrRule, required: false },
    },
  },
  job: {
    type: 'object',
    required: false,
    rule: {
      occupation: { type: 'number', required: false },
      company: { type: 'string', allowEmpty: true, required: false },
      location: { type: 'object', rule: addrRule, required: false },
    },
  },
  tags: { type: 'array', required: false },
  comment: { type: 'string', allowEmpty: true, required: false },
};

// 规则：关联客户
const relateCustRule = {
  cust_id: { type: 'string', required: false },
  name: { type: 'string', required: false },
  relation: { type: 'string', required: false },
  tel: { type: 'string', required: false },
  location: { type: 'object', rule: addrRule, required: false },
};

// 客户创建，修改
const saveRule = {
  info: { type: 'object', rule: infoRule, required: true },
  relate_cust: { type: 'array', itemType: 'object', rule: relateCustRule, required: false },
};

// 一次更新、保存所有车
const saveAllOwnCarRule = {
  cust_id: { type: 'string', required: true },
  car_list: {
    type: 'array',
    required: true,
    itemType: 'object',
    rule: {
      brand_id: { type: 'number', required: true },
      brand_name: { type: 'string', required: true },
      type_id: { type: 'number', required: true },
      type_name: { type: 'string', required: true },
      model_id: { type: 'number', required: true },
      model_name: { type: 'string', required: true },
      import: { type: 'number', required: true },
      car_color: { type: 'number', required: false },
      car_inner_color: { type: 'number', required: false },
      plate_location: { type: 'object', rule: addrRule, required: false },
      plate_time: { type: 'date', required: false },
      price: { type: 'number', required: false, min: 0 },
      per_mileage: { type: 'number', required: false, min: 0 },
      is_resell: { type: 'number', required: false },
      resell_date_type: { type: 'number', required: false },
    },
  },
};

// 添加拥有车辆
const addOwnCarRule = {
  cust_id: { type: 'string', required: true },
  car_info: {
    type: 'object',
    rule: {
      brand_id: { type: 'number', required: true },
      brand_name: { type: 'string', required: true },
      type_id: { type: 'number', required: true },
      type_name: { type: 'string', required: true },
      model_id: { type: 'number', required: true },
      model_name: { type: 'string', required: true },
      import: { type: 'number', required: true },
      car_color: { type: 'number', required: false },
      car_inner_color: { type: 'number', required: false },
      plate_location: { type: 'object', rule: addrRule, required: false },
      plate_time: { type: 'date', required: false },
      price: { type: 'number', required: false, min: 0 },
      per_mileage: { type: 'number', required: false, min: 0 },
      is_resell: { type: 'number', required: false },
      resell_date_type: { type: 'number', required: false },
    },
  },
};

// 添加购车计划
const addCarPlanRule = {
  cust_id: { type: 'string', required: true },
  plan_info: {
    type: 'object',
    rule: {
      use_to: { type: 'number', required: true },
      car_type: { type: 'number', required: true },
      prefer_cars: {
        type: 'array',
        required: false,
        itemType: 'object',
        rule: {
          brand_id: { type: 'number', required: false },
          brand_name: { type: 'string', required: false },
          type_id: { type: 'number', required: false },
          type_name: { type: 'string', required: false },
          model_id: { type: 'number', required: false },
          model_name: { type: 'string', required: false },
          car_color: { type: 'number', required: false },
          car_inner_color: { type: 'number', required: false },
        },
      },
      budget_type: { type: 'number', required: true },
      buy_date_type: { type: 'number', required: true },
      brand_type: { type: 'number', required: false },
      is_transfer: { type: 'number', required: false },
      transfer_cars: { type: 'array', required: false },
      prefer_side: { type: 'array', required: false },
    },
  },
};

// 更新一辆已有车辆
const updOneCarRule = {
  cust_id: { type: 'string', required: true },
  car_id: { type: 'string', required: true },
  car_info: {
    type: 'object',
    rule: {
      _id: { type: 'string', required: true },
      brand_id: { type: 'number', required: true },
      brand_name: { type: 'string', required: true },
      type_id: { type: 'number', required: true },
      type_name: { type: 'string', required: true },
      model_id: { type: 'number', required: true },
      model_name: { type: 'string', required: true },
      import: { type: 'number', required: true },
      car_color: { type: 'number', required: false },
      car_inner_color: { type: 'number', required: false },
      plate_location: { type: 'object', rule: addrRule, required: false },
      plate_time: { type: 'date', required: false },
      price: { type: 'number', required: false, min: 0 },
      per_mileage: { type: 'number', required: false, min: 0 },
      is_resell: { type: 'number', required: false },
      resell_date_type: { type: 'number', required: false },
    },
  },
};

// 更新购车计划
const updateCarPlanRule = {
  cust_id: { type: 'string', required: true },
  car_plan_id: { type: 'string', required: true },
  plan_info: {
    type: 'object',
    rule: {
      _id: { type: 'string', required: true },
      use_to: { type: 'number', required: true },
      car_type: { type: 'number', required: true },
      prefer_cars: {
        type: 'array',
        required: false,
        itemType: 'object',
        rule: {
          brand_id: { type: 'number', required: false },
          brand_name: { type: 'string', required: false },
          type_id: { type: 'number', required: false },
          type_name: { type: 'string', required: false },
          model_id: { type: 'number', required: false },
          model_name: { type: 'string', required: false },
          car_color: { type: 'number', required: false },
          car_inner_color: { type: 'number', required: false },
        },
      },
      budget_type: { type: 'number', required: true },
      buy_date_type: { type: 'number', required: true },
      brand_type: { type: 'number', required: false },
      is_transfer: { type: 'number', required: false },
      transfer_cars: { type: 'array', required: false },
      prefer_side: { type: 'array', required: false },
    },
  },
};

module.exports = {
  saveRule,
  addOwnCarRule,
  updOneCarRule,
  saveAllOwnCarRule,
  addCarPlanRule,
  updateCarPlanRule,
};
