'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');
const MockData = require('../../mock-data/cust/cust');
const User = require('../../mock-data/user');

describe('### cust base function test', () => {
  let me,
    ctx;
  before(function* () {
    ctx = app.mockContext();
    const token = yield User.BEE(ctx);
    me = yield ctx.helper.getUser(token);
    assert(me);
    me = JSON.parse(me);
  });

  describe('### base info', () => {
    describe('[TEST] createCust', () => {
      it('should has {id, name, from, shop} in me', () => {
        assert(me._id);
        assert(me.info.name);
        assert(me.from);
        assert(me.shop);
      });

    });

    describe('[TEST] getCustList', () => {

    });

    describe('[TEST] deleteCustById', () => {

    });

    describe('[TEST] updateCust', () => {

    });

    describe('[TEST] getCustDetail', () => {

    });
  });

  describe('[TEST] car plan', () => {

  });

  describe('[TEST] own car', () => {

  });

  describe('[TEST] relate customer', () => {
    describe('[TEST] syncCustInfo', () => {

    });
  });

  describe('[TEST] time line', () => {

  });

});

