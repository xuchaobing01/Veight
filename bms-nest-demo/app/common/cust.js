'use strict';

module.exports = {

  // 计划出手类型
  resell_situation: {
    no_sell: 0, // 不出手
    exchange: 1, // 置换
    sell: 2, // 出手
  },

  // 客户服务互动类型
  interact_type: {
    other: 1, // 其它
    new_car_sell: 100, // 新车销售
    old_car_sell: 200, // 二手车销售
    old_car_purchase: 201, // 二手车收购
    old_car_exchange: 202, // 二手车置换
    repair_maintain: 300, // 维修保养
    accident_car_repair: 301, // 事故车维修
    complaint: 400, // 投诉
  },

  // 已有车辆创建途径
  owncar_add_from: {
    sys: 1, // 系统创建
    input: 2, // bee录入
  },


};
