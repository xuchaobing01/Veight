'use strict';

const Events = require('../../common/event-type');

module.exports = app => {

  /**
   * 购车计划事件服务
   */
  class ReplaceCarPlanService extends app.Service {

    * getDetailType(context) {
      let events = [];
      // 置换
      const replace_events = yield this._getDetailType(context);
      events = events.concat(replace_events);

      if (events.length === 0) return events;

      // // 购车计划
      // const buy_events = yield this.ctx.service.events.buyCarPlan.getDetailType(context);
      // events = events.concat(buy_events);

      // 卖车
      context = this._resetContextSellCar(context);
      // 有出手
      if (context.car && context.car.resell_date_type) {
        const sell_events = yield this.ctx.service.events.sellCarPlan.getDetailType(context);
        events = events.concat(sell_events);
      }

      return events;
    }

    // 设置卖车的，车辆到context
    _resetContextSellCar(context) {
      const {
        cust,
        car_plan_id,
      } = context;
      const car_plan = cust.car_plan.find(v => v._id === car_plan_id);
      if (car_plan && car_plan.is_transfer === 1 && car_plan.transfer_cars && car_plan.transfer_cars.length > 0) {
        const own_car = cust.own_car.find(v => {
          return v._id.toString() === car_plan.transfer_cars[0];
        });

        if (own_car) { context.car = own_car; }
      }

      return context;
    }

    * _getDetailType(context) {
      // 1:不购车，2:1周内，3:1月内，4:半年内，5:1年内，6:1年后
      const {
        cust,
        car_plan_id,
      } = context;
      if (!cust || !car_plan_id) {
        throw new Error('错误的参数');
      }

      const car_plan = cust.car_plan.find(v => v._id === car_plan_id);
      const events = [];
      if (car_plan && car_plan.is_transfer === 1 && car_plan.transfer_cars && car_plan.transfer_cars.length > 0) {
        const buy_date_type = car_plan.buy_date_type;
        switch (buy_date_type) {
          case 1:
            events.push(Events.detail.replace_car_plan_iweek);
            break;
          case 2:
            events.push(Events.detail.replace_car_plan_imonth);
            break;
          case 3:
            events.push(Events.detail.replace_car_plan_hyear);
            break;
          case 4:
            events.push(Events.detail.replace_car_plan_iyear);
            break;
          case 5:
            events.push(Events.detail.replace_car_plan_ayear);
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
      let event_tasks = [];

      // 置换
      const replace_event_type = [ Events.detail.replace_car_plan_iweek, Events.detail.replace_car_plan_imonth,
        Events.detail.replace_car_plan_hyear, Events.detail.replace_car_plan_iyear,
        Events.detail.replace_car_plan_ayear ];

      const replace_event_rules = event_rules.filter(v => {
        return replace_event_type.find(t => { return t === v.event_type; });
      });

      const replace_event_tasks = yield this._getEventTask(replace_event_rules, context);
      event_tasks = event_tasks.concat(replace_event_tasks);

      // // 购车计划
      // const buy_event_type = [ Events.detail.buy_car_plan_iweek, Events.detail.buy_car_plan_imonth,
      //   Events.detail.buy_car_plan_hyear, Events.detail.buy_car_plan_iyear,
      //   Events.detail.buy_car_plan_ayear ];

      // const buy_event_rules = event_rules.filter(v => {
      //   return buy_event_type.find(t => { return t === v.event_type; });
      // });

      // let buy_event_tasks = yield this.ctx.service.events.buyCarPlan.getEventTask(buy_event_rules, context);

      // // 设置取消
      // buy_event_tasks = buy_event_tasks.map(v => {
      //   v.status = Events.STATUS.canceled;
      //   return v;
      // });
      // event_tasks = event_tasks.concat(buy_event_tasks);

      // 卖车
      context = this._resetContextSellCar(context);
      // 有出手
      if (context.car && context.car.resell_date_type) {
        const sell_event_type = [ Events.detail.sell_car_plan_iweek, Events.detail.sell_car_plan_imonth,
          Events.detail.sell_car_plan_hyear, Events.detail.sell_car_plan_iyear,
          Events.detail.sell_car_plan_ayear ];

        const sell_event_rules = event_rules.filter(v => {
          return sell_event_type.find(t => { return t === v.event_type; });
        });

        let sell_event_tasks = yield this.ctx.service.events.sellCarPlan.getEventTask(sell_event_rules, context);

        // 设置取消
        sell_event_tasks = sell_event_tasks.map(v => {
          v.status = Events.STATUS.canceled;
          return v;
        });
        event_tasks = event_tasks.concat(sell_event_tasks);
      }

      return event_tasks;
    }

    * _getEventTask(event_rules, context) {
      const {
        cust,
        car_plan_id,
      } = context;

      const event_tasks = event_rules.map(e_v => {
        const e_t = {};
        e_t.event_type = e_v.event_type;
        e_t.context = context;
        switch (e_v.event_type) {
          case Events.detail.replace_car_plan_iweek:
          case Events.detail.replace_car_plan_imonth:
          case Events.detail.replace_car_plan_hyear:
          case Events.detail.replace_car_plan_iyear:
          case Events.detail.replace_car_plan_ayear:
            e_t.related = {
              id: context.car_plan_id.toString(),
              func_model: Events.category.replace_car_plan,
            };
            e_t.executor = context.cust.belong;
            break;
          default:
        }

        const rule = {};
        rule.task_type = e_v.task_type;
        rule.content = e_v.content;

        const car_plan = cust.car_plan.find(v => {
          return v._id === car_plan_id && v.delete === 0;
        });
        const own_car = cust.own_car.find(v => {
          return v._id.toString() === car_plan.transfer_cars[0];
        });
        rule.content = rule.content.replace(/\${car}/, (own_car.model_name));

        if (context.cust.shop) {
          rule.content = rule.content.replace(/\${shop}/, context.cust.shop[0].name);
        } else {
          rule.content = e_v.content;
        }
        rule.trigger = e_v.trigger;
        rule.reminder = e_v.reminder;
        switch (e_v.task_type) {
          case Events.taskType.system.replace_car_invitation:
          case Events.taskType.system.replace_car_likeUp_invitation:
            rule.extend = {
              cust: {
                name: context.cust.info.name,
                id: context.cust._id.toString(),
              },
              car_plan: {
                id: context.car_plan_id.toString(),
              },
              old_car: [{
                _id: own_car._id,
                name: own_car.model_name,
              }],
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

  return ReplaceCarPlanService;
};
