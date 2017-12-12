'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');

const { RoleScope } = require('../../../app/common/const');
const { roles, users } = require('../mock-data/timer-rule-task');

describe('test/app/service/timer-rule-task.test.js', () => {

  let { ctx, service } = {};
  beforeEach(() => {
    ctx = app.mockContext();
    service = ctx.service.timerRuleTask;
    app.mockService('user', 'list', function* (scope, params) {
      const scope_users = users[`${scope}_users`];
      const _id = params.choice.roles;
      if (_id && scope_users) {
        return scope_users.filter(user => user.roles.includes(_id));
      }
      return [];
    });
  });

  it('[TEST Timer Rule Task timer_rules _match ]', () => {
    const now = new Date();
    const data = [{
      category: 0,
      trigger: { end: '12:00', days: 2, start: '07:00', cycle: now.getHours(), rule: 'day' },
      reminder: { time_diff: 1800, alert_time: null, rule_name: '截止前半小时', rule_key: 2 },
      _id: '59ba6093bed8b039c0cde77b',
      content: '每天创建定时任务',
    }, {
      category: 0,
      trigger: { end: '12:00', days: 2, start: '07:00', cycle: now.getDay(), rule: 'week' },
      reminder: { time_diff: 1800, alert_time: null, rule_name: '截止前半小时', rule_key: 2 },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每周${now.getDay()}创建定时任务`,
    }, {
      category: 0,
      trigger: { end: '12:00', days: 2, start: '07:00', cycle: now.getDate() + 1, rule: 'month' },
      reminder: { time_diff: 1800, alert_time: null, rule_name: '截止前半小时', rule_key: 2 },
      _id: '59ba6093bed8b039c0cde77b',
      content: `每月${now.getDate() + 1}号创建定时任务`,
    }];

    const expected = data.filter((o, i) => i < 2);
    const actual = data.filter(service._match);
    assert(actual);
    assert.deepEqual(expected, actual);

  });

  describe('[TEST Time Rule Task _getRoleList]', () => {
    beforeEach(() => {
      mock(service, '_getRoleList', function* () {
        return roles;
      });
    });

    it('[_getRoleList]', function* () {
      const actual = yield service._getRoleList();
      assert(actual);
      assert.equal(actual.length, roles.length);
      assert.deepEqual(actual, roles);
    });
  });

  describe('[TEST Timer Rule Task _getRoleUsers ]', () => {

    const plat_role = [],
      shop_role = [],
      bee_role = [];
    before(() => {
      roles.forEach(role => {
        if (RoleScope.plat === role.scope) {
          plat_role.push(role);
        } else if (RoleScope.shop === role.scope) {
          shop_role.push(role);
        } else if (RoleScope.bee === role.scope) {
          bee_role.push(role);
        }
      });
    });

    it('[ plat scope user ]', function* () {
      for (const role of plat_role) {
        const actual = yield service._getRoleUsers(role);
        assert(actual);
        assert.equal(role.scope, actual.scope);
        assert(actual.users);
        assert.equal(2, actual.users.length);
      }
    });

    it('[ shop scope user ]', function* () {
      for (const role of plat_role) {
        const actual = yield service._getRoleUsers(role);
        assert(actual);
        assert.equal(role.scope, actual.scope);
        assert(actual.users);
        assert.equal(2, actual.users.length);
      }
    });

    it('[ bee scope user ]', function* () {
      for (const role of plat_role) {
        const actual = yield service._getRoleUsers(role);
        assert(actual);
        assert.equal(role.scope, actual.scope);
        assert(actual.users);
        assert.equal(2, actual.users.length);
      }
    });

  });

  describe('[TEST Timer Rule Task _createUserRuleTask]', () => {
    let rules = [],
      acatulExec = 0;

    beforeEach(() => {
      acatulExec = 0;
      rules = roles[0].timer_rules.filter(service._match);

      const mq = app.mqPublisher.bmsRuleTask;
      mock(mq, 'publish', function* (message) {
        acatulExec++;
        assert(message);
      });
    });

    it('no user rule message', function* () {
      const data = { scope: 'plat', users: [] };
      yield service._createUserRuleTask(rules, data);

      const expectedExec = data.users.length * rules.length;
      assert.equal(expectedExec, acatulExec);

    });

    it('plat user rule message', function* () {
      const data = { scope: 'plat', users: users.plat_users };
      yield service._createUserRuleTask(rules, data);

      const expectedExec = data.users.length * rules.length;
      assert.equal(expectedExec, acatulExec);
    });

    it('plat user rule message create_time isAfter end_time', function* () {
      const now = new Date();
      rules = [{
        category: 0,
        trigger: { end: '12:00', days: 0, start: '13:00:00', cycle: now.getHours(), rule: 'day' },
        reminder: { time_diff: 1800, alert_time: null, rule_name: '截止前半小时', rule_key: 2 },
        content: '每天创建定时任务',
      }, {
        category: 0,
        trigger: { end: '12:00', days: 2, start: '07:00:00', cycle: now.getDay(), rule: 'week' },
        reminder: { time_diff: 1800, alert_time: null, rule_name: '截止前半小时', rule_key: 2 },
        content: `每周${now.getDay()}创建定时任务`,
      },
      ];

      const data = { scope: 'plat', users: users.plat_users };
      yield service._createUserRuleTask(rules, data);

      const expectedExec = data.users.length;
      assert.equal(expectedExec, acatulExec);
    });
  });

  describe('[TEST Timer Rule Task create]', () => {

    let acatulExec = 0;

    beforeEach(() => {
      acatulExec = 0;

      mock(service, '_getRoleList', function* () {
        return roles.filter(role => RoleScope.plat === role.scope);
      });

      const mq = app.mqPublisher.bmsRuleTask;
      mock(mq, 'publish', function* (message) {
        acatulExec++;
        assert(message);
      });
    });

    it(' mqPublish send message ', function* () {

      const expectedRoles = yield service._getRoleList();
      let expectedExec = 0;
      for (const trole of expectedRoles) {
        const trules = trole.timer_rules.filter(service._match);
        const dataUser = yield service._getRoleUsers(trole);
        expectedExec += trules.length * dataUser.users.length;
      }

      yield service.create();
      assert.equal(expectedExec, acatulExec);
    });
  });

});
