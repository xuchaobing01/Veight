'use strict';

const User = require('../mock-data/user');
const { app, mock, assert } = require('egg-mock/bootstrap');
const request = require('supertest');

describe('/test/controller/statistics_user.test.js', () => {
  let { ctx, token } = {};
  before(function* () {
    ctx = app.mockContext();
    // 用户登陆并返回有效的token
    token = yield User.PLAT.admin(ctx);
    assert(token);
  });


  it('[Test] controller/statistics/user/index', function* () {
    const param = {
      token,
      choice: {
        // shop: { id: '59a65a1d43458a0a3574ee60' },
        user: { id: '59cda26ed4a5d2001f49437c' },
      },
    };
    return request(app.callback())
      .post('/statistics/user/index')
      .type('form')
      .send(param)
      .expect(200)
      .expect(function(res) {
        // 判断是否有结果返回
        const result = JSON.parse(res.text);
        console.log(JSON.stringify(result));
        assert(result);
      });
  });
});
