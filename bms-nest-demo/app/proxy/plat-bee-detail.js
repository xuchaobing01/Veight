'use strict';

module.exports = proxy => {
  class BeeDetail extends proxy.UserCenter {
    get module() { return 'plat'; }
    get name() { return 'BeeDetail'; }
    get path() { return '/inner-api/bee/detail'; }
  }
  return BeeDetail;
};
