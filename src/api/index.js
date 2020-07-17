const express = require("express");
const app = express();

const weather = require("./weather/routes");

app.use(express.json());
app.use("/weather", weather);

module.exports = app;
