'use strict';

// 规则：地址
const addrRule = {
  province: { type: 'string', required: true },
  city: { type: 'string', required: true },
  region: { type: 'string', required: true },
};

// 规则：新车销售
const newCarSellRule = {
  brand_id: { type: 'number', required: true },
  brand_name: { type: 'string', required: true },
  type_id: { type: 'number', required: true },
  type_name: { type: 'string', required: true },
  model_id: { type: 'number', required: true },
  model_name: { type: 'string', required: true },
  car_color: { type: 'number', required: true },
  car_inner_color: { type: 'number', required: true },
  car_price: { type: 'number', required: true },
  car_vin: { type: 'string', required: true },
  plate_location: { type: 'object', rule: addrRule, required: true },
  import: { type: 'number', required: true },
  installment_money: { type: 'number', required: false },
  installment_limit: { type: 'number', required: false },
  product_money: { type: 'number', required: false },
  product_item: { type: 'string', required: false },
  insurance_agency: { type: 'string', required: false },
  insurance_money: { type: 'number', required: false },
  warrant_limit: { type: 'number', required: false },
  warrant_money: { type: 'number', required: false },
  gift_money: { type: 'number', required: false },
  other_money: { type: 'number', required: false },
  des: { type: 'string', required: false },
};

// 规则：二手车销售
const oldCarSellRule = {
  brand_id: { type: 'number', required: true },
  brand_name: { type: 'string', required: true },
  type_id: { type: 'number', required: true },
  type_name: { type: 'string', required: true },
  model_id: { type: 'number', required: true },
  model_name: { type: 'string', required: true },
  car_color: { type: 'number', required: true },
  car_inner_color: { type: 'number', required: true },
  car_price: { type: 'number', required: true },
  car_vin: { type: 'string', required: true },
  transfer_num: { type: 'number', required: true },
  mileage: { type: 'number', required: true },
  new_plate_location: { type: 'object', rule: addrRule, required: true },
  import: { type: 'number', required: true },
  installment_money: { type: 'number', required: false },
  installment_limit: { type: 'number', required: false },
  product_money: { type: 'number', required: false },
  product_item: { type: 'string', required: false },
  insurance_agency: { type: 'string', required: false },
  insurance_money: { type: 'number', required: false },
  warrant_limit: { type: 'number', required: false },
  warrant_money: { type: 'number', required: false },
  gift_money: { type: 'number', required: false },
  other_money: { type: 'number', required: false },
  des: { type: 'string', required: false },
};

// 规则：二手车收购
const oldCarPurchaseRule = {
  car_id: { type: 'string', required: true },
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
  mileage: { type: 'number', required: false }, // 行驶里程
  transfer_num: { type: 'number', required: false }, // 过户次数
  car_vin: { type: 'string', required: false },
  purchase_price: { type: 'number', required: true }, // 收购价
  des: { type: 'string', required: false },
};

// 规则：二手车置换
const oldCarExchangeRule = {
  old: {
    type: 'object',
    rule: {
      car_id: { type: 'string', required: true },
      brand_id: { type: 'number', required: true },
      brand_name: { type: 'string', required: true },
      type_id: { type: 'number', required: true },
      type_name: { type: 'string', required: true },
      model_id: { type: 'number', required: true },
      model_name: { type: 'string', required: true },
      car_color: { type: 'number', required: false },
      import: { type: 'number', required: true },
      car_inner_color: { type: 'number', required: false },
      plate_location: { type: 'object', rule: addrRule, required: false },
      mileage: { type: 'number', required: false }, // 行驶里程
      transfer_num: { type: 'number', required: false }, // 过户次数
      car_vin: { type: 'string', required: false },
      purchase_price: { type: 'number', required: true }, // 收购价
    },
  },
  brand_id: { type: 'number', required: true },
  brand_name: { type: 'string', required: true },
  type_id: { type: 'number', required: true },
  type_name: { type: 'string', required: true },
  model_id: { type: 'number', required: true },
  model_name: { type: 'string', required: true },
  car_color: { type: 'number', required: true },
  car_inner_color: { type: 'number', required: true },
  car_price: { type: 'number', required: true }, // 车辆售价
  car_vin: { type: 'string', required: true }, // 车架号
  import: { type: 'number', required: true },
  plate_location: { type: 'object', rule: addrRule, required: true }, // 上牌地址
  installment_money: { type: 'number', required: false }, // 分期金额
  installment_limit: { type: 'number', required: false },
  product_money: { type: 'number', required: false },
  product_item: { type: 'string', required: false },
  insurance_agency: { type: 'string', required: false },
  insurance_money: { type: 'number', required: false },
  warrant_limit: { type: 'number', required: false },
  warrant_money: { type: 'number', required: false },
  gift_money: { type: 'number', required: false },
  other_money: { type: 'number', required: false },
  des: { type: 'string', required: false },
};

// 规则：维修保养
const repairMaintainRule = {
  car_id: { type: 'string', required: true },
  brand_id: { type: 'number', required: true },
  brand_name: { type: 'string', required: true },
  type_id: { type: 'number', required: true },
  type_name: { type: 'string', required: true },
  model_id: { type: 'number', required: true },
  model_name: { type: 'string', required: true },
  import: { type: 'number', required: true },
  repair: {
    type: 'object',
    required: false,
    rule: {
      repair_money: { type: 'number', required: false },
      repair_item: { type: 'string', required: false },
    },
  },
  maintain: {
    type: 'object',
    required: false,
    rule: {
      maintain_type: { type: 'number', required: false },
      maintain_money: { type: 'number', required: false },
      maintain_item: { type: 'string', required: false },
    },
  },
  mileage: { type: 'number', required: true },
  des: { type: 'string', required: false },
};

// 规则：事故车维修
const accidentCarRepairRule = {
  car_id: { type: 'string', required: true },
  brand_id: { type: 'number', required: true },
  brand_name: { type: 'string', required: true },
  type_id: { type: 'number', required: true },
  type_name: { type: 'string', required: true },
  model_id: { type: 'number', required: true },
  model_name: { type: 'string', required: true },
  import: { type: 'number', required: true },
  repair_money: { type: 'number', required: true },
  repair_item: { type: 'string', required: true },
  des: { type: 'string', required: false },
};

// 规则：投诉
const complaintRule = {
  complaint_type: { type: 'array', required: true },
  des: { type: 'string', required: true }, // 处理方式及结果
};

// 规则：其它
const otherRule = {
  des: { type: 'string', required: true }, // 互动情况
};

// 增加互动记录
const createRule = {
  cust_id: { type: 'string', required: true }, // 客户id
  cust_name: { type: 'string', required: true },
  cust_tel: { type: 'string', required: true },
  type: { type: 'number', required: true },

  new_car_sell: { type: 'object', rule: newCarSellRule, required: false },
  old_car_sell: { type: 'object', rule: oldCarSellRule, required: false },
  old_car_purchase: { type: 'object', rule: oldCarPurchaseRule, required: false },
  old_car_exchange: { type: 'object', rule: oldCarExchangeRule, required: false },
  repair_maintain: { type: 'object', rule: repairMaintainRule, required: false },
  accident_car_repair: { type: 'object', rule: accidentCarRepairRule, required: false },
  complaint: { type: 'object', rule: complaintRule, required: false },
  other: { type: 'object', rule: otherRule, required: false },
};

// 互动作废
const invalidRule = {
  _id: { type: 'string', required: true }, // 互动id
  cust_id: { type: 'string', required: true }, // 客户id
  reason: { type: 'string', required: true }, // 客户id
  type: { type: 'number', required: true }, // 客户id
};

module.exports = {
  createRule,
  invalidRule,
};
