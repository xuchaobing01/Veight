'use strict';

const CustData = [
  {
    _id: '5a14f09e87879d2c9c0f6e0e',
    interact_time: '2017-11-22',
    create_time: '2017-11-22',
    time_line: [],
    relate_cust: [],
    car_plan: [
      {
        _id: '5a1526e494f85c3fa40855da',
        use_to: 2,
        car_type: 2,
        budget_type: 5,
        buy_date_type: 1,
        brand_type: 1,
        delete: 0,
        transfer_cars: [
          '5a14f9e287879d2c9cffffff',
        ],
        is_transfer: 1,
        prefer_side: [
          4,
        ],
        prefer_cars: [
          {
            brand_id: 3,
            brand_name: '宝马x1',
            type_id: 145,
            type_name: '马巷d300',
            model_id: 5421,
            model_name: 'd300 尊享',
          },
        ],
      },
    ],
    own_car: [
      {
        _id: '5a14f9e287879d2c9c0f6e12',
        price: 520000,
        plate_time: '2018-09-10',
        car_inner_color: 2,
        import: 1,
        car_color: 1,
        model_name: '菲亚特高级黑',
        model_id: 41375,
        type_name: '菲亚特111',
        type_id: 220,
        brand_name: '菲亚特',
        brand_id: 1,
        resell_date_type: 1,
        is_resell: 1,
        delete: 1,
        plate_location: {
          region: '荒野区',
          city: '晋城市',
          province: '陕西省',
        },
      },
    ],
    info: {
      brith: '2017-10-31',
      eduction: 2,
      tel: '12311451784',
      sex: 1,
      name: '测试张小凡',
      tags: [],
      hobby: [],
    },
    delete: 0,
    shop: [
      {
        _id: '59cb447221ed980024be5db4',
        name: '河南福鑫天道汽车销售服务有限公司',
      },
    ],
    belong: {
      id: '59cc85247be73c002a1400d8',
      name: '史子超',
      from: 'bee_user',
    },
    __v: 0,
  },
];

module.exports = { CustData };
