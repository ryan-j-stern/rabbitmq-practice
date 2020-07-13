const ampq = require("amqplib/callback_api");

ampq.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;

  connection.createChannel((error, channel) => {
    if (error) throw error;

    const queue = "hello";

    channel.assertQueue(queue, {
      durable: false
    });

    console.log(
      "[*] Waiting to receive messages in 'hello'. To exit, press CTRL+C."
    );

    channel.consume(
      queue,
      msg => {
        console.log(`[X] Received message ${msg.content.toString()}`);
      },
      {
        noAck: true
      }
    );
  });
});
