const api = require("./api");
const { PORT = 3001 } = process.env;

const {
  consumeMsg,
  produceMoodMessage,
  consumeSlack
} = require("../src/workers");

consumeMsg();
produceMoodMessage();

api.listen(PORT, () => console.log(`Listening on port ${PORT}`));
