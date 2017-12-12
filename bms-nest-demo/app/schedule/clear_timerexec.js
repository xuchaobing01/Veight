'use strict';

const Util = require('../common/util');

module.exports = function() {
  const exports = {};

  exports.schedule = {
    cron: '00 00 01 * * *',
    // cron: '00 */1 * * * *',
    type: 'worker',
  };

  exports.task = function* (ctx) {
    // 非执行节点，退出
    if (Util.isTimerNode(ctx) === false) {
      return;
    }

    const logger = ctx.logger;
    try {
      const diff = 30 * 24 * 60 * 60 * 1000;
      // const diff = 60 * 60 * 1000;

      const timerExecModel = ctx.getModel('timer_exec');
      const rt = yield timerExecModel.remove({
        timer_type: 'notify_timer',
        'time_rng.end': {
          $lt: Util.dateFormat(Date.now() - diff),
        },
      });
      logger.info('!!! timer -- clear timerexec ok:', rt.result);
    } catch (ex) {
      logger.error('!!! timer -- clear timerexec error:', ex);
    }
  };

  return exports;
};
