const apiKey = process.env.GIF_API_KEY;
const axios = require("axios");

async function gif(mood) {
  try {
    const response = await axios.get(
      `https://api.giphy.com/v1/gifs/search?q=${mood}&api_key=${apiKey}&limit=5&offset=0&rating=g&lang=en`
    );

    return response.data.data[Math.floor(Math.random() * 5)].url;
  } catch (e) {
    console.log(e);
  }
}

const map = {
  90: "Burning+Up",
  70: "Not+too+bad",
  65: "Beautiful",
  50: "Chilly",
  40: "Freezing",
  25: "I'm+out"
};

function feeling(temp) {
  if (temp >= 90) {
    temp = 90;
  } else if (temp < 90 && temp >= 70) {
    temp = 70;
  } else if (temp < 70 && temp >= 60) {
    temp = 65;
  } else if (temp < 60 && temp >= 50) {
    temp = 50;
  } else if (temp < 50 && temp >= 25) {
    temp = 40;
  } else {
    temp = 25;
  }
  return map[temp];
}

module.exports = { gif, feeling };
