'use strict';

const shop = {
  type: 'object',
  required: true,
  rule: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: false },
  },
};

const section = {
  type: 'array',
  itemType: 'object',
  required: false,
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

// 新车国产车
const newCarSaleDomestic = {
  type: 'object',
  itemType: 'object',
  required: false,
  rule: {
    mode: { type: 'number', required: true },
    immobile,
    percent: { type: 'number', required: false },
  },
};

// 新车进口车
const newCarSaleImport = {
  type: 'object',
  itemType: 'object',
  required: false,
  rule: {
    mode: { type: 'number', required: true },
    immobile,
    percent: { type: 'number', required: false },
  },
};

// 二手车收购
const oldCarBuy = {
  type: 'object',
  itemType: 'object',
  required: false,
  rule: {
    mode: { type: 'number', required: true },
    immobile,
    percent: { type: 'number', required: false },
  },
};

// 二手车销售
const oldCarSale = {
  type: 'object',
  itemType: 'object',
  required: false,
  rule: {
    mode: { type: 'number', required: true },
    immobile,
    percent: { type: 'number', required: false },
  },
};

// 新车进口车
const repair = {
  type: 'object',
  itemType: 'object',
  required: false,
  rule: {
    mode: { type: 'number', required: true },
    immobile,
    percent: { type: 'number', required: false },
  },
};

// 二手车收购
const maintain = {
  type: 'object',
  itemType: 'object',
  required: false,
  rule: {
    mode: { type: 'number', required: true },
    immobile,
    percent: { type: 'number', required: false },
  },
};

// 事故车
const accident = {
  type: 'object',
  itemType: 'object',
  required: false,
  rule: {
    mode: { type: 'number', required: true },
    immobile,
    percent: { type: 'number', required: false },
  },
};


const rule = {
  type: 'object',
  itemType: 'object',
  required: true,
  rule: {
    newCarSaleDomestic,
    newCarSaleImport,
    oldCarBuy,
    oldCarSale,
    repair,
    maintain,
    accident,
  },
};
// 4s店规则
const shopRules = {
  shop_id: { type: 'string', required: true },
};

// 4S店历史规则验证
const historyRules = {
  page: { type: 'number', required: false },
  size: { type: 'number', required: false },
  shop,
};

// 规则更新[添加和编辑]验证
const update = {
  _id: { type: 'string', required: false },
  shop,
  rule,
};

// 规则详情验证
const detail = {
  _id: { type: 'string', required: true },
};

module.exports = { shopRules, historyRules, update, detail };

