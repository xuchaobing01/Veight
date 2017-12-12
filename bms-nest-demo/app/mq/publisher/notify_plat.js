'use strict';

const { exchange, router } = require('../const');
const BasePublisher = require('../basePublisher');

module.exports = mq => {
  class NotifyPlatPublisher extends BasePublisher {

    getExchange() {
      return exchange.notifyPlat;
    }

    * notify(msg) {
      console.log('!!! notify publisher_bee: notify | ', JSON.stringify(msg));

      try {
        this.publisher(router.notifyPlat, JSON.stringify(msg));
        return true;
      } catch (exception) {
        console.log('!!!notify publisher_plat: notify-exception');
        return false;
      }
    }
  }

  return new NotifyPlatPublisher(mq);
};
