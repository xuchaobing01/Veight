'use strict';

const mongoose = require('mongoose');

// cust
const cust = {
  _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa2'),
  update_time: new Date('2017-10-16T06:25:09.963Z'),
  create_time: new Date('2017-10-16T06:25:09.963Z'),
  time_line: [],
  relate_cust: [{
    cust_id: '59c36e54dd688219a8136b29',
    name: 'abc',
    relation: '4',
    tel: '18433222222',
    location: {
      province: '110000',
      city: '110000',
      region: '110101',
      addr: '精品住宅小区',
    },
  }],
  car_plan: [{
    use_to: 4,
    car_type: 1,
    budget_type: 6,
    buy_date_type: 2,
    brand_type: 1,
    _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
    delete: 0,
    prefer_side: [
      3,
      4,
      5,
    ],
    prefer_cars: [{
      brand_id: 3,
      brand_name: '雷克萨斯',
      type_id: 244,
      type_name: '雷克萨斯IS',
      model_id: 345,
      model_name: 'IS300 尊享型',
      car_color: 6,
      car_inner_color: 1,
    },
    {
      brand_id: 1,
      brand_name: '雷克萨斯',
      type_id: 242,
      type_name: '雷克萨斯IS',
      model_id: 33,
      model_name: 'IS300 尊享型',
      car_color: 5,
      car_inner_color: 2,
    },
    ],
  }],
  own_car: [{
    brand_id: 1,
    brand_name: '雷克萨斯',
    type_id: 242,
    type_name: '雷克萨斯IS',
    model_id: 33,
    model_name: 'IS300 尊享型',
    car_color: 4,
    car_inner_color: 1,
    car_age: 3,
    price: 300000,
    per_mailage: 100000,
    is_resell: true,
    resell_date_type: 3,
    _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa4'),
    plate_location: {
      province: '110000',
      city: '110000',
      region: '110101',
    },
  }],
  info: {
    name: '张三',
    brith: new Date('2017-08-09T00:00:00.000Z'),
    sex: 2,
    eduction: 4,
    wechat: 'wangyu_gz',
    email: 'wangyu@4sone.com',
    tel: '18515070534',
    comment: '这里写备注',
    tags: [],
    job: {
      company: '北京云杉思维科技有限公司',
      occupation: 205,
      location: {
        province: '110000',
        city: '110000',
        region: '110101',
        addr: '辉煌国际写字楼',
      },
    },
    family: {
      situation: 5,
      earning: 3,
      location: {
        province: '110000',
        city: '110000',
        region: '110101',
        addr: '辉煌国际70-3-3',
      },
    },
    hobby: [
      105,
      406,
      507,
    ],
  },
  interact_time: new Date('2017-10-16T06:24:54.502Z'),
  delete: 0,
  belong: {
    id: '59b9db5bda074d00222186c3',
    name: 'wangwedan',
    from: 'plat_user',
  },
  __v: 0,
};

// event rules
const event_rule = {
  category: 100001,
  rules: [{
    task_type: 100001,
    content: '请邀请客户#{cust}到东城天道店看车购车',

    trigger: {
      rule: 'now', // now 立刻, cycle周期, delay 推迟
      cycle: { // 空时，不产生周期任务
        day: 10,
      },
      start: '', // 生成事件任务的时间，时分秒
      delay: {
        hour: '24',
      },
    },

    reminder: {
      rule_key: 2,
      rule_name: '截前半小时',
      time_diff: 1800,
    },
  }],
};

// event task
const event_task = {
  category: 'car_plan_one_week',
  related: {
    id: '计划购车--id',
    func_model: 'buy_car_plan',
  },
  executor: [{
    id: '',
    name: '',
    from: '',
  }],
  status: '', // 当前 户规则状态
  context: {
    cust: {},
    car_plan_id: null,
  }, // 上下 相关
  rules: {
    task_type: 'cust_to_shop_buycar',
    content: '请邀请客户#{cust}到东城天道店看车购车', // ????前后端配合：客户姓名，能够查看详情。

    trigger: {
      rule: 'now', // now, delay
      cycle: null,
      start: '', // 生成事件任务的时间，时分秒
      end: {
        cate: 'hour',
        value: 24,
      },
    },
    reminder: {
      rule_key: 2,
      rule_name: '截前半小时',
      time_diff: 1800,
    },
  },
  create_time: '',
  update_time: '',
  last_time: '',
};


// task
const task = {
  _id: mongoose.Types.ObjectId('59e42e687a9f0d002189063a'),
  content: '子超请卢成东吃饭。',
  end_time: '2017-10-16 12:59:00',
  create_time: '2017-10-16 11:58:32',
  tracke_time: 'Invalid Date',
  follower: [
    {
      create_time: '2017-10-16 11:58:32',
      attach: [],
      status: 20,
      tracked: [
        {
          id: '59cc52d7587fc600210791c1',
          name: 'test003',
          from: 'plat_user',
        },
      ],
      tracke_level: 1,
      delete: 0,
      user: {
        id: '59cc5299daca3c002039ddd6',
        name: 'test002',
        from: 'plat_user',
      },
    },
  ],
  tracke_level: 1,
  message: [
    {
      time: '2017-10-16 11:58:32',
      content: 'test004创建了任务',
      action: 1,
      user: {
        id: '59dc3bd0d4a5d2001f4943bb',
        name: 'test004',
        from: 'bee_user',
      },
    },
    {
      user: {
        from: 'plat_user',
        name: 'test002',
        id: '59cc5299daca3c002039ddd6',
      },
      action: 5,
      time: '2017-10-16 11:59:21',
      content: '子超还有咖啡么？',
    },
    {
      action: 8,
      time: '2017-10-16 13:00:00',
      content: 'test001的任务已逾期',
    },
  ],
  status: 30,
  reminder: {
    rule_key: '1',
    alert_time: '2017-10-16 12:44:00',
  },
  executor: [
    {
      delete: 0,
      attach: [],
      status: 20,
      is_read: 0,
      user: {
        id: '59cc51f655976d002aac6977',
        name: 'test001',
        from: 'plat_user',
      },
    },
    {
      delete: 0,
      attach: [],
      status: 20,
      is_read: 1,
      user: {
        id: '59cc5299daca3c002039ddd6',
        name: 'test002',
        from: 'plat_user',
      },
    },
    {
      delete: 0,
      attach: [],
      status: 20,
      is_read: 0,
      leader: {
        id: '59cc5299daca3c002039ddd6',
        name: 'test002',
        from: 'plat_user',
      },
      user: {
        id: '59cc52d7587fc600210791c1',
        name: 'test003',
        from: 'plat_user',
      },
    },
    {
      delete: 0,
      attach: [],
      status: 20,
      is_read: 0,
      user: {
        id: '59ddca72b475c9002093f677',
        name: 'test110',
        from: 'plat_user',
      },
    },
  ],
  execute: {
    count: 4,
    finish_count: 0,
  },
  category: 0,
  delete: 0,
  attach: [],
  creator: {
    id: '59dc3bd0d4a5d2001f4943bb',
    name: 'test004',
    from: 'bee_user',
  },
  __v: 0,
};
