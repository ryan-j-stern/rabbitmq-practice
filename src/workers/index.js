const { publish, subscribe } = require("../lib/rabbit");
const weather = require("../lib/weather");
const { feeling, gif } = require("../lib/gif");

async function produceMessage(location, user) {
  const response = await weather(location);

  const exchange = "weather";
  if (response != null) {
    const { destination, current } = response;
    const weatherMsg = `The current weather in ${destination.name}, ${destination.region} is ${current.temp_f}° F with humidity at ${current.humidity}, however it feels like ${current.feelslike_f}° F.`;
    const msg = {
      weatherMsg,
      user
    };

    return await publish(exchange, "fanout", "", JSON.stringify(msg));
  }
}

async function consumeMsg() {
  const exchange = "weather";
  const { channel, q } = await subscribe(exchange, "fanout", "", "weather_q");

  channel.consume(
    q,
    async msg => {
      const message = JSON.parse(msg.content.toString());
      console.log("msg", message);
      return await publish("slack", "fanout", "", message.weatherMsg);
    },
    { noAck: true }
  );
}

async function produceMoodMessage() {
  try {
    const exchange = "weather";
    const { channel, q } = await subscribe(exchange, "fanout", "", "mood");

    channel.consume(
      q,
      async msg => {
        const message = JSON.parse(msg.content.toString());

        const temp = message.weatherMsg.slice(
          message.weatherMsg.lastIndexOf("is") + 3,
          message.weatherMsg.indexOf("°")
        );

        const mood = feeling(temp);
        const url = await gif(mood);

        return await publish("slack", "fanout", "", url);
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
    const { channel, q } = await subscribe(exchange, "fanout", "", "slack_q");

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
