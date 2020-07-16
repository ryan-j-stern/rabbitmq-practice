const axios = require("axios");
const baseUrl = " http://api.weatherapi.com/v1";
const apiKey = process.env.WEATHER_API_KEY;

module.exports = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/current.json?key=${apiKey}&q="Miami"`
    );

    const weather = `The weather in ${response.data.location.name}, ${response.data.location.region} is ${response.data.current.temp_f}° F.`;
    return weather;
  } catch (err) {
    console.log(err);
  }
};
