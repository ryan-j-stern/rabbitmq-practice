const { publish, subscribe } = require("../lib/rabbit");
const weather = require("../lib/weather");
const { feeling, gif } = require("../lib/gif");

async function produceMessage(location) {
  const response = await weather(location);
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
      return await publish("slack", msg.content.toString());
    },
    { noAck: true }
  );
}

async function produceMoodMessage() {
  try {
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

        const mood = feeling(temp);
        console.log("Mood:", mood);

        const url = await gif(mood);
        return await publish("slack", url);
      },
      { noAck: true }
    );
  } catch (e) {
    console.log(e);
  }
}

async function consumeSlack() {
  try {
    const exchange = "slack";
    const { channel, q } = await subscribe(exchange, "slack_q");

    channel.consume(
      q,
      msg => {
        console.log(`[XX] Received message: ${msg.content.toString()}`);
        // For each message received, we want to send it back to the client
      },
      { noAck: true }
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
