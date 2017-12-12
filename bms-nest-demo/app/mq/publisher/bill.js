'use strict';
const { exchange, router } = require('../const');
const BasePublisher = require('../basePublisher');
module.exports = mq => {
  class BillServicePublisher extends BasePublisher {
    getExchange() {
      return 'bill';
    }
    // 新增账单
    * createBill(msg) {
      this.publisher(router.createBill, JSON.stringify(msg));
      return true;
    }

    // 新增账单响应
    * createBillAck(msg) {
      this.publisher(router.createBillAck, JSON.stringify(msg));
      return true;
    }

    // 取消账单
    * cancelBill(msg) {
      this.publisher(router.cancelBill, JSON.stringify(msg));
      return true;
    }

    // 取消账单响应
    * cancelBillAck(msg) {
      this.publisher(router.cancelBillAck, JSON.stringify(msg));
      return true;
    }
  }
  return new BillServicePublisher(mq);
};
