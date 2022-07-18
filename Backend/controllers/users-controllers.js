/** @format */
/** @format */

const { validationResult } = require("express-validator");
const uuid = require("uuid");

const HttpError = require("../models/http-error");

let Users = [
  {
    id: "u1",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: Users });
};

const signUP = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(
      "Invalid Inputs and does not match our pattern, Please check",
      422
    );
  }
  const { email } = req.body;
  const hasUser = Users.find((u) => u.email === email);
  if (hasUser) {
    const error = new HttpError(
      "Email is already registered, Please Login",
      401
    );
    throw error;
  } else {
    const { name, email, password } = req.body;
    const newUser = {
      id: uuid.v4(),
      name,
      email,
      password,
    };
    Users.push(newUser);
    res.status(201).json(newUser);
  }
};

const logIn = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(
      "Invalid Inputs and does not match our pattern, Please check",
      422
    );
  }
  const { email, password } = req.body;

  const identifyUser = Users.find((u) => u.email === email);

  if (!identifyUser) {
    throw new HttpError("Email is not registered, Plese register first");
  } else {
    if (identifyUser.password === password) {
      res.json({ message: "Logged in!" });
    } else {
      throw new HttpError(
        "password and email mismatch, please enter correct creditials"
      );
    }
  }
};

exports.getUsers = getUsers;

exports.signUp = signUP;
exports.logIn = logIn;
