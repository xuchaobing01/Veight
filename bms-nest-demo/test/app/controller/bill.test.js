'use strict';

const User = require('../mock-data/user');
const { app, mock, assert } = require('egg-mock/bootstrap');
const request = require('supertest');

describe('/test/controller/bill.test.js', () => {
  let { ctx, token } = {};
  before(function* () {
    ctx = app.mockContext();
    // 用户登陆并返回有效的token
    token = yield User.BEE(ctx);
    assert(token);
  });


  it('[Test] controller/bill/list', function* () {
    const param = {
      token,
      page: 1,
      size: 1,
      choice: {
        shop: { id: '59a65a1d43458a0a3574ee60' },
      },
    };
    return request(app.callback())
      .post('/reward/bill/list')
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

  it('[Test] controller/bill/cancel', function* () {
    const param = {
      token,
      _id: '59eabec6edffa140204f92ba',
    };
    return request(app.callback())
      .post('/reward/bill/cancel')
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

  it('[Test] controller/bill/detail', function* () {
    const param = {
      token,
      _id: '59eabec6edffa140204f92ba',
    };
    return request(app.callback())
      .post('/reward/bill/detail')
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
