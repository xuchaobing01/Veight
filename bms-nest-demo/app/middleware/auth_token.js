'use strict';

const { ErrorStatus } = require('../common/spruce_error');
const Util = require('../common/util');
// token 有效性认证
module.exports = () => {
  return function* (next) {
    // 服务器信息
    if (this.url === (this.getConfig('serverInfoPath') ? this.getConfig('serverInfoPath') : '/serverInfo')) {
      this.body = {
        status: true,
        systemTime: Util.now(),
        serverInfo: this.app.serverInfo,
      };
      return;
    }
    // 对于本中间件不需要处理的请求就放行
    if (this.app.config.middlewareExtend) {
      const urlClearance = this.app.config.middlewareExtend.urlClearance;
      const path = this.request.path;
      const pass = urlClearance.some(function(url) {
        return path === url;
      });
      if (pass) return yield next;
    }
    const token = this.request.token;// extend/request.js 扩展
    const jtoken = this.helper.authToken(token);
    if (!jtoken) {
      this.body = ErrorStatus.notLoginError;
      this.body.errorDetail = 'Token认证失败！';
      this.app.logger.debug('Token认证失败！ token：' + token);
      return;
    }
    if (this.app.isGateway) {
      // 刷新缓存
      this.helper.flushUserCache(token);
    }
    this.userName = jtoken.username;
    this.userId = jtoken._id;
    yield next;

  };
};
