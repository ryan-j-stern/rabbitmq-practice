const amqp = require("amqplib/callback_api");
const axios = require("axios");

const baseUrl = " http://api.weatherapi.com/v1";
const apiKey = process.env.WEATHER_API_KEY;

function sendMessage() {
  // Connect to the RabbitMQ server (TCP)
  amqp.connect("amqp://localhost", (error, connection) => {
    if (error) {
      console.log("Not connected");
      throw error;
    }
    // Allows "conversations" to happen
    connection.createChannel((err, channel) => {
      if (err) {
        console.log("Channel not connected");
        throw err;
      }

      const queue = "weather";
      channel.assertQueue(queue, { durable: true });

      axios
        .get(`${baseUrl}/current.json?key=${apiKey}&q="Miami"`)
        .then(res => {
          const data = res.data;
          const msg = `The weather in ${data.location.name}, ${data.location.region} is currently ${data.current.temp_f}° Farenheit`;

          channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
          console.log("[X] Sent message to queue");
        })
        .catch(err => console.log(err));
    });
  });
}

// Repeat every 2 seconds
setInterval(sendMessage, 2000);

/**
 * Spin up express server, abstract out the channel. Put RabbitMQ code in a single file (SRP). Utilize async await (try/catch).
 * Use Docker compose
 */
