'use strict';
const Util = require('../common/util');
module.exports = {
  * initApp() {
    this.logger.info('[app]-----------Application  初始化！----------');
    // 设置系统环境
    this.isGateway = (this.config.gateway === true);
    if (this.isGateway) this.logger.info('[app]-----------Gateway  started----------');
    // 服务器信息
    this.serverInfo = {
      startTime: Util.now(),
      gateway: this.isGateway,
      env: this.env,
      name: this.name,
      baseDir: this.baseDir,
    };
  },
  /**
   * 根据name获取model
   *
   * @author Tim
   * @param {any} name model 名称
   * @return {object} model 对象
   */
  getModel(name) {
    const model = this.mongoose.models[name];
    return model;
  },
};
