'use strict';

const moment = require('moment');
const { app, assert } = require('egg-mock/bootstrap');
const { detail } = require('../../../../app/common/event-type');
const MockData = require('../../mock-data/cust-info');


describe('test/app/service/events/cust-info.test.js', () => {
  let { ctx, service } = {};

  beforeEach(() => {
    ctx = app.mockContext();
    service = ctx.service.events.custInfo;
  });

  describe(' custInfo getDetailType ', () => {
    it(' Has birth ', function* () {
      const actual = yield service.getDetailType(MockData.cust_all);
      const expected = [ detail.cust_info_complete, detail.cust_info_birthday ];
      assert.deepEqual(actual, expected);
    });

    it(' No birth ', function* () {
      const actual = yield service.getDetailType(MockData.cust_no_birth);
      const expected = [ detail.cust_info_complete ];
      assert.deepEqual(actual, expected);
    });
  });

  describe(' custInfo getEventTask ', () => {
    it(' Cust perfect and has birth ', function* () {
      const actual = yield service.getEventTask(MockData.event_rules_all, MockData.cust_all);
      const expected = MockData.event_tasks_all;
      assert.deepEqual(actual, expected);
    });

    it(' Cust no perfect and No birth ', function* () {
      const actual = yield service.getEventTask(MockData.event_rules_part, MockData.cust_no_birth);
      const expected = MockData.event_tasks_part;
      assert.deepEqual(actual, expected);
    });
  });

  describe(' custInfo _lastBirthReminderTime ', () => {
    const pre_cycle = { cate: 'days', value: 1 };
    const begin_time = '12:00:00';
    let DT_FORMAT = null;
    const nowDate = moment();
    const [ January, February, March, December ] = [ 0, 1, 2, 11 ];

    before(() => {
      DT_FORMAT = `${app.myutil.CONST.DATE_FORMAT} ${begin_time}`;
    });

    it(' January 1月1', () => {
      const brith = '1980-01-01';
      const expected = moment({ month: January, date: 1 }).subtract(1, 'days').format(DT_FORMAT);
      const actual = service._lastBirthReminderTime(brith, pre_cycle, begin_time);
      assert.equal(expected, actual);
    });

    it(' February 2月29', () => {
      const birth = moment('1980-02-29');
      const lastReminderDate = moment({ month: February, date: 28 });
      if (nowDate.month() <= February) {
        lastReminderDate.subtract(1, 'years');
      }
      const expected = lastReminderDate.format(DT_FORMAT);
      const actual = service._lastBirthReminderTime(birth, pre_cycle, begin_time);
      assert.equal(expected, actual);
    });

    it(' March 3月1号 ', () => {
      const birth = moment('1980-03-01');
      const lastReminderDate = moment({ month: March, date: 1 });
      if (nowDate.month() <= March) {
        lastReminderDate.subtract(1, 'years');
      }
      const expected = lastReminderDate.subtract(1, 'days').format(DT_FORMAT);
      const actual = service._lastBirthReminderTime(birth, pre_cycle, begin_time);
      assert.equal(expected, actual);
    });
  });

  describe(' custInfo _birthIsFebDate29 ', () => {
    it(' 1980-02-29 ', function* () {
      const brith = moment('1980-02-29');
      const birthReminder = moment('2017-02-28');
      const actual = service._birthIsFebDate29(brith, birthReminder);
      const expected = true;
      assert.equal(actual, expected);
    });

    it(' 1980-02-28 ', function* () {
      const brith = moment('1980-02-28');
      const birthReminder = moment('2017-02-27');
      const actual = service._birthIsFebDate29(brith, birthReminder);
      const expected = false;
      assert.equal(actual, expected);
    });
  });

  describe(' custInfo _isEmpty ', () => {
    it(' All info ', function* () {
      const actual = service._isEmpty(MockData.cust_all);
      const expected = false;
      assert.equal(actual, expected);
    });

    it(' Part info ', function* () {
      const actual = service._isEmpty(MockData.cust_no_birth);
      const expected = true;
      assert.equal(actual, expected);
    });
  });

});
