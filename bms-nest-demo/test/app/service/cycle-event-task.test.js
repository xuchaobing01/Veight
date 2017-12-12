'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');
const { now_tasks, cycle_tasks, delay_tasks } = require('../mock-data/event-task');

describe('test/app/service/cycle-event-engine.test.js', () => {
  const test_exector_id = 'cycle_test_user_id';
  let { ctx, service, etModel } = {};
  before(function* () {
    ctx = app.mockContext();
    etModel = ctx.getModel('event_task');
    const testEventTasks = [];
    [ ...now_tasks, ...delay_tasks, ...cycle_tasks ].forEach(task => {
      task.executor.id = test_exector_id;
      testEventTasks.push(Object.assign({}, task));
    });
    yield etModel.insertMany(testEventTasks);
  });
  beforeEach(() => {
    service = ctx.service.cycleEventTask;
  });

  after(function* () {
    yield etModel.remove({ 'executor.id': test_exector_id });
  });

  it('[ TEST CycleEventTask _isPublished ]', () => {
    const begin = '2017-10-20 10:10:00';
    let end = '2017-10-22 10:10:00';
    let cycle = { cate: 'd', value: 2 };

    // begin + value == end
    let isPublished = service._isPublished(begin, end, cycle);
    assert(isPublished);

    // begin + value > end
    end = '2017-10-22 09:10:00';
    isPublished = service._isPublished(begin, end, cycle);
    assert(isPublished === false);

    // begin + value < end
    end = '2017-10-22 11:10:00';
    isPublished = service._isPublished(begin, end, cycle);
    assert(isPublished === true);

    // begin + value < end
    end = '2017-10-23 10:10:00';
    isPublished = service._isPublished(begin, end, cycle);
    assert(isPublished === true);

    // cycle = {} || null
    cycle = {};
    isPublished = service._isPublished(begin, end, cycle);
    assert(isPublished === false);

    cycle = null;
    isPublished = service._isPublished(begin, end, cycle);
    assert(isPublished === false);
  });

  it('[ TEST CycleEventTask isNeedPublish ]', () => {
    const now_expected = [ true, true, false, false ];
    now_tasks.forEach((e, i) => {
      const actual = service.isNeedPublish(e);
      assert.equal(now_expected[i], actual, e._id);
    });

    const cycle_expected = [ true, true, false ];
    cycle_tasks.forEach((e, i) => {
      const actual = service.isNeedPublish(e, false);
      assert.equal(cycle_expected[i], actual, e.test_id);
    });
  });

  it('[ TEST CycleEventTask _setCyclePublishedStatus ]', function* () {
    const expected = new Date();
    const doc = yield etModel.findOne().lean(true);
    assert(doc);
    assert.notEqual(doc.last_cycle_time, expected);

    const last_cycle_time = doc.last_cycle_time;

    doc.last_cycle_time = expected;
    const updated_expected = { ok: 1, nModified: 1, n: 1 };
    const updated_actual = yield service._setCyclePublishedStatus(doc);
    assert.deepEqual(updated_actual, updated_expected);

    const actual = yield etModel.findOne({ _id: doc._id }).lean(true);
    assert(actual);
    assert.equal(actual.last_cycle_time.toString(), expected.toString());

    if (last_cycle_time) {
      assert.notEqual(actual.last_cycle_time.toString(), last_cycle_time.toString());
    } else {
      assert.notEqual(actual.last_cycle_time.toString(), last_cycle_time);
    }

    // 还原现场
    doc.last_cycle_time = last_cycle_time;
    yield service._setCyclePublishedStatus(doc);
  });

  describe('[ TEST CycleEventTask ]', () => {
    let acatulPublish = 0;
    const endtime_expected = '23:00:00';
    const bak = new Map();
    beforeEach(() => {
      bak.clear();
      const mq = app.mqPublisher.bmsRuleTask;
      mock(mq, 'publish', function* (message) {
        acatulPublish++;
        assert(message);
      });
    });

    afterEach(function* () {
      // 还原现场
      for (const [ key, value ] of bak) {
        yield service._setCyclePublishedStatus({ _id: key, last_cycle_time: value });
      }
    });

    it('_createPublisherEventTask', function* () {
      const doc = yield etModel.findOne().lean(true);
      assert(doc);
      bak.set(doc._id, doc.last_cycle_time);

      let expected = 1;
      acatulPublish = 0;
      yield service._createPublisherEventTask(doc);
      assert.equal(acatulPublish, expected);

      expected = 2;
      doc.rule.trigger.end_time = endtime_expected;
      yield service._createPublisherEventTask(doc);
      assert.equal(acatulPublish, expected);

    });

    it('_createPublish', function* () {
      const docs = yield etModel.find({ 'executor.id': 'test_user_id' }).lean(true);
      assert(docs);

      const expected = { total: 0, ids: [] };
      docs.forEach(doc => {
        if (service.isNeedPublish(doc)) {
          expected.total++;
          expected.ids.push(doc._id);
          bak.set(doc._id, doc.last_cycle_time);
        }
      });

      acatulPublish = 0;
      const actualIds = yield service._createPublish(docs);
      assert.deepEqual(acatulPublish, expected.total, 'publish total task');
      assert.deepEqual(actualIds, expected.ids, 'publish task ids');

    });
  });

});
