const fetchWeather = require("./fetchWeather");
const amqpChannel = require("./src/lib/rabbit");
// const queue = "weather";
// channel.assertQueue(queue, { durable: true });

async function send() {
  const channel = amqpChannel;
  const msg = await fetchWeather();
  console.log(msg);

  const queue = "weather";

  channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(msg));
  console.log("[X] Sent message to queue");
}

send();

// Repeat every 2 seconds
// setInterval(sendMessage, 2000);

/**
 * Spin up express server, abstract out the channel. Put RabbitMQ code in a single file (SRP). Utilize async await (try/catch).
 * Use Docker compose
 */
