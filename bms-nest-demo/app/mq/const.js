'use strict';

/**
 * Const Interface
 */
function Const() { }

Const.exchange = {
  notifyBee: 'notifyBee',
  notifyShop: 'notifyShop',
  notifyPlat: 'notifyPlat',

  bmsOrder: 'bmsOrder',
  bmsTask: 'bmsTask',
  RuleTask: 'bmsRuleTask',
};

Const.router = {
  notifyBee: 'notifyBee',
  notifyShop: 'notifyShop',
  notifyPlat: 'notifyPlat',
  createBill: 'createBill',
  createBillAck: 'createBillAck',
  cancelBill: 'cancelBill',
  cancelBillAck: 'cancelBillAck',
  newCar: 'newCar',
  oldCar: 'oldCar',
};

module.exports = exports = Const;
