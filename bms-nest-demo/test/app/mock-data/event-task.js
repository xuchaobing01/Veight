'use strict';
const moment = require('moment');

const { category, detail } = require('../../../app/common/event-type');

const now_tasks = [{
  test_id: 'event_now_task_test_id_1',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_now_plan_iweek_id_1', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_now_task_type',
    content: '这是一个立刻发送的任务',
    extend: {},
    trigger: {
      rule: 'now',
      cycle: { cate: 'd', value: 2 },
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-21 10:10:00',
  update_time: '2017-10-21 10:10:00',
  last_cycle_time: null,
}, {
  test_id: 'event_now_task_test_id_2',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_now_plan_iweek_id_2', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_now_task_type',
    content: '这是一个立刻发送的周期事件任务',
    extend: {},
    trigger: {
      rule: 'now',
      cycle: { cate: 'd', value: 2 },
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-18 10:10:00',
  update_time: '2017-10-19 10:10:00',
  last_cycle_time: moment().subtract(2, 'd'),
}, {
  test_id: 'event_now_task_test_id_3',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_now_plan_iweek_id_3', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_now_task_type',
    content: '这是一个立刻发送但已经发送过的周期事件任务',
    extend: {},
    trigger: {
      rule: 'now',
      cycle: { cate: 'd', value: 2 },
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-18 10:10:00',
  update_time: '2017-10-19 10:10:00',
  last_cycle_time: moment().subtract(1, 'd'),
}, {
  test_id: 'event_now_task_test_id_4',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_now_plan_iweek_id_4', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_now_task_type',
    content: '这是一个立刻发送但未修改状态的任务',
    extend: {},
    trigger: {
      rule: 'now',
      cycle: {},
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-18 10:10:00',
  update_time: '2017-10-19 10:10:00',
  last_cycle_time: moment().subtract(1, 'd'),
}];

const cycle_tasks = [{
  test_id: 'event_cycle_task_test_id_11',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_cycle_iweek_id_11', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_cycle_task_type',
    content: '这是一个延迟发送的任务',
    extend: {},
    trigger: {
      rule: 'cycle',
      cycle: { cate: 'd', value: 2 },
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-18 10:10:00',
  update_time: moment().subtract(2, 'd'),
  last_cycle_time: null,
}, {
  test_id: 'event_cycle_task_test_id_12',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_cycle_iweek_id_12', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_cycle_task_type',
    content: '这是一个延迟发送的周期事件任务',
    extend: {},
    trigger: {
      rule: 'cycle',
      cycle: { cate: 'd', value: 2 },
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-18 10:10:00',
  update_time: '2017-10-19 10:10:00',
  last_cycle_time: moment().subtract(2, 'd'),
}, {
  test_id: 'event_cycle_task_test_id_13',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_cycle_iweek_id_13', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_cycle_task_type',
    content: '这是一个延迟发送但已经发送过的周期事件任务',
    extend: {},
    trigger: {
      rule: 'cycle',
      cycle: { cate: 'd', value: 2 },
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-18 10:10:00',
  update_time: '2017-10-19 10:10:00',
  last_cycle_time: moment().subtract(1, 'd'),
}];

const delay_tasks = [{
  test_id: 'event_delay_task_test_id_11',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_delay_iweek_id_11', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_delay_task_type',
    content: '这是一个延迟发送的任务',
    extend: {},
    trigger: {
      rule: 'delay',
      cycle: { cate: 'd', value: 2 },
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-18 10:10:00',
  update_time: moment().subtract(2, 'd'),
  last_cycle_time: null,
}, {
  test_id: 'event_delay_task_test_id_12',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_delay_iweek_id_12', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_delay_task_type',
    content: '这是一个延迟发送的周期事件任务',
    extend: {},
    trigger: {
      rule: 'delay',
      cycle: { cate: 'd', value: 2 },
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-18 10:10:00',
  update_time: '2017-10-19 10:10:00',
  last_cycle_time: moment().subtract(2, 'd'),
}, {
  test_id: 'event_delay_task_test_id_13',
  event_type: detail.buy_car_plan_iweek,
  related: { id: 'test_delay_iweek_id_13', func_model: category.buy_car_plan },
  executor: { id: 'test_user_id', name: 'test_user_name', from: 'bee_user' },
  status: 0,
  context: {},
  rule: {
    task_type: 'test_delay_task_type',
    content: '这是一个延迟发送但已经发送过的周期事件任务',
    extend: {},
    trigger: {
      rule: 'delay',
      cycle: { cate: 'd', value: 2 },
      start: '',
      end: { cate: 'd', value: 3 },
    },
    reminder: { rule_key: 'key1', rule_name: '结束前一小时', time_diff: '3600' },
  },
  create_time: '2017-10-18 10:10:00',
  update_time: '2017-10-19 10:10:00',
  last_cycle_time: moment().subtract(1, 'd'),
}];

module.exports = { now_tasks, cycle_tasks, delay_tasks };
