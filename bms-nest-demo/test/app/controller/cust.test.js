'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');
const User = require('../mock-data/user');
const MockData = require('../mock-data/cust/cust');

describe('test/controllger/cust.test.js', () => {
  let ctx,
    token;

  before(function* () {
    ctx = app.mockContext();
    token = yield User.BEE(ctx);
  });

  describe('POST /cust/save', () => {

    it('should save successfully', () => {
      const req = MockData.CustInfo;
      req.token = token;
      return app.httpRequest()
        .post('/cust/save')
        .type('form')
        .send(req)
        .expect(200);

    });
  });
});
