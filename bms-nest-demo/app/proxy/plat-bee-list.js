'use strict';

module.exports = proxy => {
  class BeeList extends proxy.UserCenter {
    get module() { return 'plat'; }
    get name() { return 'BeeList'; }
    get path() { return '/inner-api/bee/list'; }
  }
  return BeeList;
};
