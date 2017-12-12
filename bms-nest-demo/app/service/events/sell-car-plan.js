'use strict';
const Events = require('../../common/event-type');
const Cust = require('../../common/cust_enum');

module.exports = app => {

  return class SellCarPlanService extends app.Service {

    * getDetailType(context) {
      switch (Cust.resell_date_type[context.car.resell_date_type]) {
        case Events.dateType.iweek:
          return [ Events.detail.sell_car_plan_iweek ];
        case Events.dateType.imonth:
          return [ Events.detail.sell_car_plan_imonth ];
        case Events.dateType.hyear:
          return [ Events.detail.sell_car_plan_hyear ];
        case Events.dateType.iyear:
          return [ Events.detail.sell_car_plan_iyear ];
        case Events.dateType.ayear:
          return [ Events.detail.sell_car_plan_ayear ];
        default:
          return [];
      }
    }

    getExecutor(context) {
      return context.cust.belong;
    }

    * getEventTask(event_rules, context) {
      const { cust, car } = context;
      const old_car = [ car ];
      const car_name = old_car[0].model_name;
      const event_tasks = [];
      const shop_name = cust.shop[0].name;
      for (const event_rule of event_rules) {
        const event_task = {
          event_type: event_rule.event_type,
          related: {
            id: car._id,
            func_model: Events.category.sell_car_plan,
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
        let reg = /(\w*)\${car}(.*)/g;
        if (event_rule.event_type === Events.detail.sell_car_plan_iweek) {
          reg = /(\w*)\${shop}(.*)\${car}(.*)/g;
          event_task.rule.content = event_rule.content.replace(reg, `$1${shop_name}$2${car_name}$3`);
        } else {
          event_task.rule.content = event_rule.content.replace(reg, `$1${car_name}$2`);
        }
        event_tasks.push(event_task);
      }

      return event_tasks;
    }
  };

};
