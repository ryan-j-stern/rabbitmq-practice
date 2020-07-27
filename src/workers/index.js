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

        const temp = weather.slice(
          weather.lastIndexOf("is") + 3,
          weather.indexOf("°")
        );

        const mood = feeling(temp);
        const url = await gif(mood);

        return await publish("slack", url);
      },
      { noAck: true }
    );
  } catch (e) {
    console.log(e);
  }
}

async function consumeSlack(message) {
  try {
    const exchange = "slack";
    const { channel, q } = await subscribe(exchange, "slack_q");

    channel.consume(
      q,
      msg => {
        return message.channel.send(msg.content.toString());
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
