const { publish, subscribe } = require("../lib/rabbit");
const fetchWeather = require("../lib/fetchWeather");

async function produceMessage(location) {
  const queue = "weather";

  const response = await fetchWeather(location);

  if (response != null) {
    const { destination, current } = response;
    const msg = `The current weather in ${destination.name}, ${destination.region} is ${current.temp_f}° F with humidity at ${current.humidity}, however it feels like ${current.feelslike_f}° F.`;

    return await publish(queue, msg);
  }
  return false;
}

async function consumeMsg() {
  return await subscribe("weather");
}

module.exports = { produceMessage, consumeMsg };
