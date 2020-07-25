const { produceMessage } = require("../../workers");

async function postLocation(req, res, next) {
  const destination = req.body.destination;

  const published = await produceMessage(destination);

  published === false
    ? res.status(500).json({
        error: "Published == false"
      })
    : res.status(201).json(published);
}

module.exports = { postLocation };
