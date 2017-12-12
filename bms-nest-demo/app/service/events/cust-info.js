'use strict';

const { detail, category, STATUS } = require('../../common/event-type');
const { DATE_FORMAT } = require('../../common/const');
const moment = require('moment');

module.exports = app => {
  const February = 1;
  const dateOf_29 = 29;
  return class CustInfoCompleteService extends app.Service {

    * getDetailType(context) {
      const { cust_id, belong } = context;
      if (!cust_id || !belong) {
        throw new Error('custInfo getDetailType 参数错误');
      }

      const events = [ detail.cust_info_complete ]; // 完善资料
      if (context.brith) { // 填写生日
        events.push(detail.cust_info_birthday); // 生日提醒
      }

      return events;
    }

    getExecutor(context) {
      return context.belong;
    }

    * getEventTask(event_rules, context) {
      const event_tasks = [];
      const { cust_id, name } = context;
      const task = {
        related: { id: cust_id, func_model: category.cust_info },
        executor: this.getExecutor(context),
        context,
      };

      for (const event_rule of event_rules) {
        const event_type = event_rule.event_type;
        const new_task = Object.assign({ event_type, rule: event_rule }, task);
        event_rule.extend = { cust: { name, id: cust_id.toString() } };
        delete new_task.rule.event_type;
        // 生日提醒
        if (event_type === detail.cust_info_birthday) {
          const { pre_cycle, trigger } = event_rule;
          new_task.last_cycle_time = this._lastBirthReminderTime(context.brith, pre_cycle, trigger.start);
          new_task.status = STATUS.init;
          delete new_task.rule.pre_cycle;
          event_tasks.push(new_task);
        } else if (event_type === detail.cust_info_complete) {
          // 客户资料
          if (this._isEmpty(context)) { // 不完善
            new_task.status = STATUS.init;
          } else { // 完善
            new_task.status = STATUS.finished;
          }
          event_tasks.push(new_task);
        }
      }

      return event_tasks;
    }

    _lastBirthReminderTime(birth, pre_cycle, begin_time) {
      birth = moment(birth);
      const now = moment();
      const birthReminder = moment(birth).add(now.diff(birth, 'years'), 'years');

      // 今年未过生日
      if (birthReminder.dayOfYear() > now.dayOfYear()) {
        birthReminder.set({ year: now.year() - 1 });
      }

      if (this._birthIsFebDate29(birth, birthReminder)) {
        birthReminder.subtract(pre_cycle.value - 1, pre_cycle.cate);
      } else {
        birthReminder.subtract(pre_cycle.value, pre_cycle.cate);
      }

      return birthReminder.format(`${DATE_FORMAT} ${begin_time}`);
    }

    _birthIsFebDate29(birth, birthReminder) {
      return birth.month() === February
        && birth.date() === dateOf_29
        && birthReminder.date() !== dateOf_29;
    }

    // 客户资料是否完善，完善：false，不完善：true
    _isEmpty(context) {
      // const subDoc = {
      //   family: [ 'situation', 'earning', 'location' ],
      //   job: [ 'company', 'occupation', 'location' ],
      //   location: [ 'province', 'province_name', 'city', 'city_name', 'region', 'region_name', 'addr' ],
      // };
      const subDoc = {
        family: [ 'situation', 'earning' ],
        job: [ 'company', 'occupation' ],
      };

      const isEmpty = (obj, key) => {
        if (!obj) {
          return true;
        }
        if (obj instanceof Array && obj.length === 0) {
          return true;
        }
        if (subDoc[key]) {
          if (obj instanceof Object) {
            return subDoc[key].some(skey => isEmpty(obj[skey], skey));
          }
        }

        return false;
      };

      const isSome = key => isEmpty(context[key], key);

      return [ 'name', 'sex', 'brith', 'tel', 'wechat', 'email',
        'eduction', 'hobby', 'family', 'job' ].some(isSome);
    }
  };

};
