'use strict';

const { ErrorStatus } = require('../common/spruce_error');

module.exports = () => {
  return function* (next) {
    const token = this.request.token;// extend/request.js 扩展
    // this.app.logger.debug('认证 token :' + token);
    const user = yield this.helper.getUser(token);
    if (!user) {
      this.body = ErrorStatus.notLoginError;
      this.body.errorDetail = 'Me认证失败！';
      this.app.logger.debug('Me认证失败！ token：' + token);
      return;
    }
    // 用户认证
    this.me = JSON.parse(user);
    this.app.logger.debug('Me认证通过！ 登录名：' + this.me.username);
    yield next;

  };
};
