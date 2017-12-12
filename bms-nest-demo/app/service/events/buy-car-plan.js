'use strict';

const Events = require('../../common/event-type');

module.exports = app => {

  /**
   * 购车计划事件服务
   */
  class BuyCarPlanService extends app.Service {

    * getDetailType(context) {
      // 1:不购车，2:1周内，3:1月内，4:半年内，5:1年内，6:1年后
      const { cust, car_plan_id } = context;
      if (!cust || !car_plan_id) {
        throw new Error('错误的参数');
      }

      const car_plan = cust.car_plan.find(v => v._id === car_plan_id);
      const events = [];
      if (car_plan) {
        const buy_date_type = car_plan.buy_date_type;
        switch (buy_date_type) {
          case 1:
            events.push(Events.detail.buy_car_plan_iweek);
            break;
          case 2:
            events.push(Events.detail.buy_car_plan_imonth);
            break;
          case 3:
            events.push(Events.detail.buy_car_plan_hyear);
            break;
          case 4:
            events.push(Events.detail.buy_car_plan_iyear);
            break;
          case 5:
            events.push(Events.detail.buy_car_plan_ayear);
            break;
          default:
        }
      }

      return events;
    }

    getExecutor(context) {
      return context.cust.belong;
    }

    * getEventTask(event_rules, context) {
      const event_tasks = event_rules.map(e_v => {
        const e_t = {};
        e_t.event_type = e_v.event_type;
        e_t.context = context;
        switch (e_v.event_type) {
          case Events.detail.buy_car_plan_iweek:
          case Events.detail.buy_car_plan_imonth:
          case Events.detail.buy_car_plan_hyear:
          case Events.detail.buy_car_plan_iyear:
          case Events.detail.buy_car_plan_ayear:
            e_t.related = {
              id: context.car_plan_id.toString(),
              func_model: Events.category.buy_car_plan,
            };
            e_t.executor = this.getExecutor(context);
            break;
          default:
        }

        const rule = {};
        rule.task_type = e_v.task_type;
        if (context.cust.shop) {
          rule.content = e_v.content.replace(/\${shop}/, context.cust.shop[0].name);
        } else {
          rule.content = e_v.content;
        }
        rule.trigger = e_v.trigger;
        rule.reminder = e_v.reminder;
        switch (e_v.task_type) {
          case Events.taskType.system.buy_car_invitation:
          case Events.taskType.system.buy_car_likeUp_invitation:
            rule.extend = {
              cust: {
                name: context.cust.info.name,
                id: context.cust._id.toString(),
              },
              car_plan: {
                id: context.car_plan_id.toString(),
              },
              new_car: [
                {
                  id: null,
                  name: null,
                },
              ],
            };

            if (context.cust.shop) {
              rule.extend.shop = {
                id: context.cust.shop[0]._id,
                name: context.cust.shop[0].name,
              };
            }
            break;
          default:
        }

        e_t.rule = rule;

        return e_t;
      });
      return event_tasks;
    }
  }

  return BuyCarPlanService;
};
