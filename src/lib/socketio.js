const http = require("http");
const { subscribe } = require("./rabbit");
const socketIO = require("socket.io");

const connectToSocket = api => {
  const server = http.createServer(api);
  const io = socketIO(server, { origins: "*:*" });

  io.on("connection", async socket => {
    const { channel, q } = await subscribe(
      "weather",
      "fanout",
      "",
      "timeline_q"
    );

    channel.consume(
      q,
      msg => {
        socket.emit("timeline", JSON.parse(msg.content.toString()));
        console.log(`Sent to ${q}`);
      },
      { noAck: true }
    );
  });

  return server;
};

module.exports = { connectToSocket };
