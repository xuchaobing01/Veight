'use strict';

const User = require('../mock-data/user');
const { app, mock, assert } = require('egg-mock/bootstrap');
const request = require('supertest');

describe('test/controller/oss.js', () => {
  let { ctx, token } = {};
  before(function* () {
    ctx = app.mockContext();
    // 用户登陆并返回有效的token
    token = yield User.BEE(ctx);
    assert(token);
  });

  it('[TEST] signature', function* () {
    const param = {
      token,
      // path: 'company/',
    };

    return request(app.callback())
      .post('/oss/signature')
      .type('form')
      .send(param)
      .expect(200)
      .expect(function(res) {
        // 判断是否有结果返回
        const result = JSON.parse(res.text);
        assert(result);
      });
  });

  it('[TEST] delete', function* () {
    const param = {
      token,
      keys: '1.jpg', // 文件，多个文件用,隔开
    };

    return request(app.callback())
      .post('/oss/delete')
      .type('form')
      .send(param)
      .expect(200)
      .expect(function(res) {
        // 判断是否有结果返回
        const result = JSON.parse(res.text);
        assert(result);
      });
  });

});
