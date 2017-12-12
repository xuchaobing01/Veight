'use strict';

// 支付记录
module.exports = app => {
  const mongoose = app.mongoose;
  const accountPaySechema = new mongoose.Schema({
    user: {
      id: String, // 用户id
      name: String, // 姓名
      from: String, // 类型
    },
    shop: {// 4s店
      id: String, // id
      name: String, // 姓名
    },
    bill: [{
      id: String,
      income: { type: Number }, // 收益
    }],
    total_income: { type: Number }, // 总金额
    create_time: { type: Date, default: Date.now }, // 创建时间
    pay: {// 支付信息
      user: { // 支付人信息
        id: String, // 用户id
        name: String, // 姓名
        from: String, // 类型
      },
      time: { type: Date, default: Date.now }, // 支付时间
    },
    status: { type: String, default: 1 }, // 状态 0: 未支付  1：已支付
  });
  return mongoose.model('account_pay', accountPaySechema);
};
