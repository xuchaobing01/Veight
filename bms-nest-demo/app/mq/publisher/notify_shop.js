'use strict';

const { exchange, router } = require('../const');
const BasePublisher = require('../basePublisher');

module.exports = mq => {
  class NotifyShopPublisher extends BasePublisher {

    getExchange() {
      return exchange.notifyShop;
    }

    * notify(msg) {
      console.log('!!! notify publisher_bee: notify | ', JSON.stringify(msg));

      try {
        this.publisher(router.notifyShop, JSON.stringify(msg));
        return true;
      } catch (exception) {
        console.log('!!! notify publisher_shop: notify-exception');
        return false;
      }
    }
  }

  return new NotifyShopPublisher(mq);
};
