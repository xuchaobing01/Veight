'use strict';

const now = new Date();
const roles = [{
  _id: 'plat_test_role1_id',
  name: '平台单元测试角色1',
  description: '平台单元测试角色1,定时任务执行生成 (天、周) 任务',
  delete: 0,
  creator: {
    id: '-1',
    name: '系统',
    time: new Date('2017-09-13T08:38:09.042Z'),
  },
  cooperate: null,
  prevs: [],
  event_rules: [],
  timer_rules: [
    {
      category: 0,
      trigger: {
        end: '12:00',
        days: 2,
        start: '07:00',
        cycle: now.getHours(),
        rule: 'day',
      },
      reminder: {
        time_diff: 1800,
        alert_time: null,
        rule_name: '截止前半小时',
        rule_key: 2,
      },
      _id: '59ba6093bed8b039c0cde77b',
      content: '每天创建定时任务',
    }, {
      category: 0,
      trigger: {
        end: '12:00',
        days: 2,
        start: '07:00',
        cycle: now.getDay(),
        rule: 'week',
      },
      reminder: {
        time_diff: 1800,
        alert_time: null,
        rule_name: '截止前半小时',
        rule_key: 2,
      },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每周${now.getDay()}创建定时任务`,
    }, {
      category: 0,
      trigger: {
        end: '12:00',
        days: 2,
        start: '07:00',
        cycle: now.getDate() + 1,
        rule: 'month',
      },
      reminder: {
        time_diff: 1800,
        alert_time: null,
        rule_name: '截止前半小时',
        rule_key: 2,
      },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每月${now.getDate + 1}号创建定时任务`,
    },
  ],
  scope: 'plat',
  is_tpl: 0,
  updater: {
    id: '5993b62558dd1b3c3dd070fa',
    name: '测试哈哈',
  },
},
{
  _id: 'plat_test_role2_id',
  name: '平台单元测试角色2',
  description: '平台单元测试角色2描述,定时任务执行生成 (月) 任务',
  delete: 0,
  creator: {
    id: '-1',
    name: '系统',
    time: new Date('2017-09-13T08:38:09.042Z'),
  },
  cooperate: null,
  prevs: [],
  event_rules: [],
  timer_rules: [
    {
      category: 0,
      trigger: {
        end: '12:00',
        days: 2,
        start: '07:00',
        cycle: now.getDay + 1,
        rule: 'week',
      },
      reminder: {
        time_diff: 1800,
        alert_time: null,
        rule_name: '截止前半小时',
        rule_key: 2,
      },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每周${now.getDay() + 1}定时创建任务`,
    }, {
      category: 0,
      trigger: {
        end: '12:00',
        days: 2,
        start: '07:00',
        cycle: now.getDate(),
        rule: 'month',
      },
      reminder: {
        time_diff: 1800,
        alert_time: null,
        rule_name: '截止前半小时',
        rule_key: 2,
      },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每月${now.getDate()}号创建定时任务`,
    },
  ],
  scope: 'plat',
  is_tpl: 0,
  updater: {
    id: '5993b62558dd1b3c3dd070fa',
    name: '测试哈哈',
  },
},
{
  _id: 'shop_test_role2_id',
  name: '4S店单元测试角色2',
  description: '4S店单元测试角色2描述,定时任务执行生成 (月) 任务',
  delete: 0,
  creator: {
    id: '-1',
    name: '系统',
    time: new Date('2017-09-13T08:38:09.042Z'),
  },
  cooperate: null,
  prevs: [],
  event_rules: [],
  timer_rules: [
    {
      category: 0,
      trigger: {
        end: '12:00',
        days: 2,
        start: '07:00',
        cycle: now.getDay + 1,
        rule: 'week',
      },
      reminder: {
        time_diff: 1800,
        alert_time: null,
        rule_name: '截止前半小时',
        rule_key: 2,
      },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每周${now.getDay() + 1}定时创建任务`,
    }, {
      category: 0,
      trigger: {
        end: '12:00',
        days: 2,
        start: '07:00',
        cycle: now.getDate(),
        rule: 'month',
      },
      reminder: {
        time_diff: 1800,
        alert_time: null,
        rule_name: '截止前半小时',
        rule_key: 2,
      },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每月${now.getDate()}号创建定时任务`,
    },
  ],
  scope: 'shop',
  is_tpl: 0,
  updater: {
    id: '5993b62558dd1b3c3dd070fa',
    name: '测试哈哈',
  },
},
{
  _id: 'bee_test_role2_id',
  name: 'BEE单元测试角色2',
  description: 'BEE单元测试角色2描述,定时任务执行生成 (月) 任务',
  delete: 0,
  creator: {
    id: '-1',
    name: '系统',
    time: new Date('2017-09-13T08:38:09.042Z'),
  },
  cooperate: null,
  prevs: [],
  event_rules: [],
  timer_rules: [
    {
      category: 0,
      trigger: {
        end: '12:00',
        days: 2,
        start: '07:00',
        cycle: now.getDay + 1,
        rule: 'week',
      },
      reminder: {
        time_diff: 1800,
        alert_time: null,
        rule_name: '截止前半小时',
        rule_key: 2,
      },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每周${now.getDay() + 1}定时创建任务`,
    }, {
      category: 0,
      trigger: {
        end: '12:00',
        days: 2,
        start: '07:00',
        cycle: now.getDate(),
        rule: 'month',
      },
      reminder: {
        time_diff: 1800,
        alert_time: null,
        rule_name: '截止前半小时',
        rule_key: 2,
      },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每月${now.getDate()}号创建定时任务`,
    },
  ],
  scope: 'bee',
  is_tpl: 0,
  updater: {
    id: '5993b62558dd1b3c3dd070fa',
    name: '测试哈哈',
  },
},
];

const plat_users = [{
  _id: 'test_plat_user1_id',
  info: { name: '平台测试用户张三' },
  name: '平台测试用户张三',
  leader: {
    id: 'test_plat_leader_id',
    name: '平台张三领导李四',
  },
  from: 'plat',
  roles: [ 'plat_test_role1_id', 'plat_test_role2_id' ],
}, {
  _id: 'test_plat_user2_id',
  info: { name: '平台测试用户张三2' },
  name: '平台测试用户张三2',
  leader: {
    id: 'test_plat_leader_id',
    name: '平台张三领导李四',
  },
  from: 'plat',
  roles: [ 'plat_test_role2_id' ],
}, {
  _id: 'test_plat_user3_id',
  info: { name: '平台测试用户张三3' },
  name: '平台测试用户张三3',
  leader: {
    id: 'test_plat_leader_id',
    name: '平台领导王五',
  },
  from: 'plat',
  roles: [ 'plat_test_role1_id' ],
}];

const shop_users = [{
  _id: 'test_shop_user1_id',
  info: { name: '4S店测试用户张三' },
  name: '4S店测试用户张三',
  leader: {
    id: 'test_shop_leader_id',
    name: '4S店张三领导李四',
  },
  from: 'shop',
  roles: [ 'shop_test_role1_id', 'shop_test_role2_id' ],
}, {
  _id: 'test_shop_user2_id',
  info: { name: '4S店测试用户张三2' },
  name: '4S店测试用户张三2',
  leader: {
    id: 'test_shop_leader_id',
    name: '4S店张三领导李四',
  },
  from: 'shop',
  roles: [ 'shop_test_role2_id' ],
}, {
  _id: 'test_shop_user3_id',
  info: { name: '4S店测试用户张三3' },
  name: '4S店测试用户张三3',
  leader: {
    id: 'test_shop_leader_id',
    name: '4S店领导王五',
  },
  from: 'shop',
  roles: [ 'shop_test_role1_id' ],
}];

const bee_users = [{
  _id: 'test_bee_user1_id',
  info: { name: 'Bee测试用户张三' },
  name: 'Bee测试用户张三',
  leader: {
    id: 'test_bee_leader_id',
    name: 'Bee张三领导李四',
  },
  from: 'bee',
  roles: [ 'bee_test_role1_id', 'bee_test_role2_id' ],
}, {
  _id: 'test_bee_user2_id',
  info: { name: 'Bee测试用户张三2' },
  name: 'Bee测试用户张三2',
  leader: {
    id: 'test_bee_leader_id',
    name: 'Bee张三领导李四',
  },
  from: 'bee',
  roles: [ 'bee_test_role2_id' ],
}, {
  _id: 'test_bee_user3_id',
  info: { name: 'Bee测试用户张三3' },
  name: 'Bee测试用户张三3',
  leader: {
    id: 'test_bee_leader_id',
    name: 'Bee领导王五',
  },
  from: 'bee',
  roles: [ 'bee_test_role1_id' ],
}];

module.exports = { roles, users: { plat_users, shop_users, bee_users } };
