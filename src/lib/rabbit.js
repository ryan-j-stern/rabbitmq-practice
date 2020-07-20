const amqp = require("amqplib");

const connection = amqp.connect("amqp://localhost");

async function publish(exchange, payload) {
  try {
    const conn = await connection;

    const channel = await conn.createChannel();

    await channel.assertExchange(exchange, "fanout", { durable: true });

    // await channel.assertQueue(queue, { durable: true });
    console.log(`[X] Sent message to ${exchange}`);
    return await channel.publish(exchange, "", Buffer.from(payload));
    // return await channel.sendToQueue(queue, Buffer.from(payload));
  } catch (e) {
    console.log(e);
  }
}

async function subscribe(exchange, queue) {
  try {
    const conn = await connection;

    const channel = await conn.createChannel();

    await channel.assertExchange(exchange, "fanout", { durable: true });
    const q = await channel.assertQueue(queue, { exclusive: false });

    await channel.bindQueue(q.queue, exchange, "");
    // await channel.assertQueue(queue, { durable: true });
    return { channel, q: q.queue };
    // return await channel.consume(
    //   q.queue,
    //   msg => {
    //     // Depending on the queue, either print out the message or return it to be worked
    //     console.log(`${msg.content.toString()} from ${q.queue}`);
    //     return msg.content.toString();
    //   },
    //   { noAck: true }
    // );
  } catch (e) {
    console.log(e);
  }
}

module.exports = { connection, publish, subscribe };
