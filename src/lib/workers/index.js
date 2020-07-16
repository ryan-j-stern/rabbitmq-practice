const { publish, subscribe } = require("../rabbit");

// Call fetchWeather, then publish to queue
async function produceMessage(queue, fetchWeather) {
  const msg = await fetchWeather();

  await publish(queue, msg);
  console.log(`Published message to ${queue}`);
}

async function consumeMsg(queue) {
  await subscribe(queue);
}

module.exports = { produceMessage, consumeMsg };
