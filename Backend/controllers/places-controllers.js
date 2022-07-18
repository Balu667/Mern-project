/** @format */

const uuid = require("uuid");

const HttpError = require("../models/http-error");

const Dummy_places = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = Dummy_places.find((e) => e.id === placeId);
  if (!place) {
    next(new HttpError("Could not find any place for provided id", 404));
  } else {
    res.json({ place });
  }
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = Dummy_places.find((e) => e.creator === userId);
  if (!place) {
    throw new HttpError("Could not find any place for provided id", 404);
  } else {
    res.json({ place });
  }
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const newPlace = {
    id: uuid.v4(),
    title: title,
    description,
    location: coordinates,
    address: address,
    creator,
  };
  Dummy_places.push(newPlace);
  res.send(Dummy_places);
};

exports.getPlaceById = getPlaceById;

exports.getPlaceByUserId = getPlaceByUserId;

exports.createPlace = createPlace;
