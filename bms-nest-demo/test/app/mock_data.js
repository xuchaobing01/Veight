'use strict';

const CommonUtil = require('../../app/common/util');

function MockData() {}

// 消息数据
MockData.NotifyMsgs = [{
  notify_type: '新任务',
  notify_content: '张三给你发了一个任务',
  time: CommonUtil.now(),
  receviver: {
    id: 'dfsdfsdfsdfsdfsdfdsfds',
    name: '李四',
    from: 'bee_user',
  },
  task_id: 'dfsdfsdfsdfsdfdsfsdfdsfsd',
}];

MockData.User = {
  zhangsan: {
    id: '597934de58dd1b3c3dd070dc',
    name: 'zhangsan',
    from: 'bee_user',
  },
  lisi: {
    id: 'b111111',
    name: 'lisi',
    from: 'plat_user',
  },
  wangwu: {
    id: 'c111111',
    name: 'wangwu',
    from: 'plat_user',
  },
  zhaoliu: {
    id: 'd111111',
    name: 'zhaoliu',
    from: 'plat_user',
  },
  e111111: {
    id: 'e111111',
    name: 'e111111',
    from: 'plat_user',
  },
  f111111: {
    id: 'f111111',
    name: 'f111111',
    from: 'plat_user',
  },
};

MockData.Notify = {
  newTask: {
    task: {
      _id: 't1111',
      creator: MockData.User.zhangsan,
      status: 20,
      delete: 0,
      executor: [{
        user: MockData.User.lisi,
        leader: MockData.User.zhangsan,
        status: 20,
      },
      {
        user: MockData.User.wangwu,
        leader: MockData.User.zhangsan,
        status: 20,
      },
      {
        user: MockData.User.zhaoliu,
        leader: MockData.User.lisi,
        status: 20,
      },
      {
        user: MockData.User.e111111,
        leader: MockData.User.wangwu,
        status: 20,
      },
      {
        user: MockData.User.f111111,
        leader: MockData.User.wangwu,
        status: 20,
      },
      ],
    },
    msg: [],
  },
  updateTask: {
    task: {
      _id: 't222',
      creator: MockData.User.zhangsan,
      status: 20,
      delete: 0,
      executor: [{
        user: MockData.User.lisi,
        leader: MockData.User.zhangsan,
        status: 20,
      },
      {
        user: MockData.User.wangwu,
        leader: MockData.User.lisi,
        status: 20,
      },
      ],
    },
    msg: [],
  },
  endTask: {
    task: {
      _id: 't333',
      creator: MockData.User.zhangsan,
      status: 20,
      delete: 0,
      executor: [{
        user: MockData.User.lisi,
        leader: MockData.User.zhangsan,
        status: 20,
      },
      {
        user: MockData.User.wangwu,
        leader: MockData.User.lisi,
        status: 20,
      },
      ],
    },
    msg: [],
  },
  overdueTask: {
    task: {
      _id: 't444',
      creator: MockData.User.zhangsan,
      status: 20,
      delete: 0,
      executor: [{
        user: MockData.User.lisi,
        leader: MockData.User.zhangsan,
        status: 20,
      },
      {
        user: MockData.User.wangwu,
        leader: MockData.User.lisi,
        status: 40,
      },
      ],
    },
    msg: [],
  },
  finishTask: {
    task: {
      _id: 't5555',
      end_time: '2017-08-02 12:00:00',
      creator: MockData.User.zhangsan,
      status: 20,
      delete: 0,
      executor: [{
        user: MockData.User.lisi,
        leader: MockData.User.wangwu,
        status: 40,
        finish_time: '2017-08-03 12:00:00',
      }],
    },
    executor_id: MockData.User.lisi.id,
    msg: [],
  },
  msgTask: {
    task: {
      _id: 't666',
      creator: MockData.User.zhangsan,
      status: 20,
      delete: 0,
      executor: [{
        user: MockData.User.lisi,
        leader: MockData.User.wangwu,
        status: 20,
        finish_time: '2017-08-03 12:00:00',
      },
      {
        user: MockData.User.zhaoliu,
        leader: MockData.User.wangwu,
        status: 20,
        finish_time: '2017-08-03 12:00:00',
      },
      ],
      message: [{
        user: MockData.User.zhaoliu,
        content: '1234567890123456789012345678901234',
      }],
    },
    msg: [],
  },
  aheadTask: {
    task: {
      _id: 't777',
      creator: MockData.User.zhangsan,
      status: 20,
      delete: 0,
      reminder: {
        rule_key: '2',
      },
      executor: [{
        user: MockData.User.lisi,
        leader: MockData.User.zhangsan,
        status: 20,
      },
      {
        user: MockData.User.wangwu,
        leader: MockData.User.lisi,
        status: 40,
      },
      ],
    },
    msg: [],
  },
  laterOverdueTask: {
    task: {
      _id: 't888',
      creator: MockData.User.zhangsan,
      status: 20,
      delete: 0,
      executor: [{
        user: MockData.User.lisi,
        leader: MockData.User.zhangsan,
        status: 20,
      },
      {
        user: MockData.User.wangwu,
        leader: MockData.User.lisi,
        status: 20,
      },
      ],
    },
    msg: [],
  },
  trackTask: {
    task: {
      _id: 't999',
      creator: MockData.User.zhangsan,
      status: 20,
      delete: 0,
      tracke_level: 2,
      follower: [{
        user: {
          id: '234',
          name: 'zhangsandie',
          from: 'bee_user',
        },
        delete: 0,
        tracke_level: 1,
        tracked: [{
          id: '123',
          name: 'zhangsan',
          from: 'bee_user',
        }],
        tracked_follower: [],
        status: 20,
        attach: [],
        create_time: '2017-10-17 17:13:24',
      },
      {
        user: {
          id: '234',
          name: 'zhangsandie',
          from: 'bee_user',
        },
        delete: 0,
        tracke_level: 2,
        tracked: [{
          id: '123',
          name: 'zhangsan',
          from: 'bee_user',
        }],
        tracked_follower: [],
        status: 50,
        attach: [],
        create_time: '2017-10-17 17:13:24',
      },
      {
        user: {
          id: '234',
          name: 'zhangsandie',
          from: 'bee_user',
        },
        delete: 0,
        tracke_level: 2,
        tracked: [],
        tracked_follower: [],
        status: 20,
        attach: [],
        create_time: '2017-10-17 17:13:24',
      },
      {
        user: {
          id: '234111',
          name: 'zhangsandie111',
          from: 'bee_user',
        },
        delete: 0,
        tracke_level: 2,
        tracked: [{
          id: '234222',
          name: 'zhangsandie222',
          from: 'bee_user',
        },
        {
          id: '234333',
          name: 'zhangsandie333',
          from: 'bee_user',
        },
        ],
        tracked_follower: [{
          id: '123222',
          name: 'zhangsan222',
          from: 'bee_user',
        }, {
          id: '123333',
          name: 'zhangsan333',
          from: 'bee_user',
        }],
        status: 20,
        attach: [],
        create_time: '2017-10-17 17:13:24',
      },
      {
        user: {
          id: '222234111',
          name: '2222zhangsandie111',
          from: 'bee_user',
        },
        delete: 0,
        tracke_level: 2,
        tracked: [{
          id: '222234222',
          name: 'zhangsandie222',
          from: 'bee_user',
        }],
        tracked_follower: [{
          id: '222123222',
          name: 'zhangsan222',
          from: 'bee_user',
        }],
        status: 20,
        attach: [],
        create_time: '2017-10-17 17:13:24',
      },

      ],
    },
    msg: [],
  },

};


// ------新任务
function newMsg() {
  const msg_tlt = {
    notify_type: '新任务',
    notify_content: `${MockData.Notify.newTask.task.creator.name}给你发了一个任务`,
    task_id: MockData.Notify.newTask.task._id,
  };

  // 第一个执行人
  let msg;
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = MockData.Notify.newTask.task.executor[0].user;
  MockData.Notify.newTask.msg.push(msg);

  // 最后一个执行人
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = MockData.Notify.newTask.task.executor[4].user;
  MockData.Notify.newTask.msg.push(msg);

  // 上级1
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = MockData.Notify.newTask.task.executor[2].leader;
  msg.notify_content = `${MockData.Notify.newTask.task.creator.name}给${MockData.Notify.newTask.task.executor[2].user.name}创建了一个任务`;
  MockData.Notify.newTask.msg.push(msg);

  // 上级2
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = MockData.Notify.newTask.task.executor[3].leader;
  msg.notify_content = `${MockData.Notify.newTask.task.creator.name}给${MockData.Notify.newTask.task.executor[3].user.name},${MockData.Notify.newTask.task.executor[4].user.name}创建了一个任务`;
  MockData.Notify.newTask.msg.push(msg);
}
newMsg();

// ------修改任务
function updateMsg() {
  const task = MockData.Notify.updateTask;
  const msg_tlt = {
    notify_type: '任务修改',
    notify_content: `${task.task.creator.name}修改了任务`,
    task_id: task.task._id,
  };

  // 第一个执行人
  let msg;
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[0].user;
  task.msg.push(msg);

  // 最后一个执行人
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[1].user;
  task.msg.push(msg);

  // 上级1
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[1].leader;
  msg.notify_content = `${task.task.creator.name}给${task.task.executor[1].user.name}修改了任务`;
  task.msg.push(msg);
}
updateMsg();

// ------结束任务
function endMsg() {
  const task = MockData.Notify.endTask;
  const msg_tlt = {
    notify_type: '任务结束',
    notify_content: `${task.task.creator.name}将任务标记为结束`,
    task_id: task.task._id,
  };

  // 第一个执行人
  let msg;
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[0].user;
  task.msg.push(msg);

  // 最后一个执行人
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[1].user;
  task.msg.push(msg);

  // 上级1
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[1].leader;
  msg.notify_content = `${task.task.creator.name}将发给${task.task.executor[1].user.name}的任务标记为结束`;
  task.msg.push(msg);
}
endMsg();

// ------逾期任务
function overdueMsg() {
  const task = MockData.Notify.overdueTask;
  const msg_tlt = {
    notify_type: '任务逾期',
    notify_content: '任务已经逾期',
    task_id: task.task._id,
  };

  // 第一个执行人
  let msg;
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[0].user;
  task.msg.push(msg);

  // 发起人
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.creator;
  task.msg.push(msg);
}
overdueMsg();

function finishMsg() {
  const task = MockData.Notify.finishTask;
  const msg_tlt = {
    notify_type: '任务逾期完成',
    notify_content: '逾期完成了任务',
    task_id: task.task._id,
  };

  let msg;
  // 发起人
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.creator;
  msg.notify_content = `${task.task.executor[0].user.name}逾期完成了任务`;
  task.msg.push(msg);

  // 上级
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[0].leader;
  msg.notify_content = `${task.task.executor[0].user.name}逾期完成了${task.task.creator.name}分配的任务`;
  msg.notify_type = '任务处理通知';
  task.msg.push(msg);
}
finishMsg();

function msgMsg() {
  const task = MockData.Notify.msgTask;
  const msg_tlt = {
    notify_type: '任务留言',
    notify_content: `${task.task.message[0].user.name}：123456789012345678901234567890...`,
    task_id: task.task._id,
  };

  let msg;
  // 执行人
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[0].user;
  task.msg.push(msg);

  // 发起人
  msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.creator;
  task.msg.push(msg);
}
msgMsg();

function laterOverdueMsg() {
  const task = MockData.Notify.laterOverdueTask;
  const msg_tlt = {
    notify_type: '任务逾期',
    notify_content: '任务已逾期，请尽快完成',
    task_id: task.task._id,
  };

  // 执行人
  const msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.executor[0].user;
  task.msg.push(msg);

}
laterOverdueMsg();

function trackMsg() {
  const task = MockData.Notify.trackTask;
  const msg_tlt = {
    notify_type: '任务跟进',
    notify_content: `${task.task.creator.name}发给${task.task.follower[3].tracked[0].name}、${task.task.follower[3].tracked[1].name}的任务已逾期，${task.task.follower[3].tracked_follower[0].name}、${task.task.follower[3].tracked_follower[1].name}未跟进，请尽快跟进`,
    task_id: task.task._id,
    open_id: null,
    tlt_id: 1,
  };
  // 执行人
  let msg = CommonUtil.clone(msg_tlt);
  msg.receviver = task.task.follower[3].user;
  task.msg.push(msg);

  msg = CommonUtil.clone(msg_tlt);
  msg.notify_content = `${task.task.creator.name}发给${task.task.follower[4].tracked[0].name}的任务已逾期，${task.task.follower[3].tracked_follower[0].name}未跟进，请尽快跟进`;
  msg.receviver = task.task.follower[4].user;
  task.msg.push(msg);
}
trackMsg();


MockData.task_tlt = {
  content: '销售国产车100台,进口车50台',
  end_time: '2017-9-15 10:51:33',
  create_time: '2017-09-15 10:51:33',
  follower: [{
    attach: null,
    status: 20,
    tracked: [],
    tracke_level: 0,
    delete: 0,
    user: {
      id: '5993b62558dd1b3c3dd070fa',
      name: '张三爹',
      from: 'bee_user',
    },
    result: '正在跟进',
    create_time: '2017-09-15 12:44:33',
  },
  {
    attach: [],
    status: 20,
    tracked: [],
    tracke_level: 0,
    delete: 0,
    user: {
      id: '2345678',
      name: '李四爹',
      from: 'bee_user',
    },
  },
  ],
  tracke_level: 0,
  message: [],
  status: 20,
  reminder: {
    rule_name: '提前一小时',
    alert_time: null,
  },
  executor: [{
    delete: 0,
    attach: [],
    status: 20,
    is_read: 0,
    leader: {
      name: '张三爹',
      id: '234567',
      from: 'bee_user',
    },
    user: {
      name: '张三',
      id: '5993b62558dd1b3c3dd070fa',
      from: 'bee_user',
    },
    content: null,
    finish_time: null,
  },
  {
    delete: 0,
    attach: [],
    status: 20,
    is_read: 0,
    leader: {
      name: '李四爹',
      id: '2345678',
      from: 'bee_user',
    },
    user: {
      name: '李四',
      id: '1234567',
      from: 'bee_user',
    },
  },
  ],
  execute: {
    count: 2,
    finish_count: 0,
  },
  delete: 0,
  attach: [],
  creator: {
    id: '5993b62558dd1b3c3dd070fa',
    name: 'admin',
    from: 'bee_user',
  },
};
module.exports = exports = MockData;
