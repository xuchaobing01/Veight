'use strict';

module.exports = proxy => {
  class ShopIncome extends proxy.UserCenter {
    get module() { return 'shop'; }
    get name() { return 'ShopIncome'; }
    get path() { return '/inner-api/shop/income'; }
  }

  return ShopIncome;
};
