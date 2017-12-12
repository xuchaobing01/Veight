'use strict';
module.exports = app => {
  const ctx = app.createAnonymousContext();
  class BillConsumer {
    * createBill(msg) {
      const { fields, properties, content } = msg;
      app.logger.info(`[BillConsumer] createBill ${content.toString()}`);
      const custService = JSON.parse(content);
      const result = yield ctx.getService('bill').notifyCreateBill(custService);
      return true;
    }
    * createBillAck(msg) {
      const { fields, properties, content } = msg;
      app.logger.info(`[BillConsumer] createBillAck ${content.toString()}`);
      const ackMsg = JSON.parse(content);
      const result = yield ctx.getService('custInteract').notifyCreateBillAck(ackMsg);
      return true;
    }

    * cancelBill(msg) {
      const { fields, properties, content } = msg;
      app.logger.info(`[CancelBill] cancelBill ${content.toString()}`);
      const custService = JSON.parse(content);
      const result = yield ctx.getService('bill').notifyCancelBill(custService);
      return true;
    }

    * cancelBillAck(msg) {
      const { fields, properties, content } = msg;
      app.logger.info(`[BillConsumer] cancelBillAck ${content.toString()}`);
      const ackMsg = JSON.parse(content);
      const result = yield ctx.getService('custInteract').notifyCancelBillAck(ackMsg);
      return true;
    }
  }
  return new BillConsumer();
};
