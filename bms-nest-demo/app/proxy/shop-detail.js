'use strict';

module.exports = proxy => {
  class ShopDetail extends proxy.UserCenter {
    get module() { return 'shop'; }
    get name() { return 'ShopDetail'; }
    get path() { return '/inner-api/shop/detail'; }
  }

  return ShopDetail;
};
