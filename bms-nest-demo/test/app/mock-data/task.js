'use strict';

function MockData() {}

// 消息数据
MockData.createTask = [{
  content: 'creater task test',
  attach: [{
    mole: 'jpg',
    url: './a.jpg',
  }],
  executor: [{
    user: {
      name: 'zhangsan',
      id: '123',
      from: 'bee_user',
    },
    leader: {
      name: 'zhangsandie',
      id: '234',
      from: 'bee_user',
    },
  }, {
    user: {
      name: 'lisi',
      id: '345',
      from: 'bee_user',
    },
    leader: {
      name: 'zhangsandie',
      id: '234',
      from: 'bee_user',
    },
  }],
  reminder: {
    rule_key: '0',
  },
  end_time: '2017-09-20 10:10:10',
  creator: {
    id: '789',
    name: '創建人',
    from: 'bee_user',
  },

}, {
  content: 'creater task test',
  attach: [{
    mole: 'jpg',
    url: './a.jpg',
  }],
  executor: [{
    user: {
      name: 'zhangsan',
      id: '123',
      from: 'bee_user',
    },
    leader: {
      name: 'zhangsandie',
      id: '234',
      from: 'bee_user',
    },
  }, {
    user: {
      name: 'lisi',
      id: '345',
      from: 'bee_user',
    },
    leader: {
      name: 'zhangsandie',
      id: '234',
      from: 'bee_user',
    },
  }],
  reminder: {
    rule_key: '0',
  },
  end_time: '2017-09-20 10:10:10',
  creator: {
    id: '789',
    name: '創建人',
    from: 'bee_user',
  },
  extend: {
    cust: {
      id: '222',
    },
    car_plan: {
      id: '333',
    },
    old_car: [{
      id: '444',
      name: 'cc',
    }],
  },
}, {
  content: 'creater task test',
  attach: [{
    mole: 'jpg',
    url: './a.jpg',
  }],
  executor: [{
    user: {
      name: 'nn',
      id: '789',
      from: 'bee_user',
    },
    leader: {
      name: 'zhangsandie',
      id: '234',
      from: 'bee_user',
    },
  }, {
    user: {
      name: 'mm',
      id: '890',
      from: 'bee_user',
    },
    leader: {
      name: 'zhangsandie',
      id: '234',
      from: 'bee_user',
    },
  }],
  reminder: {
    rule_key: '0',
  },
  end_time: '2017-09-20 10:10:10',
  creator: {
    id: '789',
    name: '創建人',
    from: 'bee_user',
  },

}, {
  task_type: 101,
  content: 'creater task test',
  attach: [{
    mole: 'jpg',
    url: './a.jpg',
  }],
  executor: [{
    user: {
      name: 'zhangsan',
      id: '123',
      from: 'bee_user',
    },
    leader: {
      name: 'zhangsandie',
      id: '234',
      from: 'bee_user',
    },
  }, {
    user: {
      name: 'lisi',
      id: '345',
      from: 'bee_user',
    },
    leader: {
      name: 'zhangsandie',
      id: '234',
      from: 'bee_user',
    },
  }],
  reminder: {
    rule_key: '0',
  },
  end_time: '2017-09-20 10:10:10',
  creator: {
    id: '789',
    name: '創建人',
    from: 'bee_user',
  },
  extend: {
    cust: {
      id: '222',
    },
    car_plan: {
      id: '333',
    },
    old_car: [{
      id: '444',
      name: 'cc',
    }],
    event_task: {
      related: {
        id: '123456',
      },
    },
  },
}];


module.exports = exports = MockData;
