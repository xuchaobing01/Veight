'use strict';
module.exports = app => {
  class BmsTaskrConsumer {
    * newCarTask(msg) {
      console.log(" [newCarTask] %s:'%s'",
        msg.fields.routingKey,
        msg.content.toString());
      return true;
    }
  }
  return new BmsTaskrConsumer();
};
