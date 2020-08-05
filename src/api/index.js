const express = require("express");
const app = express();
const cors = require("cors");

const weather = require("./weather/routes");

app.use(express.json());
app.use(cors());
app.use("/weather", weather);

module.exports = app;
