const express = require("express");
const app = express();

const fetchWeather = require("../../fetchWeather");
const { produceMessage, consumeMsg } = require("../lib/workers");

const queue = "weather";

produceMessage(queue, fetchWeather);
setInterval(produceMessage, 5000, queue, fetchWeather);
consumeMsg(queue);

module.exports = app;
