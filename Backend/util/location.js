/** @format */

const axios = require("axios");
const HttpError = require("../models/http-error");

async function getCoordinatesForAddress(address) {
  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${process.env.MAP_API_KEY}`
  );

  if (!response) {
    return next(
      new HttpError(
        "Could not find any coordinates for given address",
        response.results.status.code
      )
    );
  }
  console.log(response);
  const coordinates = response.data.results[0].geometry;
  return coordinates;
}

module.exports = getCoordinatesForAddress;
