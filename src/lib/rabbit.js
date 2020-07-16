const amqp = require("amqplib");

async function connect() {
  return await amqp.connect("amqp://localhost");
}

async function publish(queue, payload) {
  try {
    const connection = await connect();
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    console.log(`[X] Sent message to ${queue}`);
    return await channel.sendToQueue(queue, Buffer.from(payload));
  } catch (e) {
    console.log(e);
  }
}

async function subscribe(queue) {
  try {
    const connection = await connect();
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    return await channel.consume(
      queue,
      msg => {
        console.log(`${msg.content.toString()}`);
      },
      { noAck: true }
    );
  } catch (e) {
    console.log(e);
  }
}

module.exports = { connect, publish, subscribe };
