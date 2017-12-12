'use strict';

module.exports = app => {
  const mongoose = app.mongoose;

  const eventTask = new mongoose.Schema({
    event_type: Number, // 事件详细类别
    related: {
      id: String, // 事件任务关联id
      func_model: Number, // 功能模型 模块编号
    },
    executor: {
      id: String,
      name: String,
      from: String,
    },
    status: { type: Number, default: 0 }, // 事件任务状态 0 初始化、1 已完成、2 已删除、10 重新发布、11已发布
    context: {},
    rule: {
      task_type: String, // 任务类型
      content: String, // 任务内容
      extend: {}, // 任务扩展
      trigger: {
        rule: String, // now 立刻、cycle 周期性发布, delay 推迟一个cycle周期后只发布一次
        cycle: {
          cate: String, // hours, days, weeks, months, years
          value: Number,
        },
        start: String, // 生成任务开始时间 h:m:s, 空为当前时间
        end: {
          cate: String, // minute, hour, day ...
          value: Number,
        },
        end_time: String, // 任务结束时间 HH:mm:SS 设置固结束定值, 默认为空
      },
      reminder: {
        rule_key: String,
        rule_name: String,
        time_diff: Number,
      },
    },

    create_time: { type: Date, default: Date.now }, // 创建时间
    update_plan_time: { type: Date, default: Date.now }, // 更新计划时间
    last_cycle_time: Date, // 上次周期触发生成任务时间, 如果角色事件规则设置了pre_cycle，计算上次的周期任务触发时间
    cycle_logs: [{ _id: false, publish_time: Date, finish_time: Date }],
  });

  eventTask.index({ event_type: 1 });
  eventTask.index({ status: 1 });
  eventTask.index({ last_cycle_time: 1 });
  eventTask.index({ 'rule.trigger.rule': 1 });

  return mongoose.model('event_task', eventTask);
};
