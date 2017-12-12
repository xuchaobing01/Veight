'use strict';

function MockData() {}

// 消息数据
MockData.newTask = [{
  _id: '59cc85247be73c002a1400d8',
  content: 'interaction_task',
  follower: [],
  message: [],
  status: 20,
  reminder: {
    rule_key: '2',
    alert_time: '2017-09-28 16:30:00',
  },
  executor: [
    {
      delete: 0,
      attach: null,
      status: 20,
      is_read: 1,
      user: {
        id: '59cc85247be73c002a1400d8',
        name: '史子超',
        from: 'bee_user',
      },
    },
  ],
  task_type: 101,
  delete: 0,
  attach: [],
  creator: {
    id: '59cba89899a83400241b77ae',
    name: 'gaomaosen',
    from: 'plat_user',
  },
  extend: {
    cust: {
      id: '59f1a688e4e8e0591ae2fd88',
      name: 'lisi',
    },
    old_car: [
      {
        _id: '59f1a688e4e8e0591ae2fd77',
        name: 'cc',
      },
    ],
    car_plan: {
      id: '59f1a688e4e8e0591ae2fd66',
    },
    shop: {
      _id: '59ccacd26da816002ba9706f',
      name: '卢山4S店',
    },
  },
}];

MockData.car = {
  delete: 0,
  _id: '5a1542384f82260022248c4b',
  car_color: 1,
  type_name: '宝马5系(进口)',
  type_id: 418,
  brand_id: 10,
  brand_name: '宝马',
  model_name: '宝马5系(进口) 2017款 540i M运动套装',
  model_id: 40245,
  import: 0,
  resell_date_type: 1,
  is_resell: 2,
  price: 520000,
};

MockData.cust = {
  _id: '59f1a688e4e8e0591ae2fd88',
  time_line: [],
  own_car: [
    {
      data_from: 2,
      is_resell: 2,
      price: 520000,
      model_id: 22,
      model_name: 'cc',
      type_name: 'cc',
      type_id: 222,
      brand_name: 'sfsfsfsfsd',
      brand_id: 300,
      _id: '59f1a688e4e8e0591ae2fd77',
      plate_location: {
        region: '荒野区',
        city: '晋城市',
        province: '陕西省',
      },
      resell_date_type: 1,
    },
  ],
  info: {
    comment: '',
    name: '123',
    sex: 1,
    brith: '1965-01-01T00:00:00.000Z',
    tel: '13345677654',
    wechat: 'www',
    email: 'ew@32.com',
    eduction: 6,
    tags: [],
    hobby: [
      110,
      106,
      102,
      101,
      105,
    ],
  },
  delete: 0,
  shop: [
    {
      _id: '59ccacd26da816002ba9706f',
      name: '卢山4S店',
    },
  ],
  belong: {
    id: '59f1a688e4e8e0591ae2fd55',
    name: 'test001',
    from: 'bee_user',
  },
  car_plan: [
    {
      brand_type: 3,
      buy_date_type: 1,
      budget_type: 2,
      car_type: 1,
      use_to: 1,
      _id: '59f1a688e4e8e0591ae2fd66',
      transfer_cars: [],
      is_transfer: 0,
      prefer_side: [
        3,
      ],
      prefer_cars: [],
    },
  ],

};
module.exports = exports = MockData;
