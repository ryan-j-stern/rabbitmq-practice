# Weather App with RabbitMQ

Discord bot with the server name `gettheweather` . Input into the chat must end in `in <location>`. Examples of input into the chat:

- "What is the weather in Miami?"
- "What is the mood like in Portland?"

The bot will respond with a sentence of the form `The current weather in Philadelphia, Pennsylvania is 88° F with humidity at 52, however it feels like 93.1° F.` and a gif representing the mood one would feel in that location's temperature.

# Routes and Requests

All routes in the weather service will start with **https://weather-rabbit.herokuapp.com/weather**

#### POST

- url: /location

- body:
  {
  "location": String
  }

- responses:
  - 201 - Returns back a boolean true
  - 500 - Returns back a message of "Internal Service Error"

# Run on Local Machine

In order to run this code on a local machine you must start both the ExpressJS server and the discord bot.

To start the ExpressJS server:

```
node src

or

nodemon src
```

To start the bot:

```
node src/bot/bot.js
```
