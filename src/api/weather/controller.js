const { produceMessage } = require("../../workers");

async function postLocation(req, res, next) {
  const { destination, user } = req.body;

  const published = await produceMessage(destination, user);

  published === false
    ? res.status(500).json({
        error: "Published == false"
      })
    : res.status(201).json(published);
}

module.exports = { postLocation };
