const axios = require("axios");
const baseUrl = " http://api.weatherapi.com/v1";
const apiKey = process.env.WEATHER_API_KEY;

module.exports = async destination => {
  try {
    const response = await axios.get(
      `${baseUrl}/current.json?key=${apiKey}&q="${destination}"`
    );
    return {
      destination: response.data.location,
      current: response.data.current
    };
  } catch (err) {
    return null;
  }
};
