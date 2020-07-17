const express = require("express");
const app = express();

const weather = require("./weather/routes");
const { consumeMsg } = require("../workers");

app.use(express.json());
app.use("/weather", weather);

consumeMsg();

module.exports = app;
