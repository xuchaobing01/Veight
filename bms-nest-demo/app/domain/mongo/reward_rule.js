'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const rewardRuleSchema = new mongoose.Schema({
    shop: {// 4s店
      id: String, // id
      name: String, // name
    },
    rule: [{/** 规则 */
      category: { type: Number },
      mode: { type: Number }, // 提成方式 0：固定金额  1：百分比，
      immobile: {// 固定金额
        income_from: { type: Number }, // 提成金额依据：0：售价 1：指导价
        section: [{
          floor: { type: Number },
          upper: { type: Number },
          value: { type: Number },
        }],
      },
      percent: { type: Number },
    }],
    status: { type: Number, default: 0 }, // 状态 0：未启用  -1: 不可用  1: 可用
    creator: {
      id: String, // id
      name: String, // name
      from: String, // 类型
    }, // 创建人
    create_time: { type: String }, // 创建时间
    begin_time: { type: String }, // 生效开始时间
    end_time: { type: String }, // 生效结束时间
    delete: { type: Number, default: 0 }, // 逻辑删除 1: 删除， 0: 正常
  });
  return mongoose.model('reward_rule', rewardRuleSchema);
};
