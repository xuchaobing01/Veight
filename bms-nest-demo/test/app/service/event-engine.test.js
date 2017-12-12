'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');
const { now_tasks, delay_tasks, cycle_tasks } = require('../mock-data/event-task');

const { category, detail, STATUS } = require('../../../app/common/event-type');
const { SpruceError, ErrorStatus } = require('../../../app/common/spruce_error');

describe('test/app/service/event-engine.test.js', () => {

  const test_exector_id = 'test_engine_exector_id';
  const test_task_type = 1000;

  let { ctx, service, etModel } = {};
  before(function* () {
    ctx = app.mockContext();
    etModel = ctx.getModel('event_task');
    const testTasks = [];
    [ ...now_tasks, ...delay_tasks, ...cycle_tasks ].forEach(task => {
      task.executor.id = test_exector_id;
      testTasks.push(Object.assign({}, task));
    });
    yield etModel.insertMany(testTasks);
  });

  beforeEach(() => {
    service = ctx.service.eventEngine;
    app.mockService('cycleEventTask', 'createPublish', function* (etDocs) {
      const expectedExecutor = { id: 'test-bee-id', name: 'test-bee-name', from: 'bee_user' };
      assert(etDocs[0].executor, expectedExecutor);
    });

    app.mockService('user', 'detail', function* (user, fields) {
      if (test_exector_id !== user.id) {
        return null;
      }
      const roles = [
        {
          _id: 'role_test_event_id1',
          event_rules: [{
            category: category.buy_car_plan,
            rules: [{
              event_type: detail.buy_car_plan_iweek,
              task_type: test_task_type,
            }],
          }],
        },
        {
          _id: 'role_test_event_id2',
          event_rules: [{
            category: category.buy_car_to_saleman,
            rules: [{
              event_type: detail.buy_car_to_saleman_iweek,
              task_type: test_task_type,
            }],
          }],
        },
      ];

      if (!fields) {
        return { _id: user.id };
      }
      return { roles, _id: user.id };
    });

    app.mockService('task', 'makeInvalid', function* (relatedId, task_type) {
      assert(relatedId);
      assert(task_type);
      return true;
    });

  });

  after(function* () {
    yield etModel.remove({ 'executor.id': test_exector_id });
  });

  describe('[ TEST EventEngine _getService ]', () => {

    it(' already has category ', () => {
      const buyCarPlan = service._getService(category.buy_car_plan);
      assert(buyCarPlan);
      assert(buyCarPlan instanceof app.Service);
      assert(buyCarPlan.getDetailType);
      assert(buyCarPlan.getEventTask);
    });

    it(' not define category ', () => {
      try {
        const noCategory = service._getService('abcd');
        assert.fail(noCategory);
      } catch (error) {
        assert(error);
        assert(error instanceof SpruceError);
      }
    });

  });

  describe('[ TEST EventEngine _matchRules ]', () => {

    it(' one or more param empty ', () => {
      const expected = [];
      let actual = service._matchRules([], []);
      assert.deepEqual(expected, actual);

      actual = service._eventRules([], [ 1, 2 ]);
      assert.deepEqual(expected, actual);

      actual = service._eventRules([ 1, 2 ], []);
      assert.deepEqual(expected, actual);
    });

    it(' one matched ', () => {
      const expected = [{ event_type: 1 }];
      const rules = [{ event_type: 1 }, { event_type: 4 }, { event_type: 5 }];
      const actual = service._matchRules([ 1, 2, 3 ], rules);
      assert.deepEqual(expected, actual);
    });

    it(' two or more matched ', () => {
      let expected = [{ event_type: 1 }, { event_type: 4 }];
      let rules = [
        { event_type: 1 }, { event_type: 4 },
        { event_type: 5 }, { event_type: 6 }];
      let actual = service._matchRules([ 1, 2, 3, 4 ], rules);
      assert.deepEqual(expected, actual);

      expected = [{ event_type: 1 }, { event_type: 4 }, { event_type: 'a7' }];
      rules = [
        { event_type: 1 }, { event_type: 4 }, { event_type: 'a7' },
        { event_type: 5 }, { event_type: 6 }];
      actual = service._matchRules([ 1, 2, 3, 4, 'a7' ], rules);
      assert.deepEqual(expected, actual);
    });

    it(' no matched ', () => {
      const expected = [];
      const rules = [{ event_type: 1 }, { event_type: 4 }, { event_type: 5 }];
      const actual = service._matchRules([ 2, 3 ], rules);
      assert.deepEqual(expected, actual);
    });

  });

  describe('[ TEST EventEngine _eventRules ]', () => {

    it(' has executor and match events ', function* () {
      const events = [ detail.buy_car_plan_iweek ];
      const expected = [{
        event_type: detail.buy_car_plan_iweek,
        task_type: test_task_type,
      }];

      const user = { id: test_exector_id };
      const eventRules = yield service._eventRules(user, events);
      assert(eventRules);
      assert.deepEqual(expected, eventRules);
    });

    it(' has executor not match events ', function* () {
      const events = [ detail.buy_car_plan_iweek ];
      const expected = [];

      const user = { id: 'test' };
      const eventRules = yield service._eventRules(user, events);
      assert(eventRules);
      assert.deepEqual(expected, eventRules);
    });

    it(' no executor not match events ', function* () {
      const events = [ 'test_event_type' ];
      const expected = [];
      const eventRules = yield service._eventRules(events);
      assert(eventRules);
      assert.deepEqual(expected, eventRules);
    });

  });

  describe('[ TEST EventEngine _isNotSameEventPlan]', () => {

    it(' issame ', () => {
      let oldet = { event_type: 100, related: {} };
      let newet = { event_type: 100, related: {} };
      let notSame = service._isNotSameEventPlan(oldet, newet);
      assert(notSame === false);

      oldet = { event_type: 100, related: {} };
      newet = { event_type: 100, related: {} };
      notSame = service._isNotSameEventPlan(oldet, newet);
      assert(notSame === false);

      oldet = { event_type: 100, related: { id: '', func_model: '' } };
      newet = { event_type: '100', related: { id: '', func_model: '' } };
      notSame = service._isNotSameEventPlan(oldet, newet);
      assert(notSame === false);
    });

    it(' notSame ', () => {
      let oldet = { event_type: '', related: {} };
      let newet = { related: {} };
      let notSame = service._isNotSameEventPlan(oldet, newet);
      assert(notSame === true);

      oldet = { event_type: '', related: { id: '' } };
      newet = { event_type: '', related: {} };
      notSame = service._isNotSameEventPlan(oldet, newet);
      assert(notSame === true);

      oldet = { event_type: '', related: { id: '', func_model: '' } };
      newet = { event_type: '', related: { id: '' } };
      notSame = service._isNotSameEventPlan(oldet, newet);
      assert(notSame === true);

      oldet = { event_type: '12', related: { id: '', func_model: '' } };
      newet = { event_type: 'ab', related: { id: '', func_model: '' } };
      notSame = service._isNotSameEventPlan(oldet, newet);
      assert(notSame === true);
    });

  });

  describe('[ TEST EventEngine _buildRelatedQuery ]', () => {
    it(' Some Params Empty', () => {
      let expected = {
        query: { 'related.id': undefined, 'related.func_model': undefined },
        isFuncGroup: false,
      };
      let actual = service._buildRelatedQuery({});
      assert(actual);
      assert.deepEqual(actual, expected);

      expected = {
        query: { 'related.id': null, 'related.func_model': null },
        isFuncGroup: false,
      };
      actual = service._buildRelatedQuery({ id: null, func_model: null });
      assert(actual);
      assert.deepEqual(actual, expected);

    });

    it(' No FuncGroup ', () => {
      const expected_test_id = 'e_test_id';
      const expected = {
        query: { 'related.id': expected_test_id, 'related.func_model': category.cust_info },
        isFuncGroup: false,
      };
      const related = { id: expected_test_id, func_model: category.cust_info };
      let actual = service._buildRelatedQuery(related);
      assert(actual);
      assert.deepEqual(actual, expected);

      expected.query = { 'related.id': expected_test_id, 'related.func_model': 'no_112' };
      actual = service._buildRelatedQuery({ id: expected_test_id, func_model: 'no_112' });
      assert(actual);
      assert.deepEqual(actual, expected);
    });

    it(' carPlan FuncGroup ', () => {
      const expected = {
        query: {
          'related.id': 11,
          'related.func_model': { $in: [ category.buy_car_plan, category.replace_car_plan ] },
        },
        isFuncGroup: true,
      };
      let actual = service._buildRelatedQuery({ id: 11, func_model: category.buy_car_plan });
      assert(actual);
      assert.deepEqual(actual, expected);

      expected.query = {
        'related.id': null,
        'related.func_model': { $in: [ category.buy_car_plan, category.replace_car_plan ] },
      };
      actual = service._buildRelatedQuery({ id: null, func_model: category.replace_car_plan });
      assert(actual);
      assert.deepEqual(actual, expected);
    });

    it(' ownerCar FuncGroup ', () => {
      const expected = {
        query: {
          'related.id': 11,
          'related.func_model': {
            $in: [ category.care_car_plan, category.sell_car_plan ],
          },
        },
        isFuncGroup: true,
      };

      let related = { id: 11, func_model: category.sell_car_plan };
      let actual = service._buildRelatedQuery(related);
      assert(actual);
      assert.deepEqual(actual, expected);

      related = { id: 11, func_model: category.care_car_plan };
      actual = service._buildRelatedQuery(related);
      assert(actual);
      assert.deepEqual(actual, expected);

    });

  });

  describe('[ TEST EventEngine process ]', () => {
    beforeEach(() => {
      mock(service, '_getService', cate => {
        if (category.buy_car_plan !== cate) {
          throw new SpruceError(ErrorStatus.unsupport);
        }
        const executor = { id: 'test-bee-id', name: 'test-bee-name', from: 'bee_user' };
        const mockEventService = {
          getDetailType: context => [ detail.buy_car_plan_iweek ],
          getExecutor: context => executor,
          getEventTask: context => {
            return [{
              event_type: detail.buy_car_plan_iweek,
              related: {
                id: 'buy_car_plan_iweek_id',
                func_model: category.buy_car_plan,
              },
              executor,
              context, // 上下 相关
              rule: {
                task_type: test_task_type,
                content: '请邀请客户#{cust}到东城天道店看车购车',
                extend: {},
                trigger: {
                  rule: 'cycle', // now, delay
                  cycle: {
                    cate: 'hours',
                    value: 24,
                  },
                  start: '', // 生成事件任务的时间，时分秒
                  end: {
                    cate: 'hour',
                    value: 24,
                  },
                },
                reminder: {
                  rule_key: 2,
                  rule_name: '截前半小时',
                  time_diff: 1800,
                },
              },
            }];
          },
        };
        return mockEventService;
      });

      app.mockService('task', 'makeInvalid', function* (relatedId, task_type) {
        assert(relatedId);
        assert(task_type);
        return true;
      });

    });

    it(' process success ', function* () {
      const query = {
        event_type: detail.buy_car_plan_iweek,
        'related.id': 'buy_car_plan_iweek_id',
      };
      const model = ctx.getModel('event_task');
      yield model.remove(query);

      const cate = category.buy_car_plan;
      const context = {};

      const indata = yield service.process(cate, context);
      assert(indata);
      const insert_id = indata[0]._id;
      const opt = { lean: true };
      const tmp1 = yield model.findOne(query, '', opt);
      const tmp2 = yield model.findOne({ _id: insert_id }, '', opt);
      assert(tmp1);
      assert(tmp2);
      assert.deepEqual(tmp1, tmp2);

      const upExpected = [{ ok: 1, nModified: 1, n: 1 }];
      const updata = yield service.process(cate, context);
      assert(updata, upExpected);

      // 清理测试数据
      yield model.remove(query);
    });

  });

  describe('[ TEST EventEngine autoCompleted ]', () => {
    const fields = 'event_type related status';

    it('empty params', function* () {
      const doc = {};
      const empty = yield service.autoCompleted(doc);
      assert.equal(null, empty);
    });

    it('no plan', function* () {
      const doc = { _id: 'test_no_plan', related: {}, event_type: 'tt' };
      const empty = yield service.autoCompleted(doc);
      assert.equal(null, empty);
    });

    it('rule_now plan republish', function* () {
      const model = ctx.getModel('event_task');
      const query = { 'related.id': 'test_now_plan_iweek_id_1', 'executor.id': test_exector_id };
      const doc = yield model.findOne(query, fields);
      assert.notEqual(doc.status, STATUS.republish);

      yield service.autoCompleted(doc);
      const actual_doc = yield model.findOne(query, fields);
      assert.equal(actual_doc.status, STATUS.republish);
    });

    it('rule_cycle plan republish', function* () {
      const model = ctx.getModel('event_task');
      const query = { 'related.id': 'test_cycle_iweek_id_12', 'executor.id': test_exector_id };
      const doc = yield model.findOne(query, fields);
      assert.notEqual(doc.status, STATUS.republish);

      yield service.autoCompleted(doc);
      const actual_doc = yield model.findOne(query, fields);
      assert.equal(actual_doc.status, STATUS.republish);
    });

    it('rule_now plan finished', function* () {
      const model = ctx.getModel('event_task');
      const query = { 'related.id': 'test_now_plan_iweek_id_4', 'executor.id': test_exector_id };
      const doc = yield model.findOne(query, fields);
      assert.notEqual(doc.status, STATUS.finished);

      yield service.autoCompleted(doc);
      const actual_doc = yield model.findOne(query, fields);
      assert.equal(actual_doc.status, STATUS.finished);
    });

    it('rule_delay plan finished', function* () {
      const model = ctx.getModel('event_task');
      const query = { 'related.id': 'test_delay_iweek_id_11', 'executor.id': test_exector_id };
      const doc = yield model.findOne(query, fields);
      assert.notEqual(doc.status, STATUS.finished);

      yield service.autoCompleted(doc);
      const actual_doc = yield model.findOne(query, fields);
      assert.equal(actual_doc.status, STATUS.finished);
    });
  });

  describe('[ TEST EventEngine removeRule ]', () => {
    it(' Params Empty ', function* () {
      const expected = null;
      let actual = yield service.removeRule(null, {});
      assert.equal(actual, expected);

      actual = yield service.removeRule(null, { id: null });
      assert.equal(actual, expected);

      actual = yield service.removeRule(null, { id: '' });
      assert.equal(actual, expected);

      actual = yield service.removeRule(null, { id: 'aaaa' });
      assert.equal(actual, expected);

      actual = yield service.removeRule(1212, { id: '' });
      assert.equal(actual, expected);
    });

    it(' No Record Update ', function* () {
      const expected = { ok: 1, nModified: 0, n: 0 };
      const actual = yield service.removeRule(category.buy_car_plan, { id: 'no_record_update' });
      assert(actual);
      assert.deepEqual(actual, expected);
    });

    it(' One Record Update ', function* () {
      const query = { 'executor.id': test_exector_id };
      const doc = yield ctx.getModel('event_task').findOne(query);
      const expectedUpdate = { ok: 1, nModified: 1, n: 1 };
      const actualUpdate = yield service.removeRule(doc.related.func_model, { id: doc.related.id });
      assert(actualUpdate);
      assert.deepEqual(actualUpdate, expectedUpdate);

      const expectedStatus = STATUS.deleted;
      assert.notEqual(doc.status, expectedStatus);
      const actualDoc = yield ctx.getModel('event_task').findOne({ _id: doc._id });
      assert(actualDoc);
      assert.equal(actualDoc.status, expectedStatus);
    });

  });

});
