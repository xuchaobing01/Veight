'use strict';

const assert = require('assert');
const mock = require('egg-mock');

const MockData = require('../mock_data');
const CommonUtil = require('../../../app/common/util');


describe('scanTaskNotity()', () => {
  let {
    app,
    ctx,
    aheadMockTasks,
    overdueMockTasks,
    trackMockTasks,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();

    const ids = [ 1, 2 ];
    // 提前提醒
    let time = CommonUtil.dateFormat(Date.now() - 3 * 1000);

    aheadMockTasks = ids.map(id => {
      const task = CommonUtil.clone(MockData.task_tlt);
      task.content = 'notify ahead';
      task.reminder.rule_key = '3';
      task.reminder.alert_time = time;
      task.end_time = CommonUtil.dateFormat(Date.now() + 60 * 1000);
      return task;
    });

    // 取消
    let task = CommonUtil.clone(aheadMockTasks[0]);
    task.status = 60;
    aheadMockTasks.push(task);

    // 删除
    task = CommonUtil.clone(aheadMockTasks[0]);
    task.delete = 1;
    aheadMockTasks.push(task);

    let creats = aheadMockTasks.map(task => {
      return ctx.getModel('task').create(task);
    });

    yield app.myutil.parallel(creats);

    // 逾期提醒
    time = CommonUtil.dateFormat(Date.now() - 3 * 1000);
    overdueMockTasks = ids.map(id => {
      const task = CommonUtil.clone(MockData.task_tlt);
      task.content = 'notify overdue';
      task.end_time = time;
      return task;
    });

    creats = overdueMockTasks.map(task => {
      return ctx.getModel('task').create(task);
    });

    yield app.myutil.parallel(creats);

    // 跟进提醒
    time = CommonUtil.dateFormat(Date.now() - 3 * 1000);
    trackMockTasks = ids.map(id => {
      const task = CommonUtil.clone(MockData.task_tlt);
      task.content = 'notify to_track';
      task.tracke_time = time;
      return task;
    });

    creats = trackMockTasks.map(task => {
      return ctx.getModel('task').create(task);
    });

    yield app.myutil.parallel(creats);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'notify ahead',
    });

    yield ctx.getModel('task').remove({
      content: 'notify overdue',
    });

    yield ctx.getModel('task').remove({
      content: 'notify to_track',
    });
  });

  it('scanTaskNotity', function* () {
    let {
      aheadTask,
      overdueTask,
      trackTask,
    } = yield ctx.getService('notifyExec').scanTaskNotity();

    aheadTask = aheadTask.filter(t => {
      return t.content === 'notify ahead';
    });
    assert(aheadTask.length === 2);
    assert(aheadMockTasks[0].status, aheadTask[0].status);
    assert(aheadMockTasks[0].reminder.alert_time, aheadTask[0].reminder.alert_time);
    assert(aheadMockTasks[0].content, aheadTask[0].content);

    overdueTask = overdueTask.filter(t => {
      return t.content === 'notify overdue';
    });
    assert(overdueTask.length === 2);
    assert(overdueMockTasks[0].status, overdueTask[0].status);
    assert(overdueMockTasks[0].end_time, overdueTask[0].end_time);
    assert(overdueMockTasks[0].content, overdueTask[0].content);

    trackTask = trackTask.filter(t => {
      return t.content === 'notify to_track';
    });
    assert(trackTask.length === 2);
    assert(trackMockTasks[0].status, trackTask[0].status);
    assert(trackMockTasks[0].tracke_time, trackTask[0].tracke_time);
    assert(trackMockTasks[0].content, trackTask[0].content);
  });

});
