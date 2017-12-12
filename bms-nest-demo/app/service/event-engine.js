'use strict';

const { category, detail, FUNC_GROUP, TRIGGER, STATUS } = require('../common/event-type');
const { SpruceError, ErrorStatus } = require('../common/spruce_error');

const PAGE = 1;
const SIZE = 1000000;

module.exports = app => {
  const { myutil } = app;
  const eventMap = new Map();
  eventMap.set(category.buy_car_plan, 'buyCarPlan');
  eventMap.set(category.buy_car_to_saleman, 'buyCarToSaleman');

  eventMap.set(category.replace_car_plan, 'replaceCarPlan');
  eventMap.set(category.replace_car_to_saleman, 'replaceCarToSaleman');

  eventMap.set(category.sell_car_plan, 'sellCarPlan');
  eventMap.set(category.sell_car_to_saleman, 'sellCarSaleman');

  eventMap.set(category.care_car_plan, 'careCarPlan');
  eventMap.set(category.care_car_to_server, 'careCarServer');

  eventMap.set(category.cust_info, 'custInfo');

  /**
   * @author artsky
   * @description 事件任务引擎
   */
  class EventEngineService extends app.Service {

    constructor(ctx) {
      super(ctx);
      this.etaskModel = this.ctx.getModel('event_task');
    }

    _getService(category) {
      const serviceName = eventMap.get(category);
      if (serviceName && this.ctx.service.events[serviceName]) {
        return this.ctx.service.events[serviceName];
      }

      throw new SpruceError(ErrorStatus.unsupport);
    }

    /**
     * @description 事件处理 生成事件任务
     * @param {Number} category 事件规则
     * @param {Object} context 事件解析处理上下文
     *  context.executor 执行人
     * @return {Array} event-task Model 处理结果
     */
    * process(category, context) {
      const logger = this.ctx.logger;
      logger.info(' EventEngine process %s::%s ', category, JSON.stringify(context));

      const eventService = this._getService(category);
      const events = yield eventService.getDetailType(context);
      logger.info(' EventEngine process getDetailType %s ', JSON.stringify(events));

      const executor = eventService.getExecutor(context);
      logger.info(' EventEngine process getExecutor %s ', JSON.stringify(executor));

      const event_rules = yield this._eventRules(executor, events);
      logger.info(' EventEngine process _eventRules %s ', JSON.stringify(event_rules));

      const eventTasks = yield eventService.getEventTask(event_rules, context);
      logger.info(' EventEngine process getEventTask %s ', JSON.stringify(eventTasks));

      const updated = yield this._save(eventTasks);
      yield this._publishTask(eventTasks); // 异步执行，可以不用等待执行结果
      return updated;
    }

    /**
     * 事件任务后发布自动完成或者重新开始发布周期
     * @param {Object} eventTask 事件任务
     * @return {Object} 更新状态
     */
    * autoCompleted(eventTask) {
      const logger = this.ctx.logger;
      const etaskStr = JSON.stringify(eventTask);
      const { _id, event_type, related } = eventTask || {};
      if (!_id || !event_type || !related) {
        logger.error(' EventEngine autoCompleted::%s ', etaskStr);
        return null;
      }
      logger.info(' EventEngine autoCompleted eventTask::%s ', etaskStr);
      // 同一辆车最多只对应一种事件类型
      const doc = yield this.etaskModel.findOne({ _id });
      if (!doc || this._isNotSameEventPlan(eventTask, doc)) {
        logger.info(' EventEngine autoCompleted eventTask::%s ', etaskStr, '计划已变更，规则失效');
        return null;
      }

      const cycle_log = { publish_time: doc.last_cycle_time, finish_time: new Date() };
      const data = {
        $set: { status: STATUS.finished },
        $push: { cycle_logs: cycle_log },
      };

      // 周期任务在完成时需要重新计算周期
      if (this._isRepublish(doc.rule.trigger)) {
        data.$set.status = STATUS.republish;
        // 生日是一个特殊的事件类型
        if (detail.cust_info_birthday !== event_type) {
          data.last_cycle_time = new Date();
        }
      }

      return yield this.etaskModel.update({ _id: doc._id }, data);
    }

    _isRepublish({ rule, cycle }) {
      const { cate, value } = cycle || {};
      return value && cate && TRIGGER.rule_delay !== rule;
    }

    /**
     * @description 移除事件任务（系统任务）规则
     * @param {*} category 事件类别
     * @param {Object} context 事件解析处理上下文
     *  id 当前所处理事件关联内容的id
     * @return {Array} remove 处理结果
     */
    * removeRule(category, context) {
      const logger = this.ctx.logger;
      const ctxStr = JSON.stringify(context);
      if (!category || !context.id) {
        logger.error(' EventEngine removeRule %s::%s ', category, ctxStr);
        return null;
      }

      logger.info(' EventEngine removeRule %s::%s ', category, ctxStr);

      const { query } = this._buildRelatedQuery({ id: context.id, func_model: category });
      const data = { status: STATUS.deleted };
      const [ find, update ] = yield myutil.parallel([
        this.etaskModel.find(query, '_id related rule', { lean: true }),
        this.etaskModel.update(query, data, { multi: true }),
      ]);
      if (find) {
        const invalidList = find.map(one => this._makeTaskInvalid(one));
        yield myutil.parallel(invalidList);
      }
      logger.info('EventEngine removeRule remove::%s', JSON.stringify(find));
      return update;
    }

    _isNotSameEventPlan(oldet, newet) {
      return (oldet.event_type !== parseInt(newet.event_type)
        || oldet.related.id !== newet.related.id
        || oldet.related.func_model !== newet.related.func_model);
    }

    * _eventRules(user, events) {
      const event_rules = [];
      if (myutil.isEmpty(events)) {
        return event_rules;
      }

      const userDetail = yield this.ctx.service.user.detail(user, { roles: 1 });
      if (!userDetail || myutil.isEmpty(userDetail.roles)) {
        return event_rules;
      }

      for (const role of userDetail.roles) {
        if (!role.event_rules || role.event_rules.length < 1) {
          continue;
        }

        for (const { category, rules } of role.event_rules) {
          this._matchRules(events, rules).forEach(rule => event_rules.push(rule));
        }
      }

      return event_rules;
    }

    _matchRules(events, rules) {
      if (myutil.isEmpty(rules)) {
        return [];
      }

      return rules.filter(rule => events.some(e => e === rule.event_type));
    }

    _findFuncModelGroup(category) {
      const _doFind = value => {
        return value.some(cate => cate === category);
      };
      return Object.values(FUNC_GROUP).find(_doFind);
    }

    _buildRelatedQuery({ id, func_model }) {
      const funcModelGroup = this._findFuncModelGroup(func_model);
      const query = { 'related.id': id };
      const isFuncGroup = (funcModelGroup !== undefined);

      if (isFuncGroup) {
        if (funcModelGroup.length > 1) {
          query['related.func_model'] = { $in: funcModelGroup };
        } else {
          query['related.func_model'] = funcModelGroup[0];
        }
      } else {
        query['related.func_model'] = func_model;
      }

      return { query, isFuncGroup };
    }

    * _save(docs) {
      if (myutil.isEmpty(docs)) {
        return null;
      }

      const tasks = docs.map(doc => this._findAndUpdate(doc));
      return yield myutil.parallel(tasks);
    }

    * _findAndUpdate(doc) {
      const related = doc.related;
      const { query, isFuncGroup } = this._buildRelatedQuery(related);
      if (!isFuncGroup) {
        query.event_type = doc.event_type;
      }
      const oldDoc = yield this.etaskModel.findOne(query);
      this._compareAndUpdate(doc, oldDoc);

      if (!oldDoc) {
        return yield this.etaskModel.create(doc);
      }

      const tasks = [ this.etaskModel.update(query, { $set: doc }) ];
      if (this._changedRule(oldDoc, doc) || this._canceldRule(doc)) {
        tasks.push(this._makeTaskInvalid(oldDoc));
      }
      const [ update ] = yield myutil.parallel(tasks);
      return update;
    }

    _compareAndUpdate(newDoc, oldDoc) {
      delete newDoc.create_time;
      if (!oldDoc) {
        if (!newDoc.status) {
          newDoc.status = STATUS.init;
        }
        return;
      }

      // 计划变更，重新计算计划周期
      if (this._changedRule(oldDoc, newDoc)) {
        newDoc.update_plan_time = new Date();
        if (oldDoc.status !== STATUS.init && !newDoc.status) {
          newDoc.status = STATUS.republish;
        }
      } else {
        // 事件规则未变，规则取消或者重新开启
        if (this._canceldRule(oldDoc) !== this._canceldRule(newDoc)) {
          newDoc.update_plan_time = new Date();
          if (this._canceldRule(oldDoc) && !newDoc.status) {
            newDoc.status = STATUS.republish;
          }
        }
      }
    }

    _canceldRule(doc) {
      return doc.status === STATUS.canceled;
    }

    _changedRule(oldDoc, newDoc) {
      return oldDoc && oldDoc.event_type !== newDoc.event_type;
    }

    * _makeTaskInvalid({ related, rule }) {
      try {
        yield this.ctx.service.task.makeInvalid(related.id, rule.task_type);
      } catch (error) {
        this.ctx.logger.error('_makeTaskInvalid %s::%s', related.id, rule.task_type, error);
      }
    }

    * _publishTask(docs) {
      if (myutil.isEmpty(docs)) {
        return;
      }

      const query = {
        $and: [
          { $or: [{ status: STATUS.init }, { status: STATUS.republish }] },
        ],
      };
      const tmp = [];
      for (const { related, event_type } of docs) {
        tmp.push({ 'related.id': related.id, event_type });
      }
      if (tmp.length > 1) {
        query.$and.push({ $or: tmp });
      } else {
        query.$and.push(tmp[0]);
      }

      const etask = yield this.etaskModel.find(query).lean();
      yield this.ctx.service.cycleEventTask.createPublish(etask);
    }

  }
  return EventEngineService;
};
