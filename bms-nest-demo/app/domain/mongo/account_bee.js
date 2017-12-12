'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const accountBeeSchema = new mongoose.Schema({
    user: {
      id: String, // 用户id
      name: String, // 姓名
      from: String, // 类型
    },
    shop: {// 4s店
      id: String, // id
      name: String, // 姓名
    },
    total_income: { type: Number }, // 总收入
    unpaid: { type: Number }, // 未支付
    paid: { type: Number }, // 已支付
    status: { type: String, default: 1 }, // 状态 1: 可用 0: 不可用
  });
  return mongoose.model('account_bee', accountBeeSchema);
};
