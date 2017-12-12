'use strict';

const User = require('../mock-data/user');
const { app, mock, assert } = require('egg-mock/bootstrap');
const request = require('supertest');

describe('app/controller/region.js', () => {
  let { ctx, token } = {};
  before(function* () {
    ctx = app.mockContext();
    // 用户登陆并返回有效的token
    token = yield User.BEE(ctx);
    assert(token);
  });

  it('[Test] list', function* () {
    console.log(token);
    const param = {
      token,
    };
    return request(app.callback())
      .post('/region/list')
      .type('form')
      .send(param)
      .expect(200)
      .expect(function(res) {
        // 判断是否有结果返回
        const result = JSON.parse(res.text);
        assert(result);
      });
  });

  it('[Test] getCity', function* () {
    const param = {
      token,
      code: '130000',
    };
    return request(app.callback())
      .post('/region/getCity')
      .type('form')
      .send(param)
      .expect(200)
      .expect(function(res) {
        // 判断是否有结果返回
        const result = JSON.parse(res.text);
        assert(result.data.list);
      });
  });

  it('[Test] getArea', function* () {
    const param = {
      token,
      code: '110100',
    };
    return request(app.callback())
      .post('/region/getArea')
      .type('form')
      .send(param)
      .expect(200)
      .expect(function(res) {
        // 判断是否有结果返回
        const result = JSON.parse(res.text);
        assert(result.data.list);
      });
  });
});
