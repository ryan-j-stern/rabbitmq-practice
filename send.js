const amqp = require("amqplib/callback_api");
const axios = require("axios");
const baseUrl = " http://api.weatherapi.com/v1";
const apiKey = process.env.WEATHER_API_KEY;

async function callWeatherApi() {}

// Connect to the RabbitMQ server
amqp.connect("amqp://localhost", (error, connection) => {
  if (error) {
    console.log("Not connected");
    throw error;
  }

  connection.createChannel((err, channel) => {
    if (err) {
      console.log("Channel not connected");
      throw err;
    }

    const queue = "weather";
    axios
      .get(`${baseUrl}/current.json?key=${apiKey}&q="Miami"`)
      .then(res => {
        const data = res.data;
        const msg = `The weather in ${data.location.name}, ${data.location.region} is currently ${data.current.temp_f}° Farenheit`;

        channel.assertQueue(queue, { durable: true });

        channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
        console.log("[X] Sent message to queue");
      })
      .catch(err => console.log(err));
  });

  // Close the connection and exit
  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});
