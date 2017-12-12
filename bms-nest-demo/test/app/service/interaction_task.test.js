'use strict';

const assert = require('assert');
const mock = require('egg-mock');
const MockData = require('../mock_interaction_task.data');


describe('[interactionTask]    _buyCarInvitation()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });
  it('[interactionTask]    _buyCarInvitation()', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {};
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._buyCarInvitation(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超已邀请客户进店看车，但未成功';
    });
    assert(limeLine === true);
  });


  it('[interactionTask]    _buyCarInvitation()', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._buyCarInvitation(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超邀请客户进店看车.购车。';
    });
    assert(limeLine === true);
  });

  // it('[interactionTask]    _buyCarInvitation()', function* () {
  //   const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
  //   const interactionOrtask = {
  //     is_entry: true,
  //     is_order: true,
  //     expert: {
  //       id: '59cb56e3640a45002085309c',
  //       name: 'leiyin1111',
  //       from: 'shop_user',
  //     },
  //   };
  //   const user = {
  //     id: '59cc85247be73c002a1400d8',
  //     name: '史子超',
  //     from: 'bee_user',
  //   };
  //   yield ctx.getService('interactionTask')._buyCarInvitation(task, interactionOrtask, user);
  //   const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
  //   const limeLine = cust.time_line.some(ele => {
  //     return ele.abstract === `${user.name}已邀请了客户进店看车.购车,已选销售专家${interactionOrtask.expert.name}。`;
  //   });
  //   assert(limeLine === true);
  // });


});

describe('[interactionTask]    _buyCarInvitation()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]   _buyInStoreTask', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._buyInStoreTask(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `销售专家${user.name}已预约客户进店看车.购车,但未成功`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]   _buyInStoreTask', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
      entry_time: '2017-11-11 10:10:10',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._buyInStoreTask(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `销售专家${user.name}已预约客户进店看车.购车,进店时间为2017-11-11`;
    });
    assert(limeLine === true);
  });
});

describe('[interactionTask]   _buyCarPlan()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]    _buyCarPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      car_plan: {
        brand_type: 1,
        buy_date_type: 0,
        budget_type: 1,
        car_type: 1,
        use_to: 1,
        transfer_cars: [],
        is_transfer: 0,
        prefer_side: [
          3,
        ],
        prefer_cars: [],
      },
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._buyCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了购车计划,并更新了购车计划。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _buyCarPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      car_plan: {

      },
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._buyCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了购车计划,购车计划未变。`;
    });
    assert(limeLine === true);
  });
});

describe('[interactionTask]   _substitution()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]    _substitution', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {};
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._substitution(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}已成功邀请客户进店评估.置换cc,但未成功。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _substitution', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      kilometer: '200',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._substitution(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超已成功邀请客户进店评估.置换cc,但未成功。\n        车辆已行驶里程：200公里';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _substitution', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._substitution(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}已成功邀请客户进店评估.置换cc。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _substitution', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
      kilometer: '200',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._substitution(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超已成功邀请客户进店评估.置换cc\n        车辆已行驶里程：200公里';
    });
    assert(limeLine === true);
  });

  // it('[interactionTask]    _substitution', function* () {
  //   const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
  //   const car_type = task.extend.old_car[0].name;
  //   const interactionOrtask = {
  //     is_entry: true,
  //     is_order: true,
  //     expert: {
  //       id: '59cb56e3640a45002085309c',
  //       name: 'leiyin',
  //       from: 'shop_user',
  //     },
  //   };
  //   const user = {
  //     id: '59cc85247be73c002a1400d8',
  //     name: '史子超',
  //     from: 'bee_user',
  //   };
  //   yield ctx.getService('interactionTask')._substitution(task, interactionOrtask, user);
  //   const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
  //   const limeLine = cust.time_line.some(ele => {
  //     return ele.abstract === `${user.name}已成功邀请客户进店评估.置换${car_type},已选销售专家${interactionOrtask.expert.name}。`;
  //   });
  //   assert(limeLine === true);
  // });

  // it('[interactionTask]    _substitution', function* () {
  //   const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
  //   const interactionOrtask = {
  //     is_entry: true,
  //     is_order: true,
  //     expert: {
  //       id: '59cb56e3640a45002085309c',
  //       name: 'leiyin',
  //       from: 'shop_user',
  //     },
  //     kilometer: '200',
  //   };
  //   const user = {
  //     id: '59cc85247be73c002a1400d8',
  //     name: '史子超',
  //     from: 'bee_user',
  //   };
  //   yield ctx.getService('interactionTask')._substitution(task, interactionOrtask, user);
  //   const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
  //   const limeLine = cust.time_line.some(ele => {
  //     return ele.abstract === '史子超已成功邀请客户进店评估.置换cc,已选销售专家leiyin。\n        已行驶里程：200公里';
  //   });
  //   assert(limeLine === true);
  // });

});


describe('[interactionTask]   _inStoreTask()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]    _inStoreTask', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {};
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._inStoreTask(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `销售专家${user.name}已预约客户进店评估.置换cc,但未成功`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _inStoreTask', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
      entry_time: '2017-11-11 10:10:10',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._inStoreTask(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `销售专家${user.name}已预约客户进店评估.置换cc,进店时间为2017-11-11`;
    });
    assert(limeLine === true);
  });
});

describe('[interactionTask]   _replacePlan()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]    _replacePlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      car_plan: {
        brand_type: 1,
        buy_date_type: 0,
        budget_type: 1,
        car_type: 1,
        use_to: 1,
        transfer_cars: [],
        is_transfer: 0,
        prefer_side: [
          3,
        ],
        prefer_cars: [],
      },
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._replacePlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了置换计划,并更新了购车计划。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _replacePlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      car_plan: {},
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._replacePlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了置换计划,置换计划未变。`;
    });
    assert(limeLine === true);
  });
});


describe('[interactionTask]   _invitationPlan()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]    _invitationPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._invitationPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}已成功邀请客户进店评估.出手cc,但未成功。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _invitationPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      kilometer: '200',

    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._invitationPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超已邀请客户进店评估.出手cc,但未成功。\n        车辆已行驶里程：200公里';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _invitationPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._invitationPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}已成功邀请客户进店评估.出手cc。`;
    });
    assert(limeLine === true);
  });


  it('[interactionTask]    _invitationPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
      kilometer: '200',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._invitationPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超已成功邀请客户进店评估.出手cc。\n        车辆已行驶里程：200公里';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _invitationPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
      is_order: true,
      expert: {
        id: '59cb56e3640a45002085309c',
        name: 'leiyin',
        from: 'shop_user',
      },
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._invitationPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}已成功邀请客户进店评估.出手cc,已选销售专家:${interactionOrtask.expert.name}。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _invitationPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
      is_order: true,
      expert: {
        id: '59cb56e3640a45002085309c',
        name: 'leiyin',
        from: 'shop_user',
      },
      kilometer: '200',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._invitationPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超已成功邀请客户进店评估.出手cc,已选销售专家:leiyin。\n        车辆已行驶里程：200公里';
    });
    assert(limeLine === true);
  });
});


describe('[interactionTask]   _sellCarTask()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]    _sellCarTask', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._sellCarTask(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `销售专家${user.name}已预约客户进店评估.出售cc,但未成功`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _sellCarTask', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
      entry_time: '2017-11-11 10:10:10',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._sellCarTask(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `销售专家${user.name}已预约客户进店评估.出售cc,进店时间为2017-11-11`;
    });
    assert(limeLine === true);
  });


});

describe('[interactionTask]   _likeUpSellCarPlan()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]    _likeUpSellCarPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpSellCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了cc使用情况和出手计划,计划出手时间未变。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpSellCarPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
      kilometer: '200',

    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpSellCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超和客户聊了cc使用情况和出手计划,计划出手时间未变。\n          车辆已行驶里程：200';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpSellCarPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 2,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpSellCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了cc使用情况和出手计划,并跟新了计划出手时间。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpSellCarPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 3,
      kilometer: '200',

    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpSellCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超和客户聊了cc使用情况和出手计划,并跟新了计划出手时间。\n          车辆已行驶里程：200';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpSellCarPlan ', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 3,
      is_maintain: true,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpSellCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超和客户聊了cc使用情况和出手计划,并更新了计划出手时间。客户预计一周内进店维修保养。';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpSellCarPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
      kilometer: '200',
      is_maintain: true,
      expert: {
        id: '59cb56e3640a45002085309c',
        name: 'leiyin',
        from: 'shop_user',
      },

    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpSellCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超和客户聊了cc使用情况和出手计划,计划出手时间未变。客户预计一周内进店维修保养。\n          车辆已行驶里程：200';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpSellCarPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
      is_maintain: true,
      is_order: true,
      expert: {
        id: '59cb56e3640a45002085309c',
        name: 'leiyin',
        from: 'shop_user',
      },

    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpSellCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了cc使用情况和出手计划,计划出手时间未变。客户预计一周内进店维修保养,已选服务专家${interactionOrtask.expert.name}`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpSellCarPlan', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 2,
      is_maintain: true,
      is_order: true,
      expert: {
        id: '59cb56e3640a45002085309c',
        name: 'leiyin',
        from: 'shop_user',
      },

    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpSellCarPlan(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超和客户聊了cc使用情况和出手计划,并更新了计划出手时间。客户预计一周内进店维修保养,已选服务专家leiyin';
    });
    assert(limeLine === true);
  });


});


describe('[interactionTask]   _likeUpUsage()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]    _likeUpUsage', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpUsage(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了cc使用情况和出手计划。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpUsage', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
      kilometer: '200',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpUsage(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超和客户聊了cc使用情况和出手计划。\n          车辆已行驶里程：200';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpUsage', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 2,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpUsage(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了cc使用情况和出手计划，并添加了计划出手时间`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpUsage ', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
      kilometer: '200',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpUsage(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超和客户聊了cc使用情况和出手计划，并添加了计划出手时间';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpUsage', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
      is_maintain: true,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpUsage(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了cc使用情况和出手计划。客户预计一周内进店维修保养。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpUsage', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 2,
      is_maintain: true,
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpUsage(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `${user.name}和客户聊了cc使用情况和出手计划,并添加了计划出手时间。客户预计一周内进店维修保养。`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpUsage ', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
      is_maintain: true,
      is_order: true,
      expert: {
        id: '59cb56e3640a45002085309c',
        name: 'leiyin',
        from: 'shop_user',
      },
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpUsage(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超和客户聊了cc使用情况和出手计划,客户预计一周内进店维修保养,已选服务专家leiyin.';
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _likeUpUsage', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      sold_time: 1,
      is_maintain: true,
      is_order: true,
      expert: {
        id: '59cb56e3640a45002085309c',
        name: 'leiyin',
        from: 'shop_user',
      },
      kilometer: '200',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._likeUpUsage(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '史子超和客户聊了cc使用情况和出手计划,客户预计一周内进店维修保养,已选服务专家leiyin.\n          车辆已行驶里程：200';
    });
    assert(limeLine === true);
  });

});


describe('[interactionTask]   _orderMaintain()', () => {
  let {
    app,
    ctx,
  } = {};

  before(function* () {
    app = mock.app();
    yield app.ready();
    ctx = app.mockContext();
    const task = MockData.newTask[0];
    const cust = MockData.cust;
    yield ctx.getModel('task').create(task);
    yield ctx.getModel('cust').create(cust);
  });

  after(function* () {
    yield ctx.getModel('task').remove({
      content: 'interaction_task',
    });
    yield ctx.getModel('cust').remove({
      _id: '59f1a688e4e8e0591ae2fd88',
    });
  });

  it('[interactionTask]    _orderMaintain', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {

    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._orderMaintain(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === `服务专家${user.name}已预约客户进店维修保养cc，但未成功`;
    });
    assert(limeLine === true);
  });

  it('[interactionTask]    _orderMaintain', function* () {
    const task = yield ctx.getModel('task').findOne({ _id: '59cc85247be73c002a1400d8' });
    const interactionOrtask = {
      is_entry: true,
      entry_time: '2017-11-11 10:10:10',
    };
    const user = {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    };
    yield ctx.getService('interactionTask')._orderMaintain(task, interactionOrtask, user);
    const cust = yield ctx.getModel('cust').findOne({ _id: '59f1a688e4e8e0591ae2fd88' });
    const limeLine = cust.time_line.some(ele => {
      return ele.abstract === '服务专家史子超已预约客户进店维修保养cc，进店时间为2017-11-11';
    });
    assert(limeLine === true);
  });

});

