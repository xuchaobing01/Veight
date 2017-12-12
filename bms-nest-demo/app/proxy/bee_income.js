'use strict';

module.exports = proxy => {
  class BeeIncome extends proxy.UserCenter {
    get module() { return 'bee'; }
    get name() { return 'BeeIncome'; }
    get path() { return '/inner-api/bee/income'; }
  }

  return BeeIncome;
};
