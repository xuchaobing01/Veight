'use strict';

const assert = require('assert');
const mock = require('egg-mock');

const mongoose = require('mongoose');
const Events = require('../../../../app/common/event-type');


describe('## replace-car-plan', () => {
  let {
    app,
    ctx,
  } = {};

  // event
  const cust_1 = {
    car_plan: [{
      buy_date_type: 2,
      _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
      is_transfer: 1,
      transfer_cars: [ '59e450c5d20f4525f8138aa9' ],
      delete: 0,
    }],
    own_car: [
      {
        _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
        brand_name: '奥迪',
        type_name: '奥迪A6',
        model_name: '2016风尚款',
        resell_date_type: 1,
      },
    ],
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
      is_transfer: 1,
      transfer_cars: [ '59e450c5d20f4525f8138aa9' ],
      delete: 0,
    }],
    own_car: [
      {
        _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
        brand_name: '奥迪',
        type_name: '奥迪A6',
        model_name: '2016风尚款',
        resell_date_type: 1,
      },
    ],

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


  const event_rules = [
    // 置换
    {
      event_type: Events.detail.replace_car_plan_iweek,
      task_type: Events.taskType.system.replace_car_invitation,
      content: '请邀请客户<% cust %>到${shop}评估、置换${car},并为其选择一位销售专家',
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
    },

    // 卖车
    {
      event_type: 120001,
      task_type: 107,
      content: '请邀请客户<% cust %>到${shop}评估、出售${car}，并为其选择一位销售专家。',
      trigger: {
        rule: 'now',
        cycle: null,
        start: '',
        end: {
          cate: 'hour',
          value: 24,
        },
      },
      reminder: {
        rule_key: 4,
        rule_name: '截止前3小时',
        time_diff: 10800,
      },
    },

  ];

  const v_event_tasks =
  [
    {
      event_type: 110001,
      context: {
        cust: {
          _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa2'),
          car_plan: [
            {
              _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
              is_transfer: 1,
              transfer_cars: [
                '59e450c5d20f4525f8138aa9',
              ],
              delete: 0,
            },
          ],
          own_car: [
            {
              _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
              brand_name: '奥迪',
              type_name: '奥迪A6',
              model_name: '2016风尚款',
              resell_date_type: 1,
            },
          ],
          info: {
            name: '张三',
          },
          belong: {
            id: '59b9db5bda074d00222186c3',
            name: 'wangwedan',
            from: 'plat_user',
          },
          shop: [
            {
              _id: '59b9db5bda074d00222186c3',
              name: '卢山4S店',
            },
          ],
        },
        car_plan_id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
        car: {
          _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
          brand_name: '奥迪',
          type_name: '奥迪A6',
          model_name: '2016风尚款',
          resell_date_type: 1,
        },
      },
      related: {
        id: '59e450c5d20f4525f8138aa3',
        func_model: 110000,
      },
      executor: {
        id: '59b9db5bda074d00222186c3',
        name: 'wangwedan',
        from: 'plat_user',
      },
      rule: {
        task_type: 104,
        content: '请邀请客户<% cust %>到卢山4S店评估、置换2016风尚款,并为其选择一位销售专家',
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
          old_car: [
            {
              _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
              name: '2016风尚款',
            },
          ],
          shop: {
            id: '59b9db5bda074d00222186c3',
            name: '卢山4S店',
          },
        },
      },
    },
    {
      event_type: 120001,
      related: {
        id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
        func_model: 120000,
      },
      executor: {
        id: '59b9db5bda074d00222186c3',
        name: 'wangwedan',
        from: 'plat_user',
      },
      context: {
        cust: {
          _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa2'),
          car_plan: [
            {
              _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
              is_transfer: 1,
              transfer_cars: [
                '59e450c5d20f4525f8138aa9',
              ],
              delete: 0,
            },
          ],
          own_car: [
            {
              _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
              brand_name: '奥迪',
              type_name: '奥迪A6',
              model_name: '2016风尚款',
              resell_date_type: 1,
            },
          ],
          info: {
            name: '张三',
          },
          belong: {
            id: '59b9db5bda074d00222186c3',
            name: 'wangwedan',
            from: 'plat_user',
          },
          shop: [
            {
              _id: '59b9db5bda074d00222186c3',
              name: '卢山4S店',
            },
          ],
        },
        car_plan_id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
        car: {
          _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
          brand_name: '奥迪',
          type_name: '奥迪A6',
          model_name: '2016风尚款',
          resell_date_type: 1,
        },
      },
      rule: {
        task_type: 107,
        trigger: {
          rule: 'now',
          cycle: null,
          start: '',
          end: {
            cate: 'hour',
            value: 24,
          },
        },
        reminder: {
          rule_key: 4,
          rule_name: '截止前3小时',
          time_diff: 10800,
        },
        extend: {
          cust: {
            id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa2'),
            name: '张三',
          },
          old_car: [
            {
              _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
              brand_name: '奥迪',
              type_name: '奥迪A6',
              model_name: '2016风尚款',
              resell_date_type: 1,
            },
          ],
        },
        content: '请邀请客户<% cust %>到卢山4S店评估、出售2016风尚款，并为其选择一位销售专家。',
      },
      status: 3,
    },
  ];
  // const v_event_tasks = [{
  //   event_type: 110001,
  //   context: {
  //     cust: {
  //       _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa2'),
  //       car_plan: [{
  //         _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
  //         is_transfer: 1,
  //         transfer_cars: [ '59e450c5d20f4525f8138aa9' ],
  //         delete: 0,
  //       }],
  //       own_car: [
  //         {
  //           _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
  //           brand_name: '奥迪',
  //           type_name: '奥迪A6',
  //           model_name: '2016风尚款',
  //         },
  //       ],
  //       info: {
  //         name: '张三',
  //       },
  //       belong: {
  //         id: '59b9db5bda074d00222186c3',
  //         name: 'wangwedan',
  //         from: 'plat_user',
  //       },
  //       shop: [{
  //         _id: '59b9db5bda074d00222186c3',
  //         name: '卢山4S店',
  //       }],
  //     },
  //     car_plan_id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa3'),
  //   },
  //   related: {
  //     id: '59e450c5d20f4525f8138aa3',
  //     func_model: 110000,
  //   },
  //   executor: {
  //     id: '59b9db5bda074d00222186c3',
  //     name: 'wangwedan',
  //     from: 'plat_user',
  //   },
  //   rule: {
  //     task_type: 104,
  //     content: '请邀请客户<% cust %>到卢山4S店评估、置换2016风尚款,并为其选择一位销售专家',
  //     trigger: {
  //       rule: 'now',
  //       cycle: null,
  //       start: null,
  //       end: {
  //         cate: 'hour',
  //         value: 24,
  //       },
  //     },
  //     reminder: {
  //       rule_key: 4,
  //       rule_name: '截前3小时',
  //       time_diff: 10800,
  //     },
  //     extend: {
  //       cust: {
  //         name: '张三',
  //         id: '59e450c5d20f4525f8138aa2',
  //       },
  //       car_plan: {
  //         id: '59e450c5d20f4525f8138aa3',
  //       },
  //       shop: {
  //         name: '卢山4S店',
  //         id: '59b9db5bda074d00222186c3',
  //       },
  //       old_car: [{
  //         _id: mongoose.Types.ObjectId('59e450c5d20f4525f8138aa9'),
  //         name: '2016风尚款',
  //       }],
  //     },
  //   },
  // }];


  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
  });


  it('-- getDetailType', function* () {

    const service = ctx.service.events.replaceCarPlan;
    const context = event_context;
    let events = yield service.getDetailType(context);

    assert(events.length === 2);
    assert(events[0] === 110002);
    assert(events[1] === 120001);

    context.cust.car_plan[0].buy_date_type = 0;
    events = yield service.getDetailType(context);
    assert(events.length === 0);

    context.cust.car_plan[0].buy_date_type = 1;
    events = yield service.getDetailType(context);
    assert(events[0] === 110001);

    context.cust.car_plan[0].buy_date_type = 3;
    events = yield service.getDetailType(context);
    assert(events[0] === 110003);

    context.cust.car_plan[0].buy_date_type = 4;
    events = yield service.getDetailType(context);
    assert(events[0] === 110004);

    context.cust.car_plan[0].buy_date_type = 5;
    events = yield service.getDetailType(context);
    assert(events[0] === 110005);
  });

  it('-- getEventTask', function* () {
    // iweek
    const service = ctx.service.events.replaceCarPlan;
    const context = et_context;

    let event_tasks = yield service.getEventTask(event_rules, context);

    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);
    assert.deepEqual(event_tasks[1], v_event_tasks[1]);

    // imonth;
    v_event_tasks[0].event_type = event_rules[0].event_type = Events.detail.replace_car_plan_imonth;
    v_event_tasks[0].rule.task_type = event_rules[0].task_type = Events.taskType.system.replace_car_likeUp_invitation;
    v_event_tasks[0].rule.trigger.rule = event_rules[0].trigger.rule = 'day';
    v_event_tasks[0].rule.trigger.cycle = event_rules[0].trigger.cycle = 10;

    event_rules[0].content = '请和客户<% cust %>聊聊${car}的置换计划，有没有新的目标、新的变化？';
    v_event_tasks[0].rule.content = '请和客户<% cust %>聊聊2016风尚款的置换计划，有没有新的目标、新的变化？';

    event_tasks = yield service.getEventTask(event_rules, et_context);


    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);

    // hyear;
    v_event_tasks[0].event_type = event_rules[0].event_type = Events.detail.replace_car_plan_hyear;
    v_event_tasks[0].rule.trigger.cycle = event_rules[0].trigger.cycle = 30;

    event_tasks = yield service.getEventTask(event_rules, et_context);

    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);

    // iyear;
    v_event_tasks[0].event_type = event_rules[0].event_type = Events.detail.replace_car_plan_iyear;
    v_event_tasks[0].rule.trigger.cycle = event_rules[0].trigger.cycle = 60;

    event_tasks = yield service.getEventTask(event_rules, et_context);

    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);

    // ayear;
    v_event_tasks[0].event_type = event_rules[0].event_type = Events.detail.replace_car_plan_ayear;
    v_event_tasks[0].rule.trigger.cycle = event_rules[0].trigger.cycle = 90;

    event_tasks = yield service.getEventTask(event_rules, et_context);

    assert(event_tasks.length === v_event_tasks.length);
    assert.deepEqual(event_tasks[0], v_event_tasks[0]);

  });

});
