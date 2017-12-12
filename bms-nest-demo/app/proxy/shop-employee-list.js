'use strict';

module.exports = proxy => {
  class EmployeeList extends proxy.UserCenter {
    get module() { return 'shop'; }
    get name() { return 'EmployeeList'; }
    get path() { return '/inner-api/shop/employee/list'; }
  }
  return EmployeeList;
};
