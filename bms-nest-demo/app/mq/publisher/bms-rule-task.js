'use strict';

const { exchange } = require('../const');
const BasePublisher = require('../basePublisher');

module.exports = mq => {
  class BmsRuleTask extends BasePublisher {

    getExchange() {
      return exchange.RuleTask;
    }

    * publish(msg) {
      this.publisher('create', JSON.stringify(msg));
      return true;
    }
  }

  return new BmsRuleTask(mq);
};
