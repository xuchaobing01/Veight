'use strict';

const User = require('../mock-data/user');
const { app, mock, assert } = require('egg-mock/bootstrap');
const MockData = require('../mock-data/rule');
describe('/test/controller/reward/rule.test.js', () => {
  let { ctx, token, mockRule } = {};

  beforeEach(function* () {
    ctx = app.mockContext();
    // 设置用户并返回有效的token
    token = yield User.PLAT.admin(ctx);
    mockRule = MockData.updateRule[0];
  });

  describe('/rule/update', () => {
    beforeEach(() => {
      app.mockService('rewardRule', 'update', function* (rules) {
        rules = mockRule;
        return rules;
      });
    });

    it('success', function* () {
      const expected = { status: 0, data: mockRule };
      const param = mockRule;
      param.token = token;
      const result = yield app.httpRequest()
        .post('/reward/rule/update')
        .send(param)
        .expect(200);

      assert(result.text);
      assert.deepEqual(JSON.parse(result.text), expected);
    });
  });

  describe('/rule/shopRules', () => {
    beforeEach(() => {
      app.mockService('rewardRule', 'shopRules', function* (rules) {
        rules = [ mockRule ];
        return rules;
      });
    });

    it('success', function* () {
      const expected = { status: 0, data: mockRule };
      const param = { shop_id: mockRule.shop.id, token };
      param.token = token;
      const result = yield app.httpRequest()
        .post('/reward/rule/shopRules')
        .send(param)
        .expect(200);

      assert(result.text);
      assert.deepEqual(JSON.parse(result.text), expected);
    });
  });

  describe('/rule/historyRules', () => {
    beforeEach(() => {
      app.mockService('rewardRule', 'historyRules', function* (rules) {
        rules = { list: [ mockRule ], total: 1 };
        return rules;
      });
    });

    it('success', function* () {
      const expected = { status: 0, data: { list: [ mockRule ], total: 1 } };
      const param = { shop: mockRule.shop, token };
      const result = yield app.httpRequest()
        .post('/reward/rule/historyRules')
        .send(param)
        .expect(200);

      assert(result.text);
      assert.deepEqual(JSON.parse(result.text), expected);
    });
  });

  describe('/rule/latestRule', () => {
    beforeEach(() => {
      app.mockService('rewardRule', 'latestRule', function* (rules) {
        rules = mockRule;
        return rules;
      });
    });

    it('success', function* () {
      const expected = { status: 0, data: mockRule };
      const param = { shop_id: mockRule.shop.id, token };
      const result = yield app.httpRequest()
        .post('/reward/rule/latestRule')
        .send(param)
        .expect(200);

      assert(result.text);
      assert.deepEqual(JSON.parse(result.text), expected);
    });
  });

  describe('/rule/detail', () => {
    beforeEach(() => {
      app.mockService('rewardRule', 'detail', function* (rules) {
        rules = mockRule;
        return rules;
      });
    });

    it('success', function* () {
      const expected = { status: 0, data: mockRule };
      const param = { _id: mockRule._id, token };
      const result = yield app.httpRequest()
        .post('/reward/rule/detail')
        .send(param)
        .expect(200);

      assert(result.text);
      assert.deepEqual(JSON.parse(result.text), expected);
    });
  });
});
