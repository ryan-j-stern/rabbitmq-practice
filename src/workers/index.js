const { publish, subscribe } = require("../lib/rabbit");
const fetchWeather = require("../lib/fetchWeather");
const { feeling, gif } = require("../lib/gif");

async function produceMessage(location) {
  const response = await fetchWeather(location);
  const exchange = "weather";
  if (response != null) {
    const { destination, current } = response;
    const msg = `The current weather in ${destination.name}, ${destination.region} is ${current.temp_f}° F with humidity at ${current.humidity}, however it feels like ${current.feelslike_f}° F.`;

    return await publish(exchange, msg);
  }
  return false;
}

async function consumeMsg() {
  const exchange = "weather";
  const { channel, q } = await subscribe(exchange, "weather_q");
  channel.consume(
    q,
    async msg => {
      await publish("slack", msg.content.toString());
    },
    { noAck: false }
  );
  return;
}

async function produceMoodMessage() {
  try {
    // Receive message from weather queue
    const exchange = "weather";
    const { channel, q } = await subscribe(exchange, "mood");
    channel.consume(
      q,
      async msg => {
        let weather = msg.content.toString();
        // Get string from after like until °
        const temp = weather.slice(
          weather.lastIndexOf("is") + 3,
          weather.indexOf("°")
        );
        // Compare temperature to mood map
        const mood = feeling(temp);
        console.log("Mood:", mood);
        // Fetch gif with mood
        const url = await gif(mood);
        // Publish gif url to mood queue
        return await publish("slack", url);
      },
      { noAck: false }
    );
  } catch (e) {
    console.log(e);
  }
}

async function consumeSlack() {
  try {
    const exchange = "slack";
    const { channel, q } = await subscribe(exchange, "slack_q");
    // Clear message from queue
    channel.consume(
      q,
      msg => {
        console.log(`[XX] Received message: ${msg.content.toString()}`);
      },
      { noAck: false }
    );
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  produceMessage,
  consumeMsg,
  produceMoodMessage,
  consumeSlack
};
