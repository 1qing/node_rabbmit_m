'use strict';

const rabbitmq = require('./lib/getChannel');

(setTimeout(async () => {
  let q = 'bbbbbbbbb';
  try {
    const ch = await rabbitmq.getCh();
    await ch.assertQueue(q);
    return ch.consume(q, async (msg) => {
      console.log(new Date(), msg.content.toString());
      ch.ack(msg);
    });
  } catch (err) {
    console.error(err);
  }
}, 3000));
