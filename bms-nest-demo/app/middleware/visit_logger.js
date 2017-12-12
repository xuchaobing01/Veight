'use strict';

// const Const = require('../common/const');
const Util = require('../common/util');
module.exports = () => {
  return function* (next) {
    // const token = this.request.token;// extend/request.js 扩展
    const data = this.request.body;
    const logInfo = {
      // user_id : this.me.employee_id,
      ip: this.ip,
      user: {
        id: this.userId,
        name: this.userName,
      },
      date: Util.now(),
      path: this.url,
      content: data,
    };
    this.app.getLogger('visitLogger').info(JSON.stringify(logInfo));

    yield next;

  };
};
