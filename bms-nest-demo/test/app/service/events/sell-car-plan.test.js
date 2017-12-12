'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const { detail } = require('../../../../app/common/event-type');
const MockData = require('../../mock_interaction_task.data');

describe('care-car-server', () => {
  let { ctx, service } = {};

  beforeEach(() => {
    ctx = app.mockContext();
    service = ctx.service.events.sellCarPlan;
  });

  const car = MockData.car;
  const cust = MockData.cust;

  it('-- getDetailType(care-car-server-iweek)', function* () {
    const context = { car, cust };
    const expected = [ detail.sell_car_plan_iweek ];
    const actual = yield service.getDetailType(context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getDetailType(care-car-server-imonth)', function* () {
    car.resell_date_type = 2;
    const context = { car, cust };
    const expected = [ detail.sell_car_plan_imonth ];
    const actual = yield service.getDetailType(context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getDetailType(care-car-server-hyear)', function* () {
    car.resell_date_type = 3;
    const context = { car, cust };
    const expected = [ detail.sell_car_plan_hyear ];
    const actual = yield service.getDetailType(context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getDetailType(care-car-server-iyear)', function* () {
    car.resell_date_type = 4;
    const context = { car, cust };
    const expected = [ detail.sell_car_plan_iyear ];
    const actual = yield service.getDetailType(context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getDetailType(care-car-server-ayear)', function* () {
    car.resell_date_type = 5;
    const context = { car, cust };
    const expected = [ detail.sell_car_plan_ayear ];
    const actual = yield service.getDetailType(context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getExecutor(care-car-server)', function* () {
    const context = { car, cust };
    const expected = cust.belong;
    const actual = yield service.getExecutor(context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getEventTask(care-car-server-iweek)', function* () {
    const context = { car, cust };
    const event_rules = [{
      event_type: detail.sell_car_plan_iweek,
      task_type: 107,
      content: '请邀请客户<% cust %>到${shop}评估、出售${car}，并为其选择一位销售专家。',
      extend: {
        cust: {},
        car: {},
      },
      trigger: {
        rule: 'now',
        cycle: null,
        start: '',
        end: { cate: 'hour', value: 24 },
      },
      reminder: {
        rule_key: 4,
        rule_name: '截止前3小时',
        time_diff: 10800,
      },
    }];
    const expected = [{
      event_type: detail.sell_car_plan_iweek,
      context: { car, cust },
      rule: {
        task_type: 107,
        extend: {
          old_car: [ car ],
          cust: { name: '123', id: '59f1a688e4e8e0591ae2fd88' },
        },
        content: '请邀请客户<% cust %>到卢山4S店评估、出售宝马5系(进口) 2017款 540i M运动套装，并为其选择一位销售专家。',
        reminder: event_rules[0].reminder,
        trigger: event_rules[0].trigger,
      },
      executor: { id: '59f1a688e4e8e0591ae2fd55', name: 'test001', from: 'bee_user' },
      related: { id: '5a1542384f82260022248c4b', func_model: 120000 },
    }];
    const actual = yield service.getEventTask(event_rules, context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getEventTask(care-car-server-imonth)', function* () {
    car.resell_date_type = 2;
    const context = { car, cust };
    const event_rules = [{
      event_type: detail.sell_car_plan_imonth,
      task_type: 109,
      content: '请和客户<% cust %>聊聊${car}使用情况，并关注出手计划是否有变？',
      extend: { cust: {}, shop: {}, car: {} },
      trigger: {
        rule: 'cycle',
        cycle: { cate: 'days', value: 10 },
        start: '',
        end: { cate: 'hour', value: 24 },
      },
      reminder: {
        rule_key: 4,
        rule_name: '截止前3小时',
        time_diff: 10800,
      },
    }];
    const expected = [{
      event_type: detail.sell_car_plan_imonth,
      context: { car, cust },
      rule: {
        task_type: 109,
        extend: {
          old_car: [ car ],
          cust: { name: '123', id: '59f1a688e4e8e0591ae2fd88' },
        },
        content: '请和客户<% cust %>聊聊宝马5系(进口) 2017款 540i M运动套装使用情况，并关注出手计划是否有变？',
        reminder: event_rules[0].reminder,
        trigger: event_rules[0].trigger,
      },
      executor: { id: '59f1a688e4e8e0591ae2fd55', name: 'test001', from: 'bee_user' },
      related: { id: '5a1542384f82260022248c4b', func_model: 120000 },
    }];
    const actual = yield service.getEventTask(event_rules, context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getEventTask(care-car-server-hyear)', function* () {
    car.resell_date_type = 3;
    const context = { car, cust };
    const event_rules = [{
      event_type: detail.sell_car_plan_hyear,
      task_type: 109,
      content: '请和客户<% cust %>聊聊${car}使用情况，并关注出手计划是否有变？',
      extend: { cust: {}, car: {} },
      trigger: {
        rule: 'cycle',
        cycle: { cate: 'days', value: 36 },
        start: '',
        end: { cate: 'hour', value: 24 },
      },
      reminder: {
        rule_key: 4,
        rule_name: '截止前3小时',
        time_diff: 10800,
      },
    }];
    const expected = [{
      event_type: detail.sell_car_plan_hyear,
      context: { car, cust },
      rule: {
        task_type: 109,
        extend: {
          old_car: [ car ],
          cust: { name: '123', id: '59f1a688e4e8e0591ae2fd88' },
        },
        content: '请和客户<% cust %>聊聊宝马5系(进口) 2017款 540i M运动套装使用情况，并关注出手计划是否有变？',
        reminder: event_rules[0].reminder,
        trigger: event_rules[0].trigger,
      },
      executor: { id: '59f1a688e4e8e0591ae2fd55', name: 'test001', from: 'bee_user' },
      related: { id: '5a1542384f82260022248c4b', func_model: 120000 },
    }];
    const actual = yield service.getEventTask(event_rules, context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getEventTask(care-car-server-iyear)', function* () {
    car.resell_date_type = 4;
    const context = { car, cust };
    const event_rules = [{
      event_type: detail.sell_car_plan_iyear,
      task_type: 109,
      content: '请和客户<% cust %>聊聊${car}使用情况，并关注出手计划是否有变？',
      extend: { cust: {}, car: {} },
      trigger: {
        rule: 'cycle',
        cycle: { cate: 'days', value: 60 },
        start: '',
        end: { cate: 'hour', value: 24 },
      },
      reminder: {
        rule_key: 4,
        rule_name: '截止前3小时',
        time_diff: 10800,
      },
    }];
    const expected = [{
      event_type: detail.sell_car_plan_iyear,
      context: { car, cust },
      rule: {
        task_type: 109,
        extend: {
          old_car: [ car ],
          cust: { name: '123', id: '59f1a688e4e8e0591ae2fd88' },
        },
        content: '请和客户<% cust %>聊聊宝马5系(进口) 2017款 540i M运动套装使用情况，并关注出手计划是否有变？',
        reminder: event_rules[0].reminder,
        trigger: event_rules[0].trigger,
      },
      executor: { id: '59f1a688e4e8e0591ae2fd55', name: 'test001', from: 'bee_user' },
      related: { id: '5a1542384f82260022248c4b', func_model: 120000 },
    }];
    const actual = yield service.getEventTask(event_rules, context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getEventTask(care-car-server-ayear)', function* () {
    car.resell_date_type = 5;
    const context = { car, cust };
    const event_rules = [{
      event_type: detail.sell_car_plan_ayear,
      task_type: 109,
      content: '请和客户<% cust %>聊聊${car}使用情况，并关注出手计划是否有变？',
      extend: { cust: {}, car: {} },
      trigger: {
        rule: 'cycle',
        cycle: { cate: 'days', value: 90 },
        start: '',
        end: { cate: 'hour', value: 24 },
      },
      reminder: {
        rule_key: 4,
        rule_name: '截止前3小时',
        time_diff: 10800,
      },
    }];
    const expected = [{
      event_type: detail.sell_car_plan_ayear,
      context: { car, cust },
      rule: {
        task_type: 109,
        extend: {
          old_car: [ car ],
          cust: { name: '123', id: '59f1a688e4e8e0591ae2fd88' },
        },
        content: '请和客户<% cust %>聊聊宝马5系(进口) 2017款 540i M运动套装使用情况，并关注出手计划是否有变？',
        reminder: event_rules[0].reminder,
        trigger: event_rules[0].trigger,
      },
      executor: { id: '59f1a688e4e8e0591ae2fd55', name: 'test001', from: 'bee_user' },
      related: { id: '5a1542384f82260022248c4b', func_model: 120000 },
    }];
    const actual = yield service.getEventTask(event_rules, context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

});
