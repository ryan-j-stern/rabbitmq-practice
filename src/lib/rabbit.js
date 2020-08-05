const amqp = require("amqplib");

// const connection = amqp.connect(process.env.AMQP_URL);
const connection = amqp.connect("amqp://localhost");

async function publish(exchange, type = "fanout", routingKey = "", payload) {
  try {
    const conn = await connection;
    const channel = await conn.createChannel();

    await channel.assertExchange(exchange, type, { durable: true });

    console.log(`[X] Sent message to ${exchange}`);

    return await channel.publish(exchange, routingKey, Buffer.from(payload));
  } catch (e) {
    console.log(e);
  }
}

async function subscribe(exchange, type = "fanout", routingKey = "", queue) {
  try {
    const conn = await connection;
    const channel = await conn.createChannel();

    await channel.assertExchange(exchange, type, { durable: true });
    const q = await channel.assertQueue(queue, { exclusive: false });

    await channel.bindQueue(q.queue, exchange, routingKey);

    return { channel, q: q.queue };
  } catch (e) {
    console.log(e);
  }
}

module.exports = { connection, publish, subscribe };
