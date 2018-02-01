'use strict';

const open = require('amqplib').connect('amqp://localhost');
// Publisher 生产者
(async (q, msg) => {
    try {
        const open = await require('amqplib').connect('amqp://localhost');
        const ch = await open.createChannel();
        ch.assertQueue(q);
        ch.sendToQueue(q, Buffer.from(msg));
    } catch (err) {
        console.log(err);
    }
})('bbbbbbbbb', 'bbbbbbbbbbbbbbbbbbbbbbbbbbb');

// Consumer 消费者
open.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    let q = 'bbbbbbbbb';
    return ch.assertQueue(q).then(function (ok) {
        return ch.consume(q, function (msg) {
            if (msg !== null) {
                console.log('ack', msg.content.toString());
                ch.ack(msg);
            }
        });
    });
}).catch(console.warn);
