// 'use strict';
//
// const { app, mock, assert } = require('egg-mock/bootstrap');
// const { CustData } = require('../../mock-data/cust/cust.js');
//
// describe('### cust public function test', () => {
//   let custservice,
//     custmodel;
//   before(() => {
//     const ctx = app.mockContext();
//     custservice = ctx.service.cust;
//     custmodel = ctx.getModel('cust');
//     assert(custservice);
//     assert(custmodel);
//   });
//
//
//   describe('[TEST] checkDataChanged', () => {
//     before(function* () {
//       yield custmodel.insertMany(CustData);
//     });
//     after(function* () {
//       for (const cust of CustData) {
//         yield custmodel.remove({ _id: cust._id });
//       }
//     });
//
//     it('should return \'TRANSFER_CAR_CHANGED\' when just change transfer_cars', function* () {
//       const data = CustData[0];
//       data.car_plan[0].transfer_cars[0] = '5a14f9e287879d2c9c0f6100';
//       const code = yield custservice.checkDataChanged(
//         'carplan', data._id, data.car_plan[0]._id, data.car_plan[0]);
//       assert.equal(code, 'TRANSFER_CAR_CHANGED');
//     });
//
//     it('should return \'BOTH_CHANGED\' when change transfer_cars and other data', function* () {
//       const data = CustData[0];
//       data.car_plan[0].transfer_cars[0] = '5a14f9e287879d2c9c0f6100';
//       data.car_plan[0].use_to = 3;
//       const code = yield custservice.checkDataChanged(
//         'carplan', data._id, data.car_plan[0]._id, data.car_plan[0]);
//       assert.equal(code, 'BOTH_CHANGED');
//     });
//
//     it('should return \'PLAN_CHANGED\' when change plan data except transfer_cars', function* () {
//       const data = CustData[0];
//       data.car_plan[0].use_to = 3;
//       const code = yield custservice.checkDataChanged(
//         'carplan', data._id, data.car_plan[0]._id, data.car_plan[0]);
//       assert.equal(code, 'PLAN_CHANGED');
//     });
//
//     it('should return \'RESELL_DATE_CHANGED\' when change owncar resell_date_type', function* () {
//       const data = CustData[0];
//
//       data.own_car[0].resell_date_type = 2;
//
//       const code = yield custservice.checkDataChanged(
//         'owncar', data._id, data.own_car[0]._id, data.own_car[0].resell_date_type);
//
//       assert.equal(code, 'RESELL_DATE_CHANGED');
//     });
//
//     it('should return \'NO_CHANGED\' when do nothing', function* () {
//       const data = CustData[0];
//
//       const code1 = yield custservice.checkDataChanged(
//         'owncar', data._id, data.own_car[0]._id, data.own_car[0]);
//       assert.equal(code1, 'NO_CHANGED');
//
//       const code2 = yield custservice.checkDataChanged(
//         'carplan', data._id, data.car_plan[0]._id, data.car_plan[0]);
//       assert.equal(code2, 'NO_CHANGED');
//     });
//
//   });
//
// });
//
