/** @format */

const express = require("express");
const { check } = require("express-validator");

const validate = require("express-validator");

const placeControllers = require("../controllers/places-controllers");

const fileUpload = require("../middlewares/file-upload");

const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.get("/:pid", placeControllers.getPlaceById);

router.get("/users/:uid", placeControllers.getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").isLength({ min: 5 }, check("creator").not().isEmpty()),
  ],
  placeControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeControllers.updatePlace
);

router.delete("/:pid", placeControllers.deletePlace);

router.post("/", placeControllers.createPlace);

module.exports = router;
