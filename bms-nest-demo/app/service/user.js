'use strict';

const { RoleScope, status, PROXY } = require('../common/const');
const { SpruceError, ErrorStatus } = require('../common/spruce_error');

module.exports = app => {
  const myutil = app.myutil;
  const { plat, shop } = app.proxy;

  class UserService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.log = this.ctx.logger;
    }

    _detailModel(user, fields) {
      const { _id, id, scope, from } = user;
      let klass = null;
      if (scope === RoleScope.plat || from === 'plat_user') {
        klass = plat.EmployeeDetail;
      } else if (scope === RoleScope.shop || from === 'shop_user') {
        klass = shop.EmployeeDetail;
      } else if (scope === RoleScope.bee || from === 'bee_user') {
        klass = plat.BeeDetail;
      } else {
        throw new SpruceError(ErrorStatus.unproxy, 'UserService detail NOPROXY', user);
      }

      if (!fields) {
        fields = { wechat: 1 };
      }
      return new klass({ _id: _id || id, fields });
    }

    * detail(user, fields) {
      this.log.info(' UserService detail handle %s::%s ', JSON.stringify(user), JSON.stringify(fields));
      const model = this._detailModel(user, fields);
      return yield this._process(model, 'detail');
    }

    _listModel(scope, params) {
      let klass = null;
      if (scope === RoleScope.plat) {
        klass = plat.EmployeeList;
      } else if (scope === RoleScope.shop) {
        klass = shop.EmployeeList;
      } else if (scope === RoleScope.bee) {
        klass = plat.BeeList;
      } else {
        throw new SpruceError(ErrorStatus.unproxy, 'UserService list NOPROXY', scope);
      }

      return new klass(params);
    }

    * list(scope, params) {
      this.log.info(' UserService list handle %s::%s ', scope, JSON.stringify(params));

      if (myutil.isEmpty(params.choice)) {
        params.choice = {};
      }
      if (!params.page) {
        params.page = PROXY.PAGE;
      }
      if (!params.size) {
        params.size = PROXY.SIZE;
      }
      const model = this._listModel(scope, params);
      const data = yield this._process(model, 'list');
      return data ? data.list : [];
    }

    * _process(model, method) {
      try {
        const ret = yield model.curl();
        if (ret.status === status.success) {
          return ret.data;
        }
        this.log.error(` UserService ${method} handle PROXY error ::%s `, JSON.stringify(ret));
      } catch (error) {
        this.log.error(` UserService ${method} handle PROXY error ::%s `, error);
      }
      return null;
    }

  }

  return UserService;
};
