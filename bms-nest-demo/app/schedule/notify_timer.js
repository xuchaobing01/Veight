'use strict';

const Util = require('../common/util');

module.exports = function() {
  const exports = {};

  // 定时启动，每5分钟启动一次
  exports.schedule = {
    cron: '00 */5 * * * *',
    // cron: '00 00 */5 * * *',
    type: 'worker',
  };

  // 扫描任务，找出待处理的
  exports.task = function* (ctx) {
    // 非执行节点，退出
    if (Util.isTimerNode(ctx) === false) { return; }

    const logger = ctx.logger;
    logger.info('!!! timer -- notify');

    const notifyExecService = ctx.getService('notifyExec');
    yield notifyExecService.scanTaskNotity();
  };

  return exports;
};
