'use strict';

const { exchange, router } = require('../const');
const BasePublisher = require('../basePublisher');

module.exports = mq => {
  class NotifyBeePublisher extends BasePublisher {

    getExchange() {
      return exchange.notifyBee;
    }

    * notify(msg) {
      console.log('!!! notify publisher_bee: notify | ', JSON.stringify(msg));

      try {
        this.publisher(router.notifyBee, JSON.stringify(msg));
        return true;
      } catch (exception) {
        console.log('!!! notify publisher_bee: notify-exception');
        console.log(exception);
        return false;
      }
    }
  }

  return new NotifyBeePublisher(mq);
};
