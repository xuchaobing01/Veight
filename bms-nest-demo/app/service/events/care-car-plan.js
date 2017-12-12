'use strict';
const Events = require('../../common/event-type');

module.exports = app => {

  return class CareCarPlanService extends app.Service {

    * getDetailType(context) {
      const events = [ Events.detail.care_car_plan_30d ];
      if (context.newCar) {
        events.push(Events.detail.care_car_plan_60d);
      }

      return events;
    }

    getExecutor(context) {
      return context.cust.belong;
    }

    * getEventTask(event_rules, context) {
      const { cust, car } = context;
      const old_car = [ car ];
      const car_name = old_car[0].model_name;
      const event_tasks = [];
      for (const event_rule of event_rules) {
        const event_task = {
          event_type: event_rule.event_type,
          related: {
            id: car._id,
            func_model: Events.category.care_car_plan,
          },
          executor: cust.belong,
          context,
          rule: {
            task_type: event_rule.task_type,
            trigger: event_rule.trigger,
            reminder: event_rule.reminder,
            extend: {
              cust: {
                id: cust._id,
                name: cust.info.name,
              },
              old_car,
            },
            content: event_rule.content,
          },
        };
        const reg = /(\w*)\${car}(.*)/g;
        event_task.rule.content = event_rule.content.replace(reg, `$1${car_name}$2`);
        event_tasks.push(event_task);
      }

      return event_tasks;
    }
  };

};
