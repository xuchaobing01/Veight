'use strict';

module.exports = proxy => {
  class EmployeeDetail extends proxy.UserCenter {
    get module() { return 'plat'; }
    get name() { return 'EmployeeDetail'; }
    get path() { return '/inner-api/plat/employee/detail'; }
  }

  return EmployeeDetail;
};
