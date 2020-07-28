const amqp = require("amqplib");

const connection = amqp.connect(process.env.AMQP_URL);

async function publish(exchange, payload) {
  try {
    const conn = await connection;
    const channel = await conn.createChannel();

    await channel.assertExchange(exchange, "fanout", { durable: true });

    console.log(`[X] Sent message to ${exchange}`);
    return await channel.publish(exchange, "", Buffer.from(payload));
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

    return { channel, q: q.queue };
  } catch (e) {
    console.log(e);
  }
}

module.exports = { connection, publish, subscribe };
