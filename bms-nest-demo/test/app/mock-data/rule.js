'use strict';

function MockData() {}

// 规则
MockData.updateRule = [{
  _id: '59c8e6c5b518cb1d30661864',
  shop: {
    id: '59a65a1d43458a0a3574e610',
  },
  rule: {
    // 新车国产车
    newCarSaleDomestic: {
      mode: 0,
      immobile: {
        income_from: 0, // 提成金额依据：0：售价 1：指导价
        section: [
          {
            floor: 10000,
            upper: 20000,
            value: 2000,
          },
        ],
      },
    },
    // 新车进口车
    newCarSaleImport: {
      mode: 0, // 提成方式： 0： 固定金额 1：百分比
      immobile: {
        income_from: 0, // 提成金额依据：0：售价 1：指导价
        section: [
          {
            floor: 10000,
            upper: 20000,
            value: 2000,
          },
        ],
      },
    },
    // 二手车收购
    oldCarBuy: {
      mode: 0, // 提成方式： 0： 固定金额 1：百分比
      immobile: {
        income_from: 0, // 提成金额依据：0：售价 1：指导价
        section: [
          {
            floor: 10000, // 下限
            upper: 20000, // 上限
            value: 2000, // 奖励金额
          },
        ],
      },
    },
    // 二手车销售
    oldCarSale: {
      mode: 0, // 提成方式： 0： 固定金额 1：百分比
      immobile: {
        income_from: 0, // 提成金额依据：0：售价 1：指导价
        section: [
          {
            floor: 10000, // 下限
            upper: 20000, // 上限
            value: 2000, // 奖励金额
          },
        ],
      },
    },
    // 维修
    repair: {
      mode: 1, // 提成方式 0：固定金额  1：百分比
      percent: 20, // 百分比
    },
    // 保养
    maintain: {
      mode: 1, // 提成方式 0：固定金额  1：百分比
      percent: 20, // 百分比
    },
    // 事故车
    accident: {
      mode: 1, // 提成方式 0：固定金额  1：百分比
      percent: 20, // 百分比
    },
  },
}];


module.exports = exports = MockData;
