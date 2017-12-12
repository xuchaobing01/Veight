'use strict';

const Events = require('../../common/event-type');

module.exports = app => {

  /**
   * 购车计划事件服务
   */
  class ReplaceCarToSalemanService extends app.Service {

    * getDetailType(context) {
      const {
        task,
        executor_id,
      } = context;
      if (!task || !executor_id) {
        throw new Error('错误的参数');
      }

      const events = [];
      const cur_executor = task.executor.find(v => {
        return v.user.id === executor_id;
      });

      if (cur_executor && cur_executor.extend && cur_executor.extend.is_order && cur_executor.extend.expert) {
        events.push(Events.detail.replace_car_to_saleman_iweek);
      }

      return events;
    }

    getExecutor(context) {
      const { task, executor_id } = context;
      const cur_executor = task.executor.find(v => v.user.id === executor_id);
      return cur_executor.extend.expert;
    }

    * getEventTask(event_rules, context) {
      const {
        task,
        executor_id,
      } = context;

      const event_tasks = event_rules.map(e_v => {
        const e_t = {};
        e_t.event_type = e_v.event_type;
        e_t.context = context;

        const rule = {};
        rule.task_type = e_v.task_type;
        rule.trigger = e_v.trigger;
        rule.reminder = e_v.reminder;

        if (e_v.event_type === Events.detail.replace_car_to_saleman_iweek) {
          e_t.related = {
            id: context.task._id.toString(),
            func_model: Events.category.replace_car_to_saleman,
          };

          const cur_executor = task.executor.find(v => {
            return v.user.id === executor_id;
          });

          e_t.executor = cur_executor.extend.expert;
          rule.content = e_v.content
            .replace(/\${bee}/, cur_executor.user.name)
            .replace(/\${car}/, task.extend.old_car[0].name);
        }

        if (e_v.task_type === Events.taskType.system.replace_car_invitation_entry_shop && task.extend) {
          rule.extend = task.extend;
        }

        e_t.rule = rule;

        return e_t;
      });

      return event_tasks;
    }
  }

  return ReplaceCarToSalemanService;
};
