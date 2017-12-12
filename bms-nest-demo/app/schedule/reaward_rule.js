'use strict';

const Util = require('../common/util');

module.exports = app => {
  const exports = {};
  const schedule = app.config.schedule || {};
  // 定时启动，每天凌晨1点启动一次
  exports.schedule = {
    cron: schedule.reaward_rule || '0 0 1 * * *',
    type: 'all',
    immediate: true,
  };

  exports.task = function* (ctx) {
    ctx.app.logger.info('[schedule]-----------ReawardRule  刷新成功！----------');
    ctx.app.reawardRule = yield ctx.getService('rewardRule').currentValidRuleMap();
  };

  return exports;
};
