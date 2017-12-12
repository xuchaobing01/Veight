'use strict';

module.exports = proxy => {
  class RoleList extends proxy.UserCenter {
    get module() { return 'user'; }
    get name() { return 'RoleList'; }
    get path() { return '/inner-api/plat/role/list'; }
  }

  return RoleList;
};
