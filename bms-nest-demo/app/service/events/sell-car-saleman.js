'use strict';
const Events = require('../../common/event-type');

module.exports = app => {

  return class SellCarSalemanService extends app.Service {

    * getDetailType(context) {
      return [ Events.detail.sell_car_to_saleman_iweek ];
    }

    getExecutor(context) {
      return context.executor;
    }

    * getEventTask(event_rules, context) {
      const { bee, executor, extend } = context;
      const { old_car } = extend;
      const car_name = old_car[0].model_name;
      const event_tasks = [];
      for (const event_rule of event_rules) {
        const event_task = {
          event_type: event_rule.event_type,
          related: {
            id: old_car[0]._id,
            func_model: Events.category.sell_car_to_saleman,
          },
          executor,
          context,
          rule: {
            task_type: event_rule.task_type,
            trigger: event_rule.trigger,
            reminder: event_rule.reminder,
            extend,
            content: event_rule.content,
          },
        };
        const reg = /(\w*)\${bee}(.*)\${car}(.*)/g;
        event_task.rule.content = event_rule.content.replace(reg, `$1${bee}$2${car_name}$3`);
        event_tasks.push(event_task);
      }

      return event_tasks;
    }
  };

};
