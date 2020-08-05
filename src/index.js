const api = require("./api");
const { PORT = 3001 } = process.env;

const { consumeMsg, produceMoodMessage } = require("../src/workers");
const { connectToSocket } = require("./lib/socketio");

consumeMsg();
produceMoodMessage();

const server = connectToSocket(api);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
