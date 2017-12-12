'use strict';

const assert = require('assert');
const mock = require('egg-mock');

const mongoose = require('mongoose');
const Events = require('../../../../app/common/event-type');


describe('## buy-car-plan', () => {
  let {
    app,
    ctx,
  } = {};

  // event
  const cust_1 = {
    car_plan: [{
      buy_date_type: 2,
      _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
      delete: 0,
    }],
  };
  const car_plan_id_1 = cust_1.car_plan[0]._id;
  const event_context = {
    cust: cust_1,
    car_plan_id: car_plan_id_1,
  };

  // event -- task
  const cust_2 = {
    _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa2'),
    car_plan: [{
      _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
      delete: 0,
    }],
    info: {
      name: '张三',
    },
    belong: {
      id: '59b9db5bda074d00222186c3',
      name: 'wangwedan',
      from: 'plat_user',
    },
    shop: [{
      _id: '59b9db5bda074d00222186c3',
      name: '卢山4S店',
    }],
  };
  const car_plan_id_2 = cust_2.car_plan[0]._id;
  const et_context = {
    cust: cust_2,
    car_plan_id: car_plan_id_2,
  };


  const event_rules = [{
    event_type: Events.detail.buy_car_plan_iweek,
    task_type: Events.taskType.system.buy_car_invitation,
    content: '请邀请客户<% cust %>到${shop}看车购车',
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
    event_type: 100001,
    context: {
      cust: {
        _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa2'),
        car_plan: [{
          _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
          delete: 0,
        }],
        info: {
          name: '张三',
        },
        belong: {
          id: '59b9db5bda074d00222186c3',
          name: 'wangwedan',
          from: 'plat_user',
        },
        shop: [{
          _id: '59b9db5bda074d00222186c3',
          name: '卢山4S店',
        }],
      },
      car_plan_id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
    },
    related: {
      id: '59e450c5d20f4525f8138aa3',
      func_model: 100000,
    },
    executor: {
      id: '59b9db5bda074d00222186c3',
      name: 'wangwedan',
      from: 'plat_user',
    },
    rule: {
      task_type: 101,
      content: '请邀请客户<% cust %>到卢山4S店看车购车',
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
        cust: {
          name: '张三',
          id: '59e450c5d20f4525f8138aa2',
        },
        car_plan: {
          id: '59e450c5d20f4525f8138aa3',
        },
        shop: {
          name: '卢山4S店',
          id: '59b9db5bda074d00222186c3',
        },
        new_car: [{
          id: null,
          name: null,
        }],
      },
    },
  }];


  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
  });


  it('-- getDetailType', function* () {

    const service = ctx.service.events.buyCarPlan;
    const context = event_context;
    let events = yield service.getDetailType(context);

    assert(events.length === 1);
    assert(events[0] === 100002);

    context.cust.car_plan[0].buy_date_type = 0;
    events = yield service.getDetailType(context);
    assert(events.length === 0);

    context.cust.car_plan[0].buy_date_type = 1;
    events = yield service.getDetailType(context);
    assert(events[0] === 100001);

    context.cust.car_plan[0].buy_date_type = 3;
    events = yield service.getDetailType(context);
    assert(events[0] === 100003);

    context.cust.car_plan[0].buy_date_type = 4;
    events = yield service.getDetailType(context);
    assert(events[0] === 100004);

    context.cust.car_plan[0].buy_date_type = 5;
    events = yield service.getDetailType(context);
    assert(events[0] === 100005);
  });

  it('-- getEventTask', function* () {
    // iweek
    const service = ctx.service.events.buyCarPlan;
    const context = et_context;

    let event_tasks = yield service.getEventTask(event_rules, context);

    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);

    // imonth;
    event_rules[0].event_type = Events.detail.buy_car_plan_imonth;
    event_rules[0].task_type = Events.taskType.system.buy_car_likeUp_invitation;
    event_rules[0].content = '请和客户#{cust}聊聊购车计划，有没有新的目标、新的变化？';
    event_rules[0].trigger.rule = 'day';
    event_rules[0].trigger.cycle = 10;

    v_event_tasks[0].event_type = Events.detail.buy_car_plan_imonth;
    v_event_tasks[0].rule.task_type = Events.taskType.system.buy_car_likeUp_invitation;
    v_event_tasks[0].rule.content = '请和客户#{cust}聊聊购车计划，有没有新的目标、新的变化？';
    v_event_tasks[0].rule.trigger.rule = 'day';
    v_event_tasks[0].rule.trigger.cycle = 10;

    event_tasks = yield service.getEventTask(event_rules, et_context);


    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);

    // hyear;
    event_rules[0].event_type = Events.detail.buy_car_plan_hyear;
    event_rules[0].trigger.cycle = 30;

    v_event_tasks[0].event_type = Events.detail.buy_car_plan_hyear;
    v_event_tasks[0].rule.trigger.cycle = 30;

    event_tasks = yield service.getEventTask(event_rules, et_context);

    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);

    // iyear;
    event_rules[0].event_type = Events.detail.buy_car_plan_iyear;
    event_rules[0].trigger.cycle = 60;

    v_event_tasks[0].event_type = Events.detail.buy_car_plan_iyear;
    v_event_tasks[0].rule.trigger.cycle = 60;

    event_tasks = yield service.getEventTask(event_rules, et_context);

    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);

    // ayear;
    event_rules[0].event_type = Events.detail.buy_car_plan_ayear;
    event_rules[0].trigger.cycle = 90;

    v_event_tasks[0].event_type = Events.detail.buy_car_plan_ayear;
    v_event_tasks[0].rule.trigger.cycle = 90;

    event_tasks = yield service.getEventTask(event_rules, et_context);

    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);
  });

});
