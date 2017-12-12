'use strict';

const moment = require('moment');
const { TimeTaskPeriod, RoleScope, TaskCategory, SYS_USER,
  DATE_FORMAT, Max_Parallel, PROXY } = require('../common/const');

module.exports = app => {
  const { mqPublisher, myutil, logger } = app;
  const { plat, shop, user } = app.proxy;

  /**
   * @author artsky
   * @description 规则任务解析引擎
   * trigger: {
   *  rule: { type: String }, // 任务发布周期day, week, month
   *  cycle: { type: Number }, // 创建任务时间,每周几,每月几号
   *  start: { type: String }, // 任务开始时间
   *  days: { type: Number }, // 从任务开始到截止，任务天数
   *  end: { type: String }, // 具体截止时间，09:20
   * }
   */
  class RuleTriggerTask extends app.Service {

    /**
     * @description 匹配符合生成任务的规则
     * @param {Object} rule 规则对象
     *  trigger.rule - 任务创建周期 day, week, month
     *  trigger.create - 任务创建时间 每周 1 - 7, 每月 1 - 28
     * @return {Boolean} 是否匹配
     */
    _match({ trigger }) {
      const now = moment();
      const { rule, cycle } = trigger;
      switch (rule) {
        case TimeTaskPeriod.Day:
          // return (now.getHours() === create);
          return true;
        case TimeTaskPeriod.Week: {
          const week = (now.day() === 0) ? 7 : now.day();
          return (week === cycle);
        }
        case TimeTaskPeriod.Month:
          return (now.date() === cycle);
        default:
          return false;
      }
    }

    /**
     *
     * @description 创建生成用户规则任务
     * @param {Object} rules 可生成任务的定时规则
     * @param {Object} obj 用户类别和用户列表
     *
     */
    * _createUserRuleTask(rules, { scope, users }) {

      if (!user || users.length < 1) return;

      const date = moment().format(DATE_FORMAT);
      for (const rule of rules) {
        const end = moment().add(rule.trigger.days, 'd').format(DATE_FORMAT);
        let begin_time = rule.trigger.start;
        if (begin_time === '7:00') {
          begin_time = '07:00:00';
        }
        const create_time = `${date} ${begin_time}`;
        const end_time = `${end} ${rule.trigger.end}`;
        if (moment().isAfter(end_time) || moment(create_time).isAfter(end_time)) {
          continue;
        }

        const task = {
          creator: SYS_USER,
          create_time, end_time,
          reminder: rule.reminder,
          content: rule.content,
          task_type: TaskCategory.timers,
        };
        yield this._publishUserTask(task, scope, users);
      }
    }

    /**
     * @description 任务发送给用户
     * @param {*} task 要发送的任务
     * @param {*} scope 接收任务用户的范围
     * @param {*} users 接收任务的用户列表
     */
    * _publishUserTask(task, scope, users) {
      const publishTask = [];
      for (const user of users) {
        const { _id, info, username, leader } = user;
        if (leader) {
          leader.id = leader.id || leader._id;
        }
        const name = info.name || username;
        const executor = { user: { id: _id, name, from: `${scope}_user` }, leader };
        const userTask = Object.assign({}, task, { executor });
        publishTask.push(mqPublisher.bmsRuleTask.publish(userTask));
      }

      if (publishTask.length > 0) {
        yield myutil.parallel(publishTask);
      }
    }

    /**
     * 1. 查找岗位规则 (获取岗位、角色列表)
     * 2. 匹配岗位员工 (不同岗位，相同的提醒规则会提醒多次),
     *    根据岗位、角色获取用户列表，无分页 (三个平台)
     * 3. 生成并发送任务
     *
     */
    * create() {
      const roleList = yield this._getRoleList();
      const tasks = [];
      for (const role of roleList) {
        const rules = role.timer_rules.filter(this._match);
        if (!rules.length) {
          continue;
        }

        // parallel process
        const roleUsers = yield this._getRoleUsers(role);
        tasks.push(this._createUserRuleTask(rules, roleUsers));

        if (tasks.length >= Max_Parallel) {
          yield myutil.parallel(tasks);
          tasks.splice(0, tasks.length);
        }
      }

      if (tasks.length > 0) {
        yield myutil.parallel(tasks);
      }

    }

    /**
     * @description 获取角色岗位列表
     * @param {Object} role 角色岗位
     * @return {Array} 角色岗位用户列表
     */
    * _getRoleUsers({ _id, scope }) {
      const choice = { roles: _id };
      const users = yield this.ctx.service.user.list(scope, { choice });
      return { scope, users };
    }

    /**
     * @description 获取角色列表
     * @return {Array} 角色列表
     */
    * _getRoleList() {
      const params = { page: PROXY.PAGE, size: PROXY.SIZE, choice: {}, group: { timer_rules: false } };
      const roleProxy = new user.RoleList(params);
      const ret = yield roleProxy.curl();
      if (ret.status === 0) {
        return ret.data.list;
      }
      logger.error(' timerRuleTask request Source %s::%s::%s', roleProxy.path, roleProxy.params, ret);
      return [];
    }

  }

  return RuleTriggerTask;
};
