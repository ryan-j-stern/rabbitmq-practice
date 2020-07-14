const ampq = require("amqplib/callback_api");

// Connect to the RabbitMQ server
ampq.connect("amqp://localhost", (error, connection) => {
  if (error) {
    console.log("Couldnt connect");
    throw error;
  }

  // Create a channel where most of the API for getting things done resides
  connection.createChannel((err, channel) => {
    if (err) {
      console.log("Could create channel");
      throw err;
    }

    // Create the exchange name
    const exchange = "logs";
    const msg = "Hello World";

    // Create the exchange
    channel.assertExchange(exchange, "fanout", { durable: false });

    // Publish the message to the exchange. Since we are using a fanout exchage, the key (second param.) gets ignored
    channel.publish(exchange, "", Buffer.from(msg));
    console.log(`[X] Sent message ${msg}`);
  });

  // Close the connection and exit
  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});
