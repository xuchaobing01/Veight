'use strict';
// 任务
module.exports = app => {
  const mongoose = app.mongoose;
  const { ObjectId } = mongoose.Schema.Types;
  const taskSchema = new mongoose.Schema({
    creator: { id: String, name: String, from: String }, // 创建人
    create_time: { type: String }, // 创建时间
    update_time: { type: String }, // 修改时间
    content: { type: String }, // 内容描述
    attach: [{ _id: false, url: String, mole: String }], // 附件
    begin_time: { type: String }, // 开始时间
    end_time: { type: String }, // 要求完成时间
    finish_time: String, // 创建人结束操作时间
    tracke_time: { type: String }, // 下次跟进时间
    delete: { type: Number, default: 0 }, // 是否查看
    task_type: { type: Number, default: 0 }, // 任务类型 默认为手动任务
    execute: { // 执行情况
      count: { type: Number }, // 执行者数量
      finish_count: { type: Number, default: 0 }, // 完成数量
    },
    executor: [
      {// 执行人
        _id: false,
        user: {
          id: String, // 执行人id, refPath: from
          name: String, // 执行人姓名
          from: String, // 类型
        },
        leader: {// 上级
          id: String, // 执行人id, refPath: from
          name: String, // 执行人姓名
          from: String, // 类型
        },
        is_read: { type: Number, default: 0 }, // 是否查看
        read_time: String, // 查看时间
        status: { type: Number, default: 20 }, // 状态
        content: String, // 内容
        attach: [{// 执行人内容
          mole: String, // 文件类型
          url: String, // 图片地址
        }],
        delete: { type: Number, default: 0 }, // 删除
        finish_time: { type: String }, // 完成时间
        extend: {// 扩展信息
          is_entry: { type: Boolean }, // 是否进店
          entry_time: { type: String }, // 进店时间
          is_order: { type: Boolean }, // 是否预约
          kilometer: { type: String }, // 已行驶公里数
          sold_time: { type: String }, // 已有车辆出手时间
          expert: {// 销售专家/服务专家
            id: String,
            name: String,
            from: String,
          },
          is_maintain: { type: Boolean }, // 是否一周内保养
          car_plan: {// 购车计划
            use_to: { type: Number }, // 购车目的
            car_type: { type: Number }, // 购车类型
            prefer_cars: [
              {
                _id: false,
                brand_id: Number, // 车品牌
                brand_name: String,
                type_id: Number, // 车系
                type_name: String,
                model_id: Number, // 车型
                model_name: String,
                car_color: Number, // 颜色
                car_inner_color: Number, // 内饰颜色
              },
            ],
            budget_type: { type: Number }, // 预算类型: 5-10万、不限。。。
            buy_date_type: { type: Number }, // 计划购车时间: 一年内、一月内
            brand_type: Number, // 偏好品牌类型: 法系、德系。。。
            prefer_side: [ Number ], // 关注点: 舒适、空间。。。
          },
        },
      }],
    reminder: { rule_key: Number, rule_name: String, alert_time: String }, // 提醒
    status: { type: Number, default: 20 }, // 状态
    message: [{/** 回复内容 */
      _id: false,
      user: {
        id: String,
        name: String, // name
        from: String, // 类型
      },
      action: { type: Number, default: 0 }, // 任务动作
      content: String, // 内容
      time: String, // 时间
      entry: String, // url
    }],
    from_task: { type: String }, // 父任务
    tracke_level: { type: Number, default: 0 }, // 跟进级别
    follower: [{// 关注者
      _id: false,
      user: {
        id: String,
        name: String, // name
        from: String, // 类型
      },
      create_time: String, // 创建时间
      delete: { type: Number, default: 0 }, // 删除
      // tracke_level 跟进人级别。默认关注人的跟进级别为1。当任务的跟进级别升级时，此跟进级别就是当前需要提醒的跟进人
      tracke_level: { type: Number, default: 1 },
      tracked: [// 被跟进人，初始时为关注人的所有下级，下级人员执行完成操作的同时数组中清除相应的执行人，直到数组为空时说明被跟进人已经全部完成
        {
          _id: false,
          id: String,
          name: String, // name
          from: String,
        },
      ],
      tracked_follower: [// 触发跟进升级的下级的所有关注人，下级关注人员执行完跟进操作的同时数组中清除相应的关注人，直到数组为空时说明关注人已经全部进行了根据
        {
          _id: false,
          id: String,
          name: String, // name
          from: String,
        },
      ],
      status: { type: Number, default: 20 }, // 状态
      content: String, // 内容
      finish_time: String, // 完成时间
      attach: [{
        _id: false,
        mole: String, // 文件类型
        url: String, // 文件路径
      }],
    }],
    extend: {
      cust: {// 客户资料
        name: { type: String },
        id: { type: String },
      },
      shop: {// 4s店信息
        name: { type: String },
        id: { type: String },
      },
      car_plan: {
        id: { type: String },
      },
      new_car: [// 新车
        {
          _id: { type: String },
          name: { type: String },
        },
      ],
      old_car: [// 旧车
        {
          _id: { type: String },
          name: { type: String },
        },
      ],
      event_task: {// 事件任务后发布自动完成或者重新开始发布周期
        event_type: { type: Number },
        related: {
          id: { type: String },
          func_model: { type: Number },
        },
        _id: { type: String },

      },
    },
  });
  return mongoose.model('task', taskSchema);
};
