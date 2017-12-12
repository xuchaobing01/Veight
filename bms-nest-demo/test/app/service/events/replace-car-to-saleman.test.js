'use strict';

const assert = require('assert');
const mock = require('egg-mock');

const mongoose = require('mongoose');
const Events = require('../../../../app/common/event-type');


describe('##replace-car-to-saleman', () => {
  let {
    app,
    ctx,
  } = {};

  // event
  const task_1 = {
    _id: mongoose.Types.ObjectId('59cefbc675981d44f07953e4'),
    executor: [{
      delete: 0,
      attach: [],
      status: 20,
      is_read: 0,
      leader: {
        name: 'lisidie',
        id: '59c4ac6b49db060020bfbc1d',
        from: 'bee_user',
      },
      user: {
        name: 'lisi',
        id: '5993b62558dd1b3c3dd070fa',
        from: 'bee_user',
      },
      extend: {
        is_order: true,
        expert: {
          name: 'lisi',
          id: '5993b62558dd1b3c3dd070fa',
          from: 'bee_user',
        },
      },
    }],
    extend: {
      old_car: [{
        _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
        name: '奥迪A62016风尚款',
      }],
    },
  };

  const executor_id_1 = task_1.executor[0].user.id;
  const event_context = {
    task: task_1,
    executor_id: executor_id_1,
  };

  // event -- task
  const et_context = {
    task: task_1,
    executor_id: executor_id_1,
  };


  const event_rules = [{
    event_type: Events.detail.replace_car_to_saleman_iweek,
    task_type: Events.taskType.system.replace_car_invitation_entry_shop,
    content: '${bee}的客户<% cust %>要进店评估、置换${car}，请提前和客户预约时间，做好接待准备',
    trigger: {
      rule: 'now',
      cycle: null,
      start: null,
      end: {
        cate: 'hour',
        value: 24,
      },
    },

    reminder: {
      rule_key: 4,
      rule_name: '截前3小时',
      time_diff: 3 * 60 * 60,
    },
  }];

  const v_event_tasks = [{
    event_type: 110101,
    context: {
      task: {
        _id: mongoose.Types.ObjectId('59cefbc675981d44f07953e4'),
        executor: [{
          delete: 0,
          attach: [],
          status: 20,
          is_read: 0,
          leader: {
            name: 'lisidie',
            id: '59c4ac6b49db060020bfbc1d',
            from: 'bee_user',
          },
          user: {
            name: 'lisi',
            id: '5993b62558dd1b3c3dd070fa',
            from: 'bee_user',
          },
          extend: {
            is_order: false,
            expert: {
              name: 'lisi',
              id: '5993b62558dd1b3c3dd070fa',
              from: 'bee_user',
            },
          },
        }],
        extend: {
          old_car: [{
            _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
            name: '奥迪A62016风尚款',
          }],
        },
      },
      executor_id: '5993b62558dd1b3c3dd070fa',
    },
    related: {
      id: '59cefbc675981d44f07953e4',
      func_model: 110100,
    },
    executor: {
      name: 'lisi',
      id: '5993b62558dd1b3c3dd070fa',
      from: 'bee_user',
    },
    rule: {
      task_type: 105,
      content: 'lisi的客户<% cust %>要进店评估、置换奥迪A62016风尚款，请提前和客户预约时间，做好接待准备',
      trigger: {
        rule: 'now',
        cycle: null,
        start: null,
        end: {
          cate: 'hour',
          value: 24,
        },
      },
      reminder: {
        rule_key: 4,
        rule_name: '截前3小时',
        time_diff: 10800,
      },
      extend: {
        old_car: [{
          _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
          name: '奥迪A62016风尚款',
        }],
      },

    },
  }];


  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
  });


  it('--getDetailType', function* () {

    const service = ctx.service.events.replaceCarToSaleman;

    // 邀约
    const context = event_context;
    let events = yield service.getDetailType(context);

    assert(events.length === 1);
    assert(events[0] === 110101);

    // 未邀约
    context.task.executor[0].extend.is_order = false;
    events = yield service.getDetailType(context);
    assert(events.length === 0);
  });

  it('-- getEventTask', function* () {
    // iweek
    const service = ctx.service.events.replaceCarToSaleman;
    const context = et_context;

    const event_tasks = yield service.getEventTask(event_rules, context);

    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);
  });

});
