'use strict';

module.exports = app => {
  const mongoose = app.mongoose;

  const custSchema = new mongoose.Schema({
    belong: { // 所属信息
      id: { type: String, required: true },
      from: { type: String, required: true }, // bee、4s店、平台
      name: { type: String, required: true }, // 用户名
    },
    shop: [ // 所属4s店
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    delete: { type: Number, default: 0 },
    interact_update_time: { type: Date, required: false }, // 互动跟新时间
    create_time: { type: Date, required: false }, // 创建时间
    info: { // 客户基本信息
      name: { type: 'String', required: true }, // 客户姓名
      brith: Date, // 出生日期
      sex: { type: 'Number', required: true }, // 性别
      eduction: Number, // 学历
      wechat: String, // 微信
      email: String, // 邮箱
      hobby: [ Number ], // 爱好
      tel: { type: String, required: true }, // 电话
      family: { // 家庭信息
        situation: Number, // 家庭类型
        earning: Number, // 家庭总收入
        location: { // 家庭住址
          province: String, // 省
          province_name: String, // 省
          city: String, // 市县
          city_name: String, // 市县
          region: String, // 区镇
          region_name: String, // 区镇
          addr: String, // 具体地址
        },
      },
      job: { // 工作信息
        occupation: Number, // 职位
        company: String, // 公司
        location: { // 公司地址
          province: String, // 省
          province_name: String, // 省
          city: String, // 市县
          city_name: String, // 市县
          region: String, // 区镇
          region_name: String, // 区镇
          addr: String, // 具体地址
        },
      },
      tags: [ Number ], // 标签
      comment: String, // 备注
    },
    own_car: [ // 拥有车辆
      {
        brand_id: { type: Number, required: true }, // 车品牌
        brand_name: { type: String, required: true },
        type_id: { type: Number, required: true }, // 车系
        type_name: { type: String, required: true },
        model_id: { type: Number, required: true }, // 车型
        model_name: { type: String, required: true },
        import: Number, // 进口车、非进口车
        car_color: Number, // 颜色
        car_inner_color: Number, // 内饰颜色
        plate_location: { // 车牌所属地
          province: String, // 省
          province_name: String, // 省
          city: String, // 市县
          city_name: String, // 市县
          region: String, // 区镇
          region_name: String, // 区镇
        },
        plate_time: Date, // 首次上牌时间
        price: Number, // 价格
        per_mileage: Number, // 每年平均里程数
        is_resell: Number, // 是否出手
        resell_date_type: Number, // 计划出手时间: 一年内、一周内。。。
        delete: { type: Number, default: 0 },
      },
    ],
    car_plan: [ // 购车计划
      {
        use_to: { type: Number, required: true }, // 购车目的
        car_type: { type: Number, required: true }, // 购车类型
        prefer_cars: [
          {
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
        budget_type: { type: Number, required: true }, // 预算类型: 5-10万、不限。。。
        buy_date_type: { type: Number, required: true }, // 计划购车时间: 一年内、一月内
        brand_type: Number, // 偏好品牌类型: 法系、德系。。。
        prefer_side: [ Number ], // 关注点: 舒适、空间。。。
        create_time: Date, // 计划创建时间
        is_transfer: { type: Number, default: 0 }, // 是否置换购车
        transfer_cars: [ String ], // 被置换车辆(is_transfer = true时)
        delete: { type: Number, default: 0 }, // 变成历史计划
      },
    ],
    relate_cust: [ // 关联客户
      {
        _id: false,
        cust_id: String, // 客户id
        name: String, // 客户姓名
        relation: String, // 关系
        tel: String, // 电话
        location: { // 居住地址
          province: String,
          province_name: String,
          city: String,
          city_name: String,
          region: String,
          region_name: String,
          addr: String,
        },
      },
    ],
    time_line: [ // 时间线
      {
        processor: {
          id: { type: String, required: true },
          from: { type: String, required: true }, // bee、4s店、平台
          name: { type: String, required: true }, // 用户名
        },
        create_time: { type: Date, required: true },
        interact_time: { type: Date, required: true }, // 互动时间
        type: { type: Number, required: true }, // 时间线类型
        from_id: { type: String, required: true }, // 数据源id
        abstract: { type: mongoose.Schema.Types.Mixed, required: true }, // 描述
        invalid_belong: { // 作废人信息
          id: { type: String, required: false },
          from: { type: String, required: false }, // bee、4s店、平台
          name: { type: String, required: false }, // 用户名
        },
        invalid_reason: { type: String, required: false }, // 作废理由
        invalid_time: { type: Date, required: false }, // 作废时间
        delete: { type: Number, default: 0 },
      },
    ],

  });

  return mongoose.model('cust', custSchema);
};
