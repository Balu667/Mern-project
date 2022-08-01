/** @format */

const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [check("email").isEmail(), check("password").isLength({ min: 5 })],
  usersControllers.signUp
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 5 })],
  usersControllers.logIn
);

module.exports = router;
