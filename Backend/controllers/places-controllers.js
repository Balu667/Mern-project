/** @format */

const { validationResult } = require("express-validator");
const uuid = require("uuid");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = Dummy_places.find((e) => e.id === placeId);
  if (!place) {
    next(new HttpError("Could not find any place for provided id", 404));
  } else {
    res.json({ place });
  }
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = Dummy_places.filter((e) => e.creator === userId);
  if (!places | (places.length === 0)) {
    throw new HttpError("Could not find any places for provided id", 404);
  } else {
    res.json({ places });
  }
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input fields, Please Check", 422);
  }
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

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input fields, Please Check", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatePlace = { ...Dummy_places.find((p) => p.id === placeId) };
  const updatePlaceIndex = Dummy_places.findIndex((p) => p.id === placeId);
  updatePlace.title = title;
  updatePlace.description = description;
  Dummy_places[updatePlaceIndex] = updatePlace;
  res.status(200).json({ place: updatePlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!Dummy_places.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for that id", 404);
  }
  Dummy_places = Dummy_places.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Successfully deleted place !" });
};

exports.getPlaceById = getPlaceById;

exports.getPlacesByUserId = getPlacesByUserId;

exports.createPlace = createPlace;

exports.updatePlace = updatePlace;

exports.deletePlace = deletePlace;
