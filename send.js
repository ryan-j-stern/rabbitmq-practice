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

    const queue = "hello";
    const msg = "Hello World";

    // Declare a queue, will only be created if queue does not exist
    channel.assertQueue(queue, {
      durable: false
    });

    // Send the message to the queue
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(`[X] Sent message ${msg}`);
  });

  // Close the connection and exit
  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});
