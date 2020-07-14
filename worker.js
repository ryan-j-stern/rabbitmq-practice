const ampq = require("amqplib/callback_api");

ampq.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;

  connection.createChannel((error, channel) => {
    if (error) throw error;

    const queue = "task_queue";

    channel.assertQueue(queue, {
      durable: false
    });

    console.log(
      "[*] Waiting to receive messages in 'hello'. To exit, press CTRL+C."
    );

    channel.consume(
      queue,
      msg => {
        const secs = msg.content.toString().split(".").length - 1;
        console.log(`[X] Received message ${msg.content.toString()}`);

        // Delays one second per . in the string passed in
        setTimeout(function() {
          console.log(" [x] Done");
        }, secs * 1000);
      },
      {
        noAck: true
      }
    );
  });
});
