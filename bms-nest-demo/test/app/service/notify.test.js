'use strict';

const assert = require('assert');
const mock = require('egg-mock');

const MockData = require('../mock_data');
const CommonUtil = require('../../../app/common/util');
const Const = require('../../../app/common/const');


function equalMsg(msg1, msg2) {
  assert.equal(msg1.notify_type, msg2.notify_type);
  assert.equal(msg1.notify_content, msg2.notify_content);
  assert.equal(msg1.task_id, msg2.task_id);
  // assert.equal(msg1.open_id, msg2.open_id);
  // assert.equal(msg1.tlt_id, msg2.tlt_id);
  assert.equal(msg1.receviver.id, msg2.receviver.id);
  assert.equal(msg1.receviver.name, msg2.receviver.name);
  assert.equal(msg1.receviver.from, msg2.receviver.from);

  return true;
}

describe('taskNotity()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
  });

  it('new task,notify msg', function* () {
    const task = MockData.Notify.newTask.task;
    // task.creator.id = '-1';
    // task.executor[2].leader = null;
    const msgs = yield ctx.getService('notify').taskNotity(task, Const.TaskAction.new);

    assert(msgs.length === 7);
    // 通知执行人消息
    assert(equalMsg(msgs[0], MockData.Notify.newTask.msg[0]));
    assert(equalMsg(msgs[4], MockData.Notify.newTask.msg[1]));

    // 通知执行人上级消息
    assert(equalMsg(msgs[5], MockData.Notify.newTask.msg[2]));
    assert(equalMsg(msgs[6], MockData.Notify.newTask.msg[3]));
  });

  it('update task,notify msg', function* () {
    const task = MockData.Notify.updateTask.task;
    const msgs = yield ctx.getService('notify').taskNotity(task, Const.TaskAction.update);

    assert(msgs.length === 3);
    // 通知执行人消息
    assert(equalMsg(msgs[0], MockData.Notify.updateTask.msg[0]));
    assert(equalMsg(msgs[1], MockData.Notify.updateTask.msg[1]));

    assert(equalMsg(msgs[2], MockData.Notify.updateTask.msg[2]));
  });

  it('end task,notify msg', function* () {
    const task = MockData.Notify.endTask;
    const msgs = yield ctx.getService('notify').taskNotity(task.task, Const.TaskAction.end);

    assert(msgs.length === 3);
    // 通知执行人消息
    assert(equalMsg(msgs[0], task.msg[0]));
    assert(equalMsg(msgs[1], task.msg[1]));

    assert(equalMsg(msgs[2], task.msg[2]));
  });

  it('overdue task,notify msg', function* () {
    const task = MockData.Notify.overdueTask;
    const msgs = yield ctx.getService('notify').taskNotity(task.task, Const.TaskAction.overdue);

    assert(msgs.length === 2);
    // 通知执行人消息
    assert(equalMsg(msgs[0], task.msg[0]));

    // 发起人
    assert(equalMsg(msgs[1], task.msg[1]));
  });

  it('finish task,notify msg', function* () {
    const task = MockData.Notify.finishTask;
    // task.task.creator.id = '-1';
    // task.task.end_time = '2018-08-02 12:00:00';


    const msgs = yield ctx.getService('notify').taskNotity(task.task, Const.TaskAction.finish, task.executor_id);

    assert(msgs.length === 2);
    // 发起人
    assert(equalMsg(msgs[0], task.msg[0]));

    // 上级
    assert(equalMsg(msgs[1], task.msg[1]));
  });

  it('message task,notify msg', function* () {
    const task = MockData.Notify.msgTask;
    const msgs = yield ctx.getService('notify').taskNotity(task.task, Const.TaskAction.msg);

    assert(msgs.length === 2);
    // 执行人
    assert(equalMsg(msgs[0], task.msg[0]));

    // 发起人
    assert(equalMsg(msgs[1], task.msg[1]));
  });

  it('ahead task,notify msg', function* () {
    const task = MockData.Notify.aheadTask;
    const msgs = yield ctx.getService('notify').taskNotity(task.task, Const.TaskAction.ahead);

    assert(msgs.length === 2);
    assert(msgs[0].notify_type === '任务提醒');
    assert(msgs[1].notify_type === '任务提醒');
  });

  it('laterOverdue task,notify msg', function* () {
    const task = MockData.Notify.laterOverdueTask;
    const msgs = yield ctx.getService('notify').taskNotity(task.task, Const.TaskAction.laterOverdue);

    assert(msgs.length === 2);
    assert(equalMsg(msgs[0], task.msg[0]));
  });

  it('ahead task,notify msg', function* () {
    const task = MockData.Notify.aheadTask;
    const msgs = yield ctx.getService('notify').taskNotity(task.task, Const.TaskAction.ahead);

    assert(msgs.length === 2);
    assert(msgs[0].notify_type === '任务提醒');
    assert(msgs[1].notify_type === '任务提醒');
  });

  it('to_track task,notify msg', function* () {
    const task = MockData.Notify.trackTask;
    const msgs = yield ctx.getService('notify').taskNotity(task.task, Const.TaskAction.to_track);

    assert(msgs.length === 2);
    delete msgs[0].time;
    delete task.msg[0].time;
    delete msgs[1].time;
    delete task.msg[1].time;

    assert.deepEqual(msgs[0], task.msg[0]);
    assert.deepEqual(msgs[1], task.msg[1]);
  });

});


describe('_scanLaterOverdue()', () => {
  let {
    app,
    ctx,
    mocktasks,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();

    const Time = CommonUtil.dateFormat(Date.now() - 25 * 60 * 60 * 1000); // 昨天的当前时间;
    // 设置数据
    const task_tlt = {
      status: 10,
      end_time: Time,
      content: '_scanLaterOverdue',
    };
    const ids = [ 1, 2, 3 ];

    mocktasks = ids.map(id => {
      const task = CommonUtil.clone(task_tlt);
      return task;
    });

    const creats = mocktasks.map(task => {
      return ctx.getModel('task').create(task);
    });

    yield app.myutil.parallel(creats);

  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: '_scanLaterOverdue',
    });
  });

  it('scan laterOverdue', function* () {
    const tasks = yield ctx.getService('notify')._scanLaterOverdue();

    const mytasks = tasks.filter(value => {
      return value.content === '_scanLaterOverdue';
    });

    assert(mytasks.length === 3);
    assert(mytasks[0].status, mocktasks[0].status);
    assert(mytasks[0].end_time, mocktasks[0].end_time);
    assert(mytasks[0].content, mocktasks[0].content);
  });
});
