'use strict';

const rabbitmq = require('./lib/getChannel');

const start = async (q) => {
  try {
    const ch = await rabbitmq.getCh();
    await ch.assertQueue(q);
    return ch.consume(q, async (msg) => {
      console.log('consumer: ', new Date(), msg.content.toString());
      ch.ack(msg);
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { start };
