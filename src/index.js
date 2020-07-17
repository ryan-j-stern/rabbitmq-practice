const api = require("./api");
const { PORT = 3001 } = process.env;

const { consumeMsg } = require("../src/workers");

// Add mood producer here
consumeMsg();

api.listen(PORT, () => console.log(`Listening on port ${PORT}`));
