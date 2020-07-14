const ampq = require("amqplib/callback_api");

ampq.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;

  connection.createChannel((error, channel) => {
    if (error) throw error;

    // Create exchange name and then create the exchange
    const exchange = "logs";
    channel.assertExchange(exchange, "fanout", { durable: false });

    // Assert a temporary queue where the logic will happen
    channel.assertQueue("", { exclusive: true }, (err1, q) => {
      if (err1) throw err1;

      // Log out that we are in the queue with the queue name
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        q.queue
      );

      // Bind the temporary queue to the exchange in order to receive the logs
      channel.bindQueue(q.queue, exchange, "");

      // Consume the messages from that are being sent to the queue from the exchange
      channel.consume(
        q.queue,
        msg => {
          if (msg.content) {
            console.log("[*] Received message", msg.content.toString());
          }
        },
        { noAck: false }
      );
    });
  });
});
