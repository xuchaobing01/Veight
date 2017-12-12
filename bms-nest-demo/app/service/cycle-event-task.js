'use strict';

const moment = require('moment');
const { SYS_USER, Max_Parallel, DATE_FORMAT, DATETIME_FORMAT,
  DAY_BEGIN_FORMAT, DAY_END_FORMAT } = require('../common/const');
const { STATUS, TRIGGER, detail } = require('../common/event-type');

module.exports = app => {
  const { mqPublisher, myutil } = app;

  /**
   * @author artsky
   * @description 周期规则任务
   * trigger: {
   *  rule: { type: String }, // 任务发布周期 now, delay
   *  cycle: { // 创建任务时间,每周几,每月几号
   *    cate: String, // hour, day, week, month
   *    value: Number,
   *  },
   *  start: { type: String }, // 任务开始时间 h:m:s, 空为当前时间
   *  end: { // 具体截止时间 start + end.value
   *    cate: String, // minute, hour, day
   *    value: Number,
   *  },
   * }
   */
  class CycleRuleTask extends app.Service {

    /**
     * @description 判断周期开始时间经过一个周期后是否大于等于结束时间
     *   begin: 2017-10-10 10:10:00, end: 2017-10-13 10:10:00, cycle: {cate: 'days', value: 2}
     *   if begin + cycle <= end  // 在发布周期内
     *      return true
     *   else
     *      return false
     * @param {String|Date} begin 周期开始
     * @param {String|Date} end 周期结束
     * @param {Object} cycle 周期
     *  cycle.cate 周期类别 hour, day, week, month
     *  cycle.value 周期时间
     * @return {Bool} if 在同一周期 true, else false
     */
    _isPublished(begin, end, cycle) {
      const { cate, value } = cycle || {};
      if (cate && value) {
        // isSameOrAfter(d, t) t support: year month week day hour minute second
        return moment(begin).add(value, cate).isSameOrBefore(end, 'minute');
      }
      return false;
    }

    /**
     * 获取发布任务开始时间
     * @param {Object} etask 事件任务
     * @return {Date} 开始时间
     */
    _getBiginTime(etask) {
      const { last_cycle_time, update_plan_time, create_time } = etask;
      if (last_cycle_time && update_plan_time) {
        if (moment(create_time).isBefore(update_plan_time)
          && moment(update_plan_time).isAfter(last_cycle_time)) {
          return update_plan_time;
        }
        return last_cycle_time;
      }

      return last_cycle_time || update_plan_time || create_time;
    }

    /**
     * @description 检查是否需要生成事件任务
     * @param {Object} etask 规则对象
     * @param {Boolean} resend 对于规则 rule_now 已发送过的任务是否重新发送
     * @return {Boolean} if 需要发布任务true, else false
     */
    isNeedPublish(etask, resend) {
      const { rule, cycle } = etask.rule.trigger;
      const begin_time = this._getBiginTime(etask);
      const now_time = moment();

      let need_publish = false;
      if (TRIGGER.rule_now === rule) {
        if (!etask.last_cycle_time || resend) {
          need_publish = true;
        } else if (etask.last_cycle_time && this._isPublished(begin_time, now_time, cycle)) {
          need_publish = true;
        }
      } else if (TRIGGER.rule_cycle === rule || TRIGGER.rule_delay === rule) {
        if (this._isPublished(begin_time, now_time, cycle)) {
          need_publish = true;
        }
      }

      return need_publish;
    }

    * _setCyclePublishedStatus(doc) {
      const model = this.ctx.getModel('event_task');
      const data = { status: STATUS.published, last_cycle_time: doc.last_cycle_time };
      return yield model.update({ _id: doc._id }, { $set: data });
    }

    /**
     * @description 创建并发布任务到MQ
     * @param {Object} eventTask 任务及任务规则详情
     */
    * _createPublisherEventTask(eventTask) {
      if (!eventTask) return;

      const { _id, rule, event_type, executor, related } = eventTask;
      const { start, end } = rule.trigger;
      let create_time = null;
      if (start) {
        create_time = moment().format(`${DATE_FORMAT} ${start}`);
      } else {
        create_time = moment().format(DATETIME_FORMAT);
      }

      let end_time = moment().add(end.value, end.cate);
      if (rule.trigger.end_time) {
        end_time = end_time.format(`${DATE_FORMAT} ${rule.trigger.end_time}`);
      } else {
        end_time = end_time.format(DATETIME_FORMAT);
      }

      const { task_type, content, reminder } = rule;
      const extend = rule.extend || {};
      extend.event_task = { event_type, related, _id: _id.toString() };
      const task = {
        creator: SYS_USER,
        executor: { user: executor },
        create_time, end_time,
        task_type, event_type,
        content, extend, reminder,
      };

      eventTask.last_cycle_time = new Date();
      yield myutil.parallel([
        mqPublisher.bmsRuleTask.publish(task),
        this._setCyclePublishedStatus(eventTask),
      ]);
    }

    /**
     * @description 创建并发布任务列表到MQ
     * @param {Array} eventTasks 要发布的任务列表
     * @param {Boolean} resend 对于规则 rule_now 已发送过的任务是否重新发送
     * @return {Array} 已发布的任务id
     */
    * _createPublish(eventTasks, resend) {
      const tasks = [];
      const task_ids = [];
      for (const etask of eventTasks) {
        const isNeed = this.isNeedPublish(etask, resend);
        if (!isNeed) {
          this.ctx.logger.info(' CycleEventTask createPublish task::%s not needpublish', etask._id);
          continue;
        }

        // parallel process
        tasks.push(this._createPublisherEventTask(etask));
        if (tasks.length >= Max_Parallel) {
          yield myutil.parallel(tasks);
          tasks.splice(0, tasks.length);
        }
        task_ids.push(etask._id);
      }

      if (tasks.length > 0) {
        yield myutil.parallel(tasks);
      }

      return task_ids;
    }

    /**
     * @description 创建并发布任务
     * @param {Array} eventTasks 需要生成并发布的事件任务列表
     */
    * createPublish(eventTasks) {
      const docJsonStr = JSON.stringify(eventTasks);
      this.ctx.logger.info(' CycleEventTask createPublish event-task::%s ', docJsonStr);
      yield this._createPublish(eventTasks, true);
    }

    /**
     * 1. 查找进行中的事件任务 status = 0
     * 2. 匹配事件任务生成规则(trigger 和 last_time)
     * 3. 生成并发送任务 并 更新发送状态
     */
    * create() {
      const eventTasks = yield this._getEventTasks();
      yield this._createPublish(eventTasks, false);
    }

    * _getEventTasks() {
      const lastBirth = moment().subtract(1, 'years');
      const query = {
        $and: [
          // 事件类型为同期事件、或者推迟事件，若需要支持立刻发送的周期事件 该条件可去掉
          { 'rule.trigger.rule': { $in: [ TRIGGER.rule_delay, TRIGGER.rule_cycle ] } },
          // 状态为初始化或者需要重新发布的任务
          { $or: [{ status: STATUS.init }, { status: STATUS.republish }] },
          {
            $or: [
              { event_type: { $ne: detail.cust_info_birthday } },
              { // 今天需要进行生日提醒的任务规则
                event_type: detail.cust_info_birthday,
                $and: [
                  { last_cycle_time: { $gte: lastBirth.format(DAY_BEGIN_FORMAT) } },
                  { last_cycle_time: { $lte: lastBirth.format(DAY_END_FORMAT) } },
                ],
              },
            ],
          }],
      };
      return yield this.ctx.getModel('event_task').find(query, '-cycle_logs', { lean: true });
    }
  }

  return CycleRuleTask;
};
