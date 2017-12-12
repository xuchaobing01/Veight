'use strict';

const { app, assert, mock } = require('egg-mock/bootstrap');
const { RoleScope } = require('../../../app/common/const');
const { SpruceError, ErrorStatus } = require('../../../app/common/spruce_error');

describe('test/app/service/user.test.js', () => {
  let { shop, plat, userService } = {};
  before(() => {
    const ctx = app.mockContext();
    userService = ctx.service.user;
    shop = app.proxy.shop;
    plat = app.proxy.plat;
  });

  describe('[ TEST UserService _detailModel ]', () => {
    const wechatField = { wechat: 1 };
    it('bee proxy', () => {
      let user = { id: '597934de58dd1b3c3dd070dc', name: 'bee', from: 'bee_user' };
      const exceptedParams = { _id: user.id, fields: wechatField };
      let model = userService._detailModel(user, wechatField);
      assert(model);
      assert(model instanceof plat.BeeDetail);
      assert.deepEqual(model.params, exceptedParams);

      user = { id: '597934de58dd1b3c3dd070dc', name: 'bee', scope: 'bee' };
      model = userService._detailModel(user, wechatField);
      assert(model);
      assert(model instanceof plat.BeeDetail);
      assert.deepEqual(model.params, exceptedParams);

      user = { id: '597934de58dd1b3c3dd070dc', name: 'bee', from: 'bee_user1' };
      try {
        model = userService._detailModel(user, wechatField);
        assert.fail(model);
      } catch (error) {
        assert(error instanceof SpruceError);
      }
    });

    it('plat proxy', () => {
      let user = { id: '5993b62558dd1b3c3dd070fa', name: 'plat', from: 'plat_user' };
      const exceptedParams = { _id: user.id, fields: wechatField };
      let model = userService._detailModel(user, wechatField);
      assert(model);
      assert(model instanceof plat.EmployeeDetail);
      assert.deepEqual(model.params, exceptedParams);

      user = { id: '5993b62558dd1b3c3dd070fa', name: 'plat', scope: 'plat' };
      model = userService._detailModel(user, wechatField);
      assert(model);
      assert(model instanceof plat.EmployeeDetail);
      assert.deepEqual(model.params, exceptedParams);

      user = { id: '5993b62558dd1b3c3dd070fa', name: 'plat', from: 'plat_user1' };
      try {
        model = userService._detailModel(user, wechatField);
        assert.fail(model);
      } catch (error) {
        assert(error instanceof SpruceError);
      }
    });

    it('shop proxy', () => {
      let user = { id: '59793c7958dd1b3c3dd070dd', name: 'shop_ab2', from: 'shop_user' };
      const exceptedParams = { _id: user.id, fields: wechatField };
      let model = userService._detailModel(user, wechatField);
      assert(model);
      assert(model instanceof shop.EmployeeDetail);
      assert.deepEqual(model.params, exceptedParams);

      user = { id: '59793c7958dd1b3c3dd070dd', name: 'shop_ab2', scope: 'shop' };
      model = userService._detailModel(user, wechatField);
      assert(model);
      assert(model instanceof shop.EmployeeDetail);
      assert.deepEqual(model.params, exceptedParams);

      user = { id: '59793c7958dd1b3c3dd070dd', name: 'shop_ab2', from: 'shop_user2' };
      try {
        model = userService._detailModel(user, wechatField);
        assert.fail(model);
      } catch (error) {
        assert(error instanceof SpruceError);
      }
    });
  });

  describe('[ TEST UserService detail ]', () => {
    const wechatField = { wechat: 1 };
    let exceptedStatus = 0;
    beforeEach(() => {
      exceptedStatus = 0;
      mock(userService, '_detailModel', (user, fields) => {
        let object = null;
        if (user.scope === RoleScope.plat || user.from === 'plat_user') {
          object = new plat.EmployeeDetail({ _id: user._id, fields });
        } else if (user.scope === RoleScope.shop || user.from === 'shop_user') {
          object = new shop.EmployeeDetail({ _id: user._id, fields });
        } else if (user.scope === RoleScope.bee || user.from === 'bee_user') {
          object = new plat.BeeDetail({ _id: user._id, fields });
        } else {
          throw new SpruceError(ErrorStatus.unproxy, 'UserService detail NOPROXY', user);
        }

        mock(object, 'curl', function* () {
          const data = Object.assign({ _id: user.id, wechat: {} }, user);
          data.wechat.open_id = `${user.name}_${user.id}`;
          const result = {
            status: exceptedStatus,
            data,
          };
          return result;
        });

        return object;
      });
    });

    it('bee user detail', function* () {
      const user = { id: '597934de58dd1b3c3dd070dc', name: 'bee', from: 'bee_user' };
      let actual = yield userService.detail(user, wechatField);

      const add_detail = { wechat: { open_id: `${user.name}_${user.id}` }, _id: user.id };
      const excepted = {
        status: exceptedStatus,
        data: Object.assign(add_detail, user),
      };
      assert(actual);
      assert.deepEqual(actual, excepted.data);

      exceptedStatus = 1;
      actual = yield userService.detail(user, wechatField);
      assert(actual === null);
    });

    it('plat user detail', function* () {
      const user = { id: '5993b62558dd1b3c3dd070fa', name: 'bee', from: 'plat_user' };
      let actual = yield userService.detail(user, wechatField);

      const add_detail = { wechat: { open_id: `${user.name}_${user.id}` }, _id: user.id };
      const excepted = {
        status: exceptedStatus,
        data: Object.assign(add_detail, user),
      };
      assert(actual);
      assert.deepEqual(actual, excepted.data);

      exceptedStatus = 1;
      actual = yield userService.detail(user, wechatField);
      assert(actual === null);
    });

    it('shop user detail', function* () {
      const user = { id: '59793c7958dd1b3c3dd070dd', name: 'shop_ab2', from: 'shop_user' };
      let actual = yield userService.detail(user, wechatField);

      const add_detail = { wechat: { open_id: `${user.name}_${user.id}` }, _id: user.id };
      const excepted = {
        status: exceptedStatus,
        data: Object.assign(add_detail, user),
      };
      assert(actual);
      assert.deepEqual(actual, excepted.data);

      exceptedStatus = 1;
      actual = yield userService.detail(user, wechatField);
      assert(actual === null);
    });

  });

  describe('[ TEST UserService _listModel ]', () => {
    it('bee proxy', () => {
      const scope = RoleScope.bee;
      const exceptedParams = { page: 1, size: 100, choice: { roles: 'bee_test_role' } };
      const model = userService._listModel(scope, exceptedParams);
      assert(model);
      assert(model instanceof plat.BeeList);
      assert.deepEqual(model.params, exceptedParams);
    });

    it('plat proxy', () => {
      const scope = RoleScope.plat;
      const exceptedParams = { page: 1, size: 100, choice: { roles: 'bee_test_role' } };
      const model = userService._listModel(scope, exceptedParams);
      assert(model);
      assert(model instanceof plat.EmployeeList);
      assert.deepEqual(model.params, exceptedParams);

    });

    it('shop proxy', () => {
      const scope = RoleScope.shop;
      const exceptedParams = { page: 1, size: 100, choice: { roles: 'bee_test_role' } };
      const model = userService._listModel(scope, exceptedParams);
      assert(model);
      assert(model instanceof shop.EmployeeList);
      assert.deepEqual(model.params, exceptedParams);
    });

    it('Invalid proxy', () => {
      const scope = 'errScope';
      try {
        const model = userService._listModel(scope, {});
        assert.fail(model);
      } catch (error) {
        assert(error instanceof SpruceError);
      }
    });

  });

  describe('[ TEST UserService list ]', () => {
    let exceptedStatus = 0;
    beforeEach(() => {
      exceptedStatus = 0;
      mock(userService, '_listModel', (scope, params) => {
        let object = null;
        if (scope === RoleScope.plat) {
          object = new plat.EmployeeDetail(params);
        } else if (scope === RoleScope.shop) {
          object = new shop.EmployeeDetail(params);
        } else if (scope === RoleScope.bee) {
          object = new plat.BeeDetail(params);
        } else {
          throw new SpruceError(ErrorStatus.unproxy, 'UserService detail NOPROXY', scope);
        }

        mock(object, 'curl', function* () {
          const data = { list: [] };
          if (params.choice.roles) {
            data.list = [ `${scope}_test_role1`, `${scope}_test_role2` ];
          }
          return { status: exceptedStatus, data };
        });

        return object;
      });
    });

    it('bee user list', function* () {
      const scope = RoleScope.bee;
      const excepted = [ `${scope}_test_role1`, `${scope}_test_role2` ];
      const actual = yield userService.list(scope, { choice: { roles: 'bee_role' } });
      assert(actual);
      assert.deepEqual(actual, excepted);
    });

    it('plat user list', function* () {
      const scope = RoleScope.plat;
      const excepted = [ `${scope}_test_role1`, `${scope}_test_role2` ];
      const actual = yield userService.list(scope, { choice: { roles: 'plat_role' } });
      assert(actual);
      assert.deepEqual(actual, excepted);
    });

    it('shop user list', function* () {
      const scope = RoleScope.shop;
      const excepted = [ `${scope}_test_role1`, `${scope}_test_role2` ];
      const actual = yield userService.list(scope, { choice: { roles: 'shop_role' } });
      assert(actual);
      assert.deepEqual(actual, excepted);
    });

    it('empty params', function* () {
      const scope = RoleScope.shop;
      const excepted = [];
      const actual = yield userService.list(scope, { choice: {} });
      assert(actual);
      assert.deepEqual(actual, excepted);
    });

  });


});
