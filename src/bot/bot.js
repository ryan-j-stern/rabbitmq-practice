/**
 * User will input one of two messages into the discord server
 *
 * 1.) "What is the weather in <location>"
 *
 * 2.) "What is the mood in <location>"
 *
 * Steps to take:
 *  Parse the string and extract the location
 *  Send that location to the api as "destination": location
 *  Get response from api and send back to Discord
 */

const { Client } = require("discord.js");
const axios = require("axios");
const { consumeSlack } = require("../workers");

const token =
  process.env.DISCORD_TOKEN ||
  "NzM1NDgwMjg4NDM5Njk3NTQ4.Xxg3ZQ.K59SnzY8555DqYqqy8LxsHcLSUs";
const apiUrl = "http://localhost:3001";

const client = new Client();

client.on("ready", () => {
  console.log("Weather bot is ready.");
});

client.on("message", async message => {
  const location = message.content.slice(
    message.content.lastIndexOf("in") + 3,
    message.content.length
  );

  try {
    await axios.post(`${apiUrl}/weather/location`, {
      destination: location
    });
  } catch (e) {
    console.log(e);
  }
  return await consumeSlack(message);
});

client.login(token);
