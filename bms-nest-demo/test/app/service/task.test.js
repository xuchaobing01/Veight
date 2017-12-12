'use strict';

const assert = require('assert');
const mock = require('egg-mock');

const MockData = require('../mock-data/task');


describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.createTask[0];
    yield ctx.getModel('task').create(task);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    followerMap()', function* () {
    const task = MockData.createTask[0];
    const data = yield ctx.getService('task').followerMap(task);
    const follower = [ ...data.values() ];
    assert(follower[0].tracked[0].id === task.executor[0].user.id);
    assert(follower[0].tracked[1].id === task.executor[1].user.id);
    assert(follower[0].user.id === task.executor[0].leader.id);
    assert(follower[0].user.id === task.executor[1].leader.id);
  });


});

describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.createTask[0];
    yield ctx.getModel('task').create(task);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    create()', function* () {
    const task = MockData.createTask[0];
    const data = yield ctx.getService('task').create(task);
    assert(data.executor.length === task.executor.length);
    assert(data.creator.id = data.creator.id);
    assert(data.end_time === task.end_time);

  });


});

describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.createTask[0];
    yield ctx.getModel('task').create(task);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    delete()', function* () {
    const task = MockData.createTask[0];
    const data = yield ctx.getService('task').create(task);
    const _id = data._id;
    const data1 = yield ctx.getService('task').delete(_id, task.creator.id);
    assert(data1 === true);
  });
});


describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.createTask[0];
    yield ctx.getModel('task').create(task);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    allList()', function* () {
    const task = MockData.createTask[0];
    const p = {
      page: 1,
      size: 20,
      userId: task.creator.id,
    };
    const data1 = yield ctx.getService('task').allList(p);
    assert(data1.length !== 0);
  });
});


describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.createTask[0];
    yield ctx.getModel('task').create(task);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    receiveList()', function* () {
    const task = MockData.createTask[0];
    const p = {
      page: 1,
      size: 20,
      userId: task.executor[0].user.id,
    };
    const data1 = yield ctx.getService('task').receiveList(p);
    assert(data1.length === 1);
  });
});


describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.createTask[0];
    yield ctx.getModel('task').create(task);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    receiveList()', function* () {
    const task = MockData.createTask[0];
    const p = {
      page: 1,
      size: 20,
      userId: task.creator.id,
    };
    const data1 = yield ctx.getService('task').receiveList(p);
    assert(data1.length !== 1);
  });
});


describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.createTask[0];
    yield ctx.getModel('task').create(task);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    followerList()', function* () {
    const task = MockData.createTask[0];
    const p = {
      page: 1,
      size: 20,
      userId: task.executor[0].leader.id,
    };
    const data1 = yield ctx.getService('task').followerList(p);
    assert(data1.length !== 0);
  });
});

describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.createTask[0];
    yield ctx.getModel('task').create(task);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    deleteList()', function* () {
    const task = MockData.createTask[0];
    const p = {
      page: 1,
      size: 20,
      userId: task.executor[0].leader.id,
    };
    const data1 = yield ctx.getService('task').deleteList(p);
    assert(data1.length !== 1);
  });
});


describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    detail()', function* () {
    const task = MockData.createTask[0];
    const data = yield ctx.getService('task').create(task);
    const _id = data._id;
    const data1 = yield ctx.getService('task').detail(_id);
    assert(data1.creator.id === task.creator.id);
    assert(data1.executor[0].user.id === task.executor[0].user.id);
    assert(data1.executor[1].user.id === task.executor[1].user.id);
  });
});


describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    updateIsRead()', function* () {
    const task = MockData.createTask[0];
    const userId = task.executor[0].user.id;
    const data = yield ctx.getService('task').create(task);
    const _id = data._id;
    yield ctx.getService('task').updateIsRead(_id, userId);
    const data1 = yield ctx.getModel('task').findOne({ _id });
    assert(data1.executor[0].is_read === 1);
    assert(data1.executor[0].read_time !== '');

  });
});

describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    finishTask()', function* () {
    const task = MockData.createTask[0];
    const data = yield ctx.getService('task').create(task);
    const p = {
      content: '已完成',
      _id: data._id,
      user: task.executor[0].user,
    };
    const _id = data._id;
    yield ctx.getService('task').finishTask(p);
    const data1 = yield ctx.getModel('task').findOne({ _id });
    assert(data1.executor[0].content === p.content);
    assert(data1.executor[0].status === 40);

  });
});


describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    creatorFinishTask()', function* () {
    const task = MockData.createTask[0];
    const data = yield ctx.getService('task').create(task);
    const p = {
      _id: data._id,
      user: task.creator,
    };
    yield ctx.getService('task').creatorFinishTask(p);
    const data1 = yield ctx.getModel('task').findOne({ _id: data._id });
    assert(data1.status === 40);

  });
});

describe('test/app/service/task.test.js', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'creater task test',
    });
  });
  it('[TaskService]    makeInvalid()', function* () {
    const task = MockData.createTask[3];
    const data = yield ctx.getService('task').create(task);
    const relatedId = task.extend.event_task.related.id;
    const taskType = task.task_type;
    yield ctx.getService('task').makeInvalid(relatedId, taskType);
    const data1 = yield ctx.getModel('task').findOne({ _id: data._id });
    assert(data1.status === 60);
  });
});
