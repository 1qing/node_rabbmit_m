const amqp = require('amqplib');
const EventEmitter = require('events');

const config = {
  rabbitmq: {
    rabbitmq: {
      protocol: 'amqp',
      hostname: '127.0.0.1',
      username: 'guest',
      password: 'guest',
      port: 5672,
      vhost: '/',
    },
  }
};

class RabbitMQ extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.connected = false;
  }
  async connect() {
    try {
      this._conn = await amqp.connect(config.rabbitmq);
      this._conn.on('close', () => {
        this.connected = false;
        this.connect();
      });
      this.connected = true;
      this.emit('connect', this._conn);
    } catch (e) {
      this.emit('error', e);
    } finally {
      this.conn = this._conn;
    }
  }
  async ready(cb) {
    if (cb) {
      if (this.connected) {
        process.nextTick(cb);
      } else {
        this.once('connect', cb);
      }
    } else {
      if (this.connected) {
        return Promise.resolve();
      } else {
        return new Promise((resolve, reject) => {
          this.once('connect', resolve);
        });
      }
    }
  }
}

let rabbit;
let ch;

exports.init = async (options) => {
  rabbit = new RabbitMQ(options);
  await rabbit.connect();
};

exports.getCh = async () => {
  if (ch) {
    return ch;
  }
  if (!rabbit || !rabbit.connected) {
    rabbit = new RabbitMQ();
    await rabbit.connect();
  }
  ch = await rabbit.conn.createChannel();
  ch.on('close', () => {
    ch = null;
  });
  return ch;
};
