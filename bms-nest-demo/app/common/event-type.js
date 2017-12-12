'use strict';


const Events = {};
/**
 * 事件类别
 */
const category = {
  // 购车计划
  buy_car_plan: 100000,
  // 购车店内服务专家
  buy_car_to_saleman: 100100,

  // 置换计划
  replace_car_plan: 110000,
  // 置换店内服务专家
  replace_car_to_saleman: 110100,

  // 出售二手车计划
  sell_car_plan: 120000,
  // 出售店内服务专家
  sell_car_to_saleman: 120100,

  // 调查使用情况计划
  care_car_plan: 130000,
  // 保养店内服务专家
  care_car_to_server: 130100,

  // 客户资料
  cust_info: 140000,
};

/**
 * 事件功能组
 *  如：同一辆已有车辆，在不同的状态下，会有不同的事件类型
 */
Events.FUNC_GROUP = {
  car_plan: [ category.buy_car_plan, category.replace_car_plan ],
  owner_car: [ category.care_car_plan, category.sell_car_plan ],
};

Events.category = category;

/**
 * 事件任务类别
 */
Events.detail = {
  buy_car_plan_iweek: 100001,
  buy_car_plan_imonth: 100002,
  buy_car_plan_hyear: 100003,
  buy_car_plan_iyear: 100004,
  buy_car_plan_ayear: 100005,

  buy_car_to_saleman_iweek: 100101,

  replace_car_plan_iweek: 110001,
  replace_car_plan_imonth: 110002,
  replace_car_plan_hyear: 110003,
  replace_car_plan_iyear: 110004,
  replace_car_plan_ayear: 110005,

  replace_car_to_saleman_iweek: 110101,

  sell_car_plan_iweek: 120001,
  sell_car_plan_imonth: 120002,
  sell_car_plan_hyear: 120003,
  sell_car_plan_iyear: 120004,
  sell_car_plan_ayear: 120005,

  sell_car_to_saleman_iweek: 120101,

  care_car_plan_30d: 130001,
  care_car_plan_60d: 130002,

  care_car_to_server: 130101,

  cust_info_complete: 140001,
  cust_info_birthday: 140002,
};

Events.dateType = {
  iweek: '1周内',
  imonth: '1月内',
  hyear: '半年内',
  iyear: '1年内',
  ayear: '1年以后',
};

Events.STATUS = {
  init: 0, // 事件初始化状态
  finished: 1, // 已完成并结束发布状态
  deleted: 2, // 已删除
  canceled: 3, // 已取消

  republish: 10, // 重新发布任务
  published: 11, // 已发布任务

};

Events.TRIGGER = {
  rule_now: 'now',
  rule_cycle: 'cycle',
  rule_delay: 'delay',

  cycle_month: 'months',
  cycle_week: 'weeks',
  cycle_day: 'days',
  cycle_hour: 'hours',
  cycle_minute: 'minutes',

  end_month: 'month',
  end_week: 'week',
  end_day: 'day',
  end_hour: 'hour',
  end_minute: 'minute',
};

Events.CHANGE_STYLE = {
  basic: 'basic',
  plan: 'plan',
  remove: 'remove',
};

Events.taskType = {
  manualTask: 0, // 默认手动任务
  system: {//
    buy_car_invitation: 101, // 邀请购车
    buy_car_invitation_entry_shop: 102, // 邀请进店
    buy_car_likeUp_invitation: 103, // 沟通购车计划
    replace_car_invitation: 104, // 置换
    replace_car_invitation_entry_shop: 105, // 置换车辆进店（置换任务触发关联任务）
    replace_car_likeUp_invitation: 106, // 沟通置换计划
    sell_car_invitation: 107, // 邀请出手车辆
    sell_car_invitation_entry_shop: 108, // 邀请出手车辆进店任务（邀请出手车辆触发的关联任务）
    sell_car_likeUp_invitation: 109, // 沟通出手计划
    sell_car_likeUp_invitation_maintain: 110, // 沟通出手计划维修任务（沟通出手计划触发的关联任务）
    usage_likeUp_invitation: 111, // 沟通车辆使用情况（已有车辆未填写出售时间）
    usage_likeUp_invitation_repair: 112, // 沟通车辆使用情况维修任务（沟通车辆使用情况出发的关联任务）
    perfect_date_plan: 113, // 完善资料
    birthday_reminder_plan: 114, // 生日提醒
  },
};


module.exports = Events;
