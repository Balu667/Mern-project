/** @format */

const express = require("express");

const placeControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", placeControllers.getPlaceById);

router.get("/users/:uid", placeControllers.getPlaceByUserId);

router.post("/", placeControllers.createPlace);

module.exports = router;
