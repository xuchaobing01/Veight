'use strict';

const User = require('../mock-data/user');
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('app/controller/school.js', () => {
  let { ctx, token } = {};

  before(function* () {
    ctx = app.mockContext();
    // 设置用户并返回有效的token
    token = yield User.BEE(ctx);
    assert(token);
  });

  it('[Test] list', function* () {
    const param = {
      token,
      school: {
        city: '110000',
      },
    };

    return app.httpRequest()
      .post('/school/list')
      .type('form')
      .send(param)
      .expect(200)
      .expect(res => {
        // 判断是否有结果返回
        const result = JSON.parse(res.text);
        assert(result.data.list);
      });
  });
});
