'use strict';

const { category, detail, TRIGGER, taskType } = require('../../../app/common/event-type');

// 全部客户信息
const cust_all = {
  cust_id: '59f1955d5817e246131b8bc5',
  name: '张三',
  brith: '2017-08-10',
  sex: 2,
  eduction: 4, // 学历
  wechat: 'wangyu_gz',
  email: 'wangyu@4sone.com',
  hobby: [ // 爱好
    105,
    406,
    507,
  ],
  tel: '18515070534',
  family: { // 家庭信息
    situation: 3, // 家庭类型
    earning: 3, // 家庭总收入
    location: { // 家庭住址
      province: '110000',
      province_name: '河北省',
      city: '110000',
      city_name: '邯郸市',
      region: '110101',
      region_name: '邱县',
      addr: '辉煌国际70-3-3', // 具体地址
    },
  },
  job: { // 工作信息
    company: '北京云杉思维科技有限公司', // 公司
    occupation: 205, // 职业：销售，市场
    location: { // 公司地址
      province: '110000',
      province_name: '河北省',
      city: '110000',
      city_name: '邯郸市',
      region: '110101',
      region_name: '邱县',
      addr: '辉煌国际写字楼',
    },
  },
  belong: {
    id: '59b9db5bda074d00222186c3',
    name: 'wangwedan',
    from: 'plat_user',
  },
};

// 没有生日的客户信息
const cust_no_birth = {
  cust_id: '59f1955d5817e246131b8bc5',
  name: '张三',
  belong: {
    id: '59b9db5bda074d00222186c3',
    name: 'wangwedan',
    from: 'plat_user',
  },
};

// event_rules（参数）
const event_rules_all = [
  {
    event_type: detail.cust_info_complete,
    task_type: taskType.system.perfect_date_plan,
    content: '请完善客户<% cust %>的基本信息。',
    trigger: {
      rule: TRIGGER.rule_now,
      cycle: {
        cate: 'hour',
        value: 48,
      },
      start: null,
      end: {
        cate: 'day',
        value: 5,
      },
    },
    reminder: {
      rule_key: 4,
      rule_name: '截止前24小时',
      time_diff: 60 * 60 * 24,
    },
  },
  {
    event_type: detail.cust_info_birthday,
    task_type: taskType.system.birthday_reminder_plan,
    content: '明天是客户<% cust %>的生日，请送上你的祝福吧。',
    extend: {
      cust: {},
    },
    pre_cycle: {
      cate: 'days',
      value: 1,
    },
    trigger: {
      rule: TRIGGER.rule_cycle,
      cycle: {
        cate: 'years',
        value: 1,
      },
      start: '12:00:00', // 生成事件任务的时间，时分秒
      end: { // 24小时内
        cate: 'day',
        value: 1,
      },
      end_time: '23:59:59',
    },
    reminder: {
      rule_key: 2,
      rule_name: '截止前5小时',
      time_diff: 60 * 60 * 5,
    },
  },
];

// event_tasks（输出信息）
const event_tasks_all = [
  {
    event_type: detail.cust_info_complete,
    related: {
      id: cust_all.cust_id,
      func_model: category.cust_info,
    },
    executor: cust_all.belong,
    status: 1,
    context: cust_all,
    rule: {
      task_type: taskType.system.perfect_date_plan,
      content: '请完善客户<% cust %>的基本信息。',
      extend: {
        cust: {
          name: cust_all.name,
          id: cust_all.cust_id,
        },
      },
      trigger: {
        rule: TRIGGER.rule_now,
        cycle: {
          cate: 'hour',
          value: 48,
        },
        start: null,
        end: {
          cate: 'day',
          value: 5,
        },
      },
      reminder: {
        rule_key: 4,
        rule_name: '截止前24小时',
        time_diff: 60 * 60 * 24,
      },
    },
  },
  {
    event_type: detail.cust_info_birthday,
    related: {
      id: cust_all.cust_id,
      func_model: category.cust_info,
    },
    executor: cust_all.belong,
    status: 0,
    context: cust_all,
    rule: {
      task_type: taskType.system.birthday_reminder_plan,
      content: '明天是客户<% cust %>的生日，请送上你的祝福吧。',
      extend: {
        cust: {
          name: cust_all.name,
          id: cust_all.cust_id,
        },
      },
      trigger: {
        rule: TRIGGER.rule_cycle,
        cycle: {
          cate: 'years',
          value: 1,
        },
        start: '12:00:00', // 生成事件任务的时间，时分秒
        end: { // 24小时内
          cate: 'day',
          value: 1,
        },
        end_time: '23:59:59',
      },
      reminder: {
        rule_key: 2,
        rule_name: '截止前5小时',
        time_diff: 60 * 60 * 5,
      },
    },
    last_cycle_time: '2017-08-09 12:00:00',
  },
];

// event_rules（没有生日，客户资料不完善）
const event_rules_part = [
  {
    event_type: detail.cust_info_complete,
    task_type: taskType.system.perfect_date_plan,
    content: '请完善客户<% cust %>的基本信息。',
    trigger: {
      rule: TRIGGER.rule_now,
      cycle: {
        cate: 'hour',
        value: 48,
      },
      start: null,
      end: {
        cate: 'day',
        value: 5,
      },
    },
    reminder: {
      rule_key: 4,
      rule_name: '截止前24小时',
      time_diff: 60 * 60 * 24,
    },
  },
];

// event_rules（没有生日，客户资料不完善）
const event_tasks_part = [
  {
    event_type: detail.cust_info_complete,
    related: {
      id: cust_no_birth.cust_id,
      func_model: category.cust_info,
    },
    executor: cust_no_birth.belong,
    status: 0,
    context: cust_no_birth,
    rule: {
      task_type: taskType.system.perfect_date_plan,
      content: '请完善客户<% cust %>的基本信息。',
      extend: {
        cust: {
          name: cust_no_birth.name,
          id: cust_no_birth.cust_id,
        },
      },
      trigger: {
        rule: TRIGGER.rule_now,
        cycle: {
          cate: 'hour',
          value: 48,
        },
        start: null,
        end: {
          cate: 'day',
          value: 5,
        },
      },
      reminder: {
        rule_key: 4,
        rule_name: '截止前24小时',
        time_diff: 60 * 60 * 24,
      },
    },
  },
];

module.exports = { cust_all, cust_no_birth, event_rules_all, event_tasks_all, event_rules_part, event_tasks_part };
