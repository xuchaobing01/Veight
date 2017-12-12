'use strict';

// const Schema = require('mongoose').Schema;
// 账户-账单
module.exports = app => {
  const mongoose = app.mongoose;
  const accountBillSchema = new mongoose.Schema({
    user: { // bee信息
      id: String, // 用户id
      name: String, // 姓名
      from: String, // 类型
    },
    plat_pay: { // 平台支付信息
      status: { type: String, default: 0 }, // 状态 0: 待支付  2：已支付   -1: 已取消
      time: { type: String }, // 支付时间
      user: {// 操作人
        id: String, // 用户id
        name: String, // 姓名
        from: String, // 类型
      },
    },
    shop: {
      id: String, // 4s店id
      name: String, // 4s店名
    },
    shop_pay: { // 4S店支付信息
      status: { type: String, default: 0 }, // 状态 0: 待支付  2：已支付   -1: 已取消
      time: { type: String }, // 支付时间
      user: {// 支付人
        id: String, // 用户id
        name: String, // 姓名
        from: String, // 类型
      },
    },
    cust_service: {// 客户服务信息
      id: { type: String }, // id
      customer: {// 客户
        id: String, // id
        name: String, // 客户姓名
      },
      list: [// 订单明细
        {
          category: { type: Number }, // 订单类型
          price: { type: Number }, // 价格
          guide_price: { type: Number }, // 指导价
        },
      ],
      sale_time: { type: String }, // 订单交易时间
      create_time: { type: String }, // 订单创建时间
      creator: { // 订单创建人
        id: String,
        name: String,
        from: String,
      },
      ack: {
        status: { type: String, default: 0 }, // 响应状态。用于记录消息通知是否成功
        message: { type: String }, // 响应信息。用于记录消息通知失败时的详情
        time: { type: String }, // 创建时间
      },
    },
    income: { type: Number }, // 总收益
    reward: [{ // 奖励
      category: { type: Number }, // 分类
      price: { type: Number }, // 金额
      income: { type: Number }, // 收益
      rule: { // 规则
        id: { type: String }, // 奖励规则id
        immobile: {/** 区间规则 */
          income_from: { type: String }, // 提成金额依据：0：售价 1：指导价
          section: { // 规则
            floor: { type: Number },
            upper: { type: Number },
            value: { type: Number },
          },
        },
        percent: { type: Number },
      },
    }],
    operate_list: [{ // 操作记录用于记录相关操作日志
      user: {
        id: String, // 用户id
        name: String, // 姓名
        from: String, // 类型
      },
      action: { type: Number }, // 分类 创建、支付
      content: { type: String }, // 内容
      time: { type: String }, // 操作时间
    }],
    create_time: { type: String }, // 创建时间
    status: { type: Number, default: 0 }, // 账单状态 0: 未支付  1：处理中  2：已支付  -1：已取消
    delete: { type: Number, default: 0 }, // 逻辑删除 1: 删除， 0: 正常
  });
  // accountBillSchema.index({ user.id: 1, account_id: 1 });
  return mongoose.model('account_bill', accountBillSchema);
};
