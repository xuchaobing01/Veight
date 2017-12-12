'use strict';
const { exchange, router } = require('../const');
const BasePublisher = require('../basePublisher');
module.exports = mq => {
  class BmsOrderPublisher extends BasePublisher {
    getExchange() {
      return 'task';
    }
    * newCar(msg) {
      this.publisher(router.newCar, msg);
      return true;
    }
  }
  return new BmsOrderPublisher(mq);
};
