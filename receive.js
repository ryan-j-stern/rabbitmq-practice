const ampq = require("amqplib/callback_api");

ampq.connect("amqp://localhost", (error, connection) => {
  if (error) throw error;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const queue = "weather";

    channel.assertQueue(queue, { durable: true });

    console.log(
      "[*] Waiting to receive messages in 'weather'. To exit, press CTRL+C."
    );

    channel.consume(
      queue,
      msg => {
        console.log(`[*] Received msg: ${msg.content.toString()}.`);
      },
      {
        noAck: true
      }
    );
  });
});
