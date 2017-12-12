'use strict';

const moment = require('moment');

module.exports = app => {
  const ctx = app.createAnonymousContext();
  const logger = app.logger;
  const DF = 'YYYY-MM-DD HH:mm:ss';
  class BmsRuleTask {

    * create(msg) {
      const { fields, content } = msg;
      logger.info(' BmsRuleTask handle %s::%s ', fields.routingKey, content.toString());

      const task = JSON.parse(content);
      const { executor, reminder, end_time } = task;
      reminder.alert_time = moment(end_time).subtract(reminder.time_diff, 'second').format(DF);

      // yield this._setExecutorLeader(executor);
      if (!executor.leader) {
        const detail = yield ctx.service.user.detail(executor.user, null);
        if (detail && detail.leader) {
          detail.leader.id = detail.leader.id || detail.leader._id;
          executor.leader = detail.leader;
        }
      }
      task.executor = [ executor ];
      const ret = yield ctx.service.task.create(task);
      logger.info(' BmsRuleTask handle create task::%s ', ret._id);

      return true;
    }

    // * _setExecutorLeader(executor) {
    //   if (executor.leader) {
    //     return;
    //   }

    //   const detail = yield ctx.service.user.detail(executor.user);
    //   if (detail) {
    //     executor.leader = detail.leader;
    //   }
    // }
  }

  return new BmsRuleTask();
};
