'use strict';
class BasePublisher {
  constructor(mq) {
    this.mq = mq;
    this.publishServer = this.mq.createPublishServer();
  }
  getExchange() {
    return null;
  }
  publisher(routingKey, message) {
    this.publishServer.setExchange(this.getExchange());
    this.publishServer.publisher(routingKey, message);
  }
}
module.exports = BasePublisher;
