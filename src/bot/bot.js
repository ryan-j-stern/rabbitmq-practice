const { Client } = require("discord.js");
const axios = require("axios");
const { consumeSlack } = require("../workers");

const token = process.env.DISCORD_TOKEN;
// const apiUrl = `https://weather-rabbit.herokuapp.com`;
const apiUrl = "http://localhost:3001";

const client = new Client();

client.on("ready", () => {
  console.log("Weather bot is ready.");
});

client.on("message", async message => {
  if (message.author.username != "weather") {
    const location = message.content.substring(
      message.content.lastIndexOf("in") + 3,
      message.content.length
    );

    try {
      await axios.post(`${apiUrl}/weather/location`, {
        destination: location,
        user: message.author.username
      });

      return await consumeSlack(message);
    } catch (e) {
      console.log(e);
    }
  } else return;
});

client.login(token);
