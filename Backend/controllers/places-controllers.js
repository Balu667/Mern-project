/** @format */

const { validationResult } = require("express-validator");
const uuid = require("uuid");
const getCoordinatesForAddress = require("../util/location");
const axios = require("axios");
const Place = require("../models/places");

const HttpError = require("../models/http-error");

let Dummy_places = [
  {
    id: "p1",
    title: "Infibeam Avenues",
    description: "Leading E-commerce company",
    location: {
      lat: 44,
      long: 55,
    },
    address: "Sanjay nagar, Banglore, Karnataka",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }

  if (!place) {
    next(new HttpError("Could not find any place for provided id", 404));
  } else {
    res.json({ place: place.toObject({ getters: true }) });
  }
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could fetch the places by given userId, Something went wrong Please check"
    );
    return next(error);
  }

  if (!places | (places.length === 0)) {
    return next(
      new HttpError("Could not find any places for provided id", 404)
    );
  } else {
    res.json({
      places: places.map((place) => place.toObject({ getters: true })),
    });
  }
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input fields, Please Check", 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (err) {
    return next(err);
  }
  console.log(coordinates);

  const newPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    creator,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d1/Charminar-Pride_of_Hyderabad.jpg",
  });

  try {
    await newPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Crating Place is failed, Please try again",
      err
    );
    return next(error);
  }

  res.send(newPlace);
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input fields, Please Check", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }

  try {
    await place.remove();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Successfully deleted place !" });
};

exports.getPlaceById = getPlaceById;

exports.getPlacesByUserId = getPlacesByUserId;

exports.createPlace = createPlace;

exports.updatePlace = updatePlace;

exports.deletePlace = deletePlace;
