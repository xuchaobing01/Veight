'use strict';

module.exports = app => {

  class NotifyBeeConsumer {
    * notify(msg) {
      const notifyMSg = JSON.parse(msg.content.toString());
      console.log('!!! notify consumer_bee: notify', JSON.stringify(notifyMSg));
      return true;
    }
  }

  return new NotifyBeeConsumer();
};
