'use strict';

const Koa = require('koa');
const app = new Koa();

const getRabbitmq = require('./lib/getChannel');

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);

/**
 * rabbitmq init & publisher message & consumer message
 */
app.use(async () => {
  const mq = await getRabbitmq.init();
  console.log(mq);
});

require('./publisher').start('q', 'publisher message');

require('./consumer').start('q');

module.exports = app;
