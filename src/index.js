const api = require("./api");
const { PORT = 3001 } = process.env;

api.listen(PORT, () => console.log(`Listening on port ${PORT}`));