'use strict';

// 账单列表验证
const billList = {
  page: { type: 'number', required: true },
  size: { type: 'number', required: true },
  // qkey: { type: 'string', required: false },
  choice: { type: 'object', required: false },
};

const user = {
  type: 'object',
  required: true,
  rule: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    from: { type: 'string', required: true },
  },
};

// 4s店信息
const shop = {
  type: 'object',
  required: true,
  rule: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: false },
    from: { type: 'string', required: false },
  },
};

// 平台支付信息
const plat_pay = {
  type: 'object',
  required: false,
  rule: {
    status: { type: 'string', required: true },
    time: { type: 'string', required: true },
    user,
  },
};

// 4S店支付信息
const shop_pay = {
  type: 'object',
  required: false,
  rule: {
    status: { type: 'string', required: true },
    time: { type: 'string', required: true },
    user,
  },
};

// 订单客户信息
const customer = {
  type: 'object',
  required: true,
  rule: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: false },
  },
};

// 客户订单列表
const list = {
  type: 'array',
  itemType: 'object',
  required: false,
  rule: {
    category: { type: 'number', required: true },
    price: { type: 'number', required: true },
  },
};

const cust_service = {
  type: 'object',
  required: false,
  rule: {
    id: { type: 'string', required: true },
    customer,
    list,
    sale_time: { type: 'string', required: true },
  },
};

const section = {
  type: 'array',
  itemType: 'object',
  required: true,
  rule: {
    floor: { type: 'number', required: true },
    upper: { type: 'number', required: true },
    value: { type: 'number', required: true },
  },
};

const immobile = {
  type: 'object',
  required: false,
  rule: {
    income_from: { type: 'number', required: true }, // 提成金额依据：0：售价 1：指导价
    section,
  },
};

const rule = {
  type: 'array',
  itemType: 'object',
  required: true,
  rule: {
    id: { type: 'string', required: true },
    immobile,
    percent: { type: 'number', required: false },
  },
};

// 账单奖励规则
const reward = {
  type: 'array',
  itemType: 'object',
  required: false,
  rule: {
    category: { type: 'number', required: true },
    price: { type: 'number', required: true },
    income: { type: 'number', required: true },
    rule,
  },
};

// 更新账单验证
const update = {
  bill: {
    type: 'object',
    required: true,
    rule: {
      _id: { type: 'string', required: true },
      user,
      shop,
      plat_pay,
      shop_pay,
      cust_service,
      income: { type: 'number', required: false },
      reward,
      status: { type: 'number', required: false },
      delete: { type: 'number', required: false },
    },
  },
};

// 账单详情验证
const detail = {
  _id: { type: 'string', required: true },
};

// 账单删除验证
const deleteBill = {
  _id: { type: 'string', required: true },
};

// 取消账单
const cancel = {
  _id: { type: 'string', required: true },
};

module.exports = { billList, update, detail, deleteBill, cancel };
