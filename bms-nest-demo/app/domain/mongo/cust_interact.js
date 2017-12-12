'use strict';

// 新车销售
const new_car_sell = {
  brand_id: Number,
  brand_name: String,
  type_id: Number,
  type_name: String,
  model_id: Number,
  model_name: String,
  import: Boolean, // 进口车：true；非进口车：false；
  car_guide_price: Number,
  car_color: Number,
  car_inner_color: Number,
  car_price: Number,
  car_vin: String,
  plate_time: Date, // 首次上牌时间
  plate_location: { // 车牌所属地
    province: String, // 省
    province_name: String, // 省
    city: String, // 市县
    city_name: String, // 市县
    region: String, // 区镇
    region_name: String, // 区镇
  },
  installment_money: Number,
  installment_limit: Number,
  product_money: Number,
  product_item: String,
  insurance_agency: String,
  insurance_money: Number,
  warrant_limit: Number,
  warrant_money: Number,
  gift_money: Number,
  other_money: Number,
  des: String, // 其它互动情况
};
// 二手车销售
const old_car_sell = {
  brand_id: Number,
  brand_name: String,
  type_id: Number,
  type_name: String,
  model_id: Number,
  model_name: String,
  import: Boolean,
  car_color: Number,
  car_inner_color: Number,
  car_price: Number,
  car_vin: String,
  plate_time: Date, // 首次上牌时间
  transfer_num: Number, // 过户次数
  mileage: Number, // 行驶里程
  new_plate_location: { // 新牌上牌地址
    province: String, // 省
    province_name: String, // 省
    city: String, // 市县
    city_name: String, // 市县
    region: String, // 区镇
    region_name: String, // 区镇
  },
  new_plate_time: Date, // 新牌上牌地址
  installment_money: Number,
  installment_limit: Number,
  product_money: Number,
  product_item: String,
  insurance_agency: String,
  insurance_money: Number,
  warrant_limit: Number,
  warrant_money: Number,
  gift_money: Number,
  other_money: Number,
  des: String,
};
// 二手车收购
const old_car_purchase = {
  car_id: String,
  brand_id: Number,
  brand_name: String,
  type_id: Number,
  type_name: String,
  model_id: Number,
  model_name: String,
  import: Boolean,
  car_color: Number,
  car_inner_color: Number,
  plate_location: { // 车牌所属地
    province: String, // 省
    province_name: String, // 省
    city: String, // 市县
    city_name: String, // 市县
    region: String, // 区镇
    region_name: String, // 区镇
  },
  mileage: Number, // 行驶里程
  plate_time: Date, // 首次上牌时间
  transfer_num: Number, // 过户次数
  car_vin: String,
  purchase_price: Number, // 收购价
  des: String,
};
// 二手车置换
const old_car_exchange = {
  old: {
    car_id: String,
    brand_id: Number,
    brand_name: String,
    type_id: Number,
    type_name: String,
    model_id: Number,
    model_name: String,
    import: Boolean,
    car_color: Number,
    car_inner_color: Number,
    car_price: Number,
    car_vin: String,
    plate_time: Date, // 首次上牌时间
    plate_location: { // 车牌所属地
      province: String, // 省
      province_name: String, // 省
      city: String, // 市县
      city_name: String, // 市县
      region: String, // 区镇
      region_name: String, // 区镇
    },
    transfer_num: Number, // 过户次数
    mileage: Number, // 行驶里程
    purchase_price: Number, // 收购价
  },
  brand_id: Number,
  brand_name: String,
  type_id: Number,
  type_name: String,
  model_id: Number,
  model_name: String,
  import: Boolean,
  car_guide_price: Number,
  car_color: Number,
  car_inner_color: Number,
  car_price: Number,
  car_vin: String,
  plate_time: Date, // 首次上牌时间
  plate_location: { // 车牌所属地
    province: String, // 省
    province_name: String, // 省
    city: String, // 市县
    city_name: String, // 市县
    region: String, // 区镇
    region_name: String, // 区镇
  },
  installment_money: Number,
  installment_limit: Number,
  product_money: Number,
  product_item: String,
  insurance_agency: String,
  insurance_money: Number,
  warrant_limit: Number,
  warrant_money: Number,
  gift_money: Number,
  other_money: Number,
  des: String,
};
// 维修保养
const repair_maintain = {
  car_id: String,
  brand_id: Number,
  brand_name: String,
  type_id: Number,
  type_name: String,
  model_id: Number,
  model_name: String,
  import: Boolean,
  repair: {
    repair_money: Number,
    repair_item: String,
  },
  maintain: {
    maintain_type: Number,
    maintain_money: Number,
    maintain_item: String,
  },
  mileage: Number,
  des: String,
};
// 事故车维修
const accident_car_repair = {
  car_id: String,
  brand_id: Number,
  brand_name: String,
  type_id: Number,
  type_name: String,
  model_id: Number,
  model_name: String,
  import: Boolean,
  repair_money: Number,
  repair_item: String,
  des: String,
};
// 投诉
const complaint = {
  complaint_type: [ Number ],
  des: String, // 处理方式及结果
};
// 其它
const other = {
  des: String, // 互动情况
};


module.exports = app => {
  const mongoose = app.mongoose;
  const custInteractSchema = new mongoose.Schema({
    cust_id: { type: String, required: true }, // 客户id
    cust_belong: { // 所属信息
      id: { type: String, required: true },
      from: { type: String, required: true }, // bee、4s店、平台
      name: { type: String, required: true }, // 用户名
    },
    cust_name: { type: String, required: true },
    cust_tel: { type: String, required: true },
    belong: { // 创建互动用户的信息
      id: { type: String, required: true },
      from: { type: String, required: true }, // bee、4s店、平台
      name: { type: String, required: true }, // 用户名
    },
    invalid_belong: { // 作废人信息
      id: { type: String, required: false },
      from: { type: String, required: false }, // bee、4s店、平台
      name: { type: String, required: false }, // 用户名
    },
    invalid_reason: { type: String, required: false }, // 作废理由
    invalid_time: { type: Date, required: false }, // 作废时间
    bill_status: { type: Number, required: true }, // 对应单据状态
    interact_time: { type: Date, required: true }, // 互动时间
    delete: { type: Number, required: true, default: 0 },
    type: { type: Number, required: true, default: 0 }, // 互动类型
    type_name: { type: String, required: true, default: 0 }, // 互动名称

    // 以下为各服务类型定义
    // 新车销售
    new_car_sell,
    // 二手车销售
    old_car_sell,
    // 二手车收购
    old_car_purchase,
    // 二手车置换
    old_car_exchange,
    // 维修保养
    repair_maintain,
    // 事故车维修
    accident_car_repair,
    // 投诉
    complaint,
    // 其它
    other,
  }, { timestamps: { createdAt: 'create_time', updatedAt: false } });

  return mongoose.model('cust_interact', custInteractSchema);

};
