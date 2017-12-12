'use strict';

module.exports = Const;

/**
 * Const Interface
 */
function Const() { }

// 集团id
Const.orgGroup = 1;

// 返回状态
Const.status = {
  success: 0,
  error: 1,
};

// 是否可用 1：可用 0：不可用
Const.delete = {
  yes: 1,
  no: 0,
};
// 是否已读
Const.read = {
  yes: 1,
  no: 0,
};
Const.client = {
  weChat: 'WX',
  PC: 'PC',
};
// 系统创建的任务Id
Const.system = {
  id: '-1',
};
Const.task = {
  // 逾期超时时长,单位秒
  overdueLimit: 60 * 60,
  // 任务状态
  status: {
    default: 10, // 默认状态
    inProgress: 20, // 正在进行状态
    overdule: 30, // 已逾期
    finish: 40, // 完成
    track: 50, // 已跟进
    cancellation: 60, // 已作废
  },
  // 操作角色
  role: {
    creator: 'creator', // 创建者
    executor: 'executor', // 执行者
    follower: 'follower', // 关注者
  },
  delete: {
    default: 0, // 默认状态
    delete: 1, // 第一次删除
    recycleDelete: 2, // 回收站删除
  },
  // 提醒
  reminder: {
    notReminder: 0, // 不提醒
    fifMinute: 1, // 十五分钟
    thirtyMinute: 2, // 三十分钟
    oneHour: 3, // 一小时
    threeHour: 4, // 三小时
    oneDay: 5, // 一天
    fiveHour: 6, // 五小時

  },
  // 任务类型
  taskType: {
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
      sell_car__likeUp_invitation: 109, // 沟通出手计划
      sell_car_likeUp_invitation_maintain: 110, // 沟通出手计划维修任务（沟通出手计划触发的关联任务）
      usage_likeUp_invitation: 111, // 沟通车辆使用情况（已有车辆未填写出售时间）
      usage_likeUp_invitation_repair: 112, // 沟通车辆使用情况维修任务（沟通车辆使用情况出发的关联任务）
      perfect_date_plan: 113, // 完善资料
      birthday_reminder_plan: 114, // 生日提醒
    },
  },
};

// 提成规则
Const.reward = {
  // 规则状态
  ruleStatus: {
    available: 1, // 可用
    disable: -1, // 不可用
  },
  action: {
    new: 1, // 新建
    update: 2, // 修改
  },
};
Const.TaskAction = {
  new: 1, // 新建
  update: 2, // 修改
  finish: 3, // 完成
  end: 4, // 结束
  msg: 5, // 留言
  track: 6, // 跟进
  ahead: 7, // 提前提醒
  overdue: 8, // 逾期
  laterOverdue: 9, // 逾期
  to_track: 10, // 触发上级跟进
};

// 任务的动作
Const.TaskStatus = {
  init: 10, // 初始
  exec: 20, // 执行中
  overdue: 30, // 逾期
  finish: 40, // 结束
};

Const.TaskCategory = {
  manual: 0,

  timers: 2000,

  events: 3000,
  eventsCarPlan: 3010,
};

// 规则类型
Const.RuleType = {
  Timer: 'TIMER',
  Event: 'EVENT',
  Group: 'GROUP',
};

// 时间任务周期
Const.TimeTaskPeriod = {
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Quarter: 'quarter',
};

// 角色范围
Const.RoleScope = {
  plat: 'plat',
  shop: 'shop',
  bee: 'bee',
};

Const.PROXY = {
  PAGE: 1,
  SIZE: 1000000,
};

Const.Max_Parallel = 10;

Const.DATE_FORMAT = 'YYYY-MM-DD';
Const.DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
Const.DATE_WEEK_FORMAT = 'YYYY-MM-DD dddd HH:mm:ss';
Const.DAY_BEGIN_FORMAT = 'YYYY-MM-DD 00:00:00';
Const.DAY_END_FORMAT = 'YYYY-MM-DD 23:59:59';

Const.SYS_USER = { id: '-1', name: '系统', from: 'sys' };

// 默认的扫描开始时间
Const.LastTime = '2000-1-1 00:00:00';

// 提醒时间的描述
Const.RuleName = [ '不提醒', '十五分钟', '三十分钟', '一小时', '三小时', '一天', '五小时' ];

// user from的描述
Const.UserFrom = {
  plat: 'plat_user',
  shop: 'shop_user',
  bee: 'bee_user',
};

// 提成规则
Const.reward = {
  // 规则状态
  ruleStatus: {
    available: 1, // 可用
    disable: -1, // 不可用
  },
  action: {
    new: 1, // 新建
    update: 2, // 修改
    cancel: 3, // 取消[作废]
    shopPay: 4, // 4s店支付
    platPay: 5, // 平台支付
  },
  payStatus: {// 支付状态
    no: 0, // 未支付
    process: 1, // 处理中
    yes: 2, // 已支付
    cancel: -1, // 已取消[作废]
  },
  ruleMode: {// 匹配规则
    immobile: 0, // 固定金额
    percent: 1, // 比例
  },
  income_from: { // 售价、指导价
    sale_price: 0,
    guide_price: 1,
  },
};

Const.custService = {
  category: {
    newCarSaleDomestic: 10, // 新车国产车
    newCarSaleImport: 11, // 新车进口车
    oldCarBuy: 20, // 二手车收购
    oldCarSale: 21, // 二手车销售
    repair: 30, // 维修
    maintain: 40, // 保养
    accident: 50, // 事故车
  },
};

// 创建，作废互动对账单提成的影响
Const.billStatus = {
  createBill: 1,
  cancelBill: 2,
};
module.exports = exports = Const;
