'use strict';

const rabbitmq = require('./lib/getChannel');

const start = async (q, msg) => {
  try {
    const ch = await rabbitmq.getCh();
    await ch.assertQueue(q);
    await ch.sendToQueue(q, Buffer.from(msg));
  } catch (err) {
    console.error(err);
  }
};

module.exports = { start };
