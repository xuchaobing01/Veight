'use strict';

const Util = require('../common/util');

module.exports = app => {
  const exports = {};

  const schedule = app.config.schedule || {};
  // 每个小时5分时执行
  exports.schedule = {
    cron: schedule.cycle_event_task || '0 5 */1 * * *',
    type: 'worker',
  };

  exports.task = function* (ctx) {
    // 执行节点
    if (Util.isTimerNode(ctx)) {
      ctx.logger.info(` cycle schedule event task || ${exports.schedule.cron} || starting ...`);
      yield ctx.service.cycleEventTask.create();
      ctx.logger.info(` cycle schedule event task || ${exports.schedule.cron} || end ...`);
    }
  };

  return exports;

};
