'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/mq/timer-task.test.js', () => {

  it('[ TEST timer task publisher && customer]', function* () {
    const exceptedTask = {
      creator: { id: '-1', name: '系统', from: 'sys' },
      create_time: '2017-09-21 10:10:10',
      end_time: '2017-09-21 10:10:10',
      reminder: { rule_name: '提前一小时', alert_time: null },
      content: '测试定时任务内容',
      executor: {
        user: { id: 'test_id', name: 'test_name', from: 'plat' },
        leader: { id: 'test_leader_id', name: 'test_leader_name', from: 'plat' },
      },
    };

    app.mockService('task', 'create', function* (task) {
      assert(task);
      assert.deepEqual(exceptedTask, task);
      console.log(JSON.stringify(task));
    });

    yield app.mqPublisher.bmsRuleTask.publish(exceptedTask);

    sleep(5000);
  });

});

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
