const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyDbDifzHJO0tsLiewC1oVFtvQvmcY4_wTw";

async function getCoordsForAddress(address) {
  // encodeURIComponent converts the string to a friendly address by removing special characters
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find any location for this address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
