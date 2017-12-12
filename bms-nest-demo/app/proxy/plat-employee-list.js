'use strict';

module.exports = proxy => {
  class EmployeeList extends proxy.UserCenter {
    get module() { return 'plat'; }
    get name() { return 'EmployeeList'; }
    get path() { return '/inner-api/plat/employee/list'; }
  }

  return EmployeeList;
};
