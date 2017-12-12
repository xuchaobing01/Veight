'use strict';

const Util = require('../common/util');

module.exports = app => {
  const exports = {};
  const schedule = app.config.schedule || {};
  // 默认每天 7 点执行一次
  exports.schedule = {
    cron: schedule.timer_rule_task || '0 0 7 * * *',
    type: 'worker',
  };

  exports.task = function* (ctx) {
    // 执行节点
    if (Util.isTimerNode(ctx)) {
      ctx.logger.info(` timer schedule rule task || ${exports.schedule.cron} || starting ...`);
      yield ctx.service.timerRuleTask.create();
      ctx.logger.info(` timer schedule rule task || ${exports.schedule.cron} || end ...`);
    }
  };

  return exports;

};
