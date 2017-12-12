'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');
const MockData = require('../mock_data');

describe('test/mq/publisher/notify.test.js', () => {
  let { ctx } = {};
  beforeEach(() => {
    ctx = app.mockContext();
  });

  it('[TEST] Spruce-rabbitmq publisher ##notify_bee', function* () {
    assert(app.mqPublisher.notifyBee);

    const msg = MockData.NotifyMsgs[0];
    const result = yield app.mqPublisher.notifyBee.notify(msg);

    assert(result === true);
  });

});
