'use strict';

const User = require('../mock-data/user');
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/task.test.js', () => {
  let { ctx, token } = {};
  before(function* () {
    ctx = app.mockContext();
    // 用户登陆并返回有效的token
    token = yield User.BEE(ctx);
    assert(token);
  });

  it('[TEST] Spruce-rabbitmq config ', function* () {
    const serverConfig = app.config.rabbitmqServer;
    assert(serverConfig);
    assert(serverConfig.publisher);
    assert(serverConfig.publisher.name === 'mqPublisher');
    assert(serverConfig.publisher.dir);
    assert(serverConfig.consumer);
    assert(serverConfig.consumer.name === 'mqConsumer');
    assert(serverConfig.consumer.dir);
  });
  it('[TEST] Spruce-rabbitmq publisher bmsOrder', function* () {
    assert(app.mqPublisher.bmsOrder);
    const result = yield app.mqPublisher.bmsOrder.newCar('content');
    assert(result === true);
  });

});
