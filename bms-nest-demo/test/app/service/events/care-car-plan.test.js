'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const { detail } = require('../../../../app/common/event-type');
const MockData = require('../../mock_interaction_task.data');

describe('care-car-plan', () => {
  let { ctx, service } = {};

  beforeEach(() => {
    ctx = app.mockContext();
    service = ctx.service.events.careCarPlan;
  });

  const car = MockData.car;
  const cust = MockData.cust;

  it('-- getDetailType(care-car-plan)', function* () {
    const context = { car, cust };
    const expected = [ detail.care_car_plan_30d ];
    const actual = yield service.getDetailType(context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getExecutor(care-car-plan)', function* () {
    const context = { car, cust };
    const expected = cust.belong;
    const actual = yield service.getExecutor(context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('-- getEventTask(care-car-plan)', function* () {
    const context = { car, cust };
    const event_rules = [{
      event_type: detail.care_car_plan_30d,
      task_type: 111,
      content: '请和客户<% cust %>聊聊${car}使用情况。',
      reminder: {
        rule_key: '4',
        rule_name: '截止前3小时',
        time_diff: 10800,
      },
      trigger: {
        rule: 'cycle',
        start: '',
        end: { cate: 'hour', value: 24 },
        cycle: { cate: 'minutes', value: 30 },
      },
    }];
    const expected = [{
      event_type: detail.care_car_plan_30d,
      context: { car, cust },
      rule: {
        task_type: 111,
        extend: {
          old_car: [ car ],
          cust: { name: '123', id: '59f1a688e4e8e0591ae2fd88' },
        },
        content: '请和客户<% cust %>聊聊宝马5系(进口) 2017款 540i M运动套装使用情况。',
        reminder: event_rules[0].reminder,
        trigger: event_rules[0].trigger,
      },
      executor: { id: '59f1a688e4e8e0591ae2fd55', name: 'test001', from: 'bee_user' },
      related: { id: '5a1542384f82260022248c4b', func_model: 130000 },
    }];
    const actual = yield service.getEventTask(event_rules, context);
    assert(actual);
    assert.deepEqual(actual, expected);
  });

});
