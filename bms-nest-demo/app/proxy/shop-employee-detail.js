'use strict';

module.exports = proxy => {
  class EmployeeDetail extends proxy.UserCenter {
    get module() { return 'shop'; }
    get name() { return 'EmployeeDetail'; }
    get path() { return '/inner-api/shop/employee/detail'; }
  }
  return EmployeeDetail;
};
