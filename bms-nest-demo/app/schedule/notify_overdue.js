'use strict';

const Util = require('../common/util');

module.exports = function() {
  const exports = {};

  // 定时启动，每天9:30
  exports.schedule = {
    cron: '00 30 9 * * *',
    // cron: '00 */1 * * * *',
    type: 'worker',
  };

  // 扫描任务，找出待处理的
  exports.task = function* (ctx) {
    // 非执行节点，退出
    if (Util.isTimerNode(ctx) === false) { return; }

    const logger = ctx.logger;
    logger.info('!!! timer -- later overdue');

    const notifyService = ctx.getService('notify');
    yield notifyService.scanLaterOverdueTaskNotity();
  };

  return exports;
};
