/** @format */

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const User = require("../models/users");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
  } catch (err) {
    console.log(err);
    return next(new HttpError("fetching users failed, Plese try again"));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signUP = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return new HttpError(
      "Invalid Inputs and does not match our pattern, Please check",
      422
    );
  }
  const { email, name, password, places } = req.body;

  let hasUser;

  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signup failed, Please try again", 500));
  }
  if (hasUser) {
    const error = new HttpError(
      "Email is already registered, Please Login",
      422
    );
    return next(error);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch {
    return next(new HttpError("Could not create the user", 500));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    places,
    image: req.file.path,
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signup failed, Please try again", 500));
  }

  let token;

  try {
    token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      "secretkey_notshare_anyone",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Signup failed, Please try again", 500));
  }

  res
    .status(201)
    .json({ email: newUser.email, password: newUser.password, token: token });
};

const logIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid Inputs and does not match our pattern, Please check",
        422
      )
    );
  }
  const { email, password } = req.body;

  let identifyUser;

  try {
    identifyUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("login failed, something went wrong Please check")
    );
  }

  if (!identifyUser) {
    return next(
      new HttpError("Email is not registered, Plese register first", 403)
    );
  }

  let isValidUser = false;

  try {
    isValidUser = await bcrypt.compare(password, identifyUser.password);
  } catch {
    return next(
      new HttpError("Could not find the user, please check the creditials", 500)
    );
  }

  console.log(isValidUser);

  if (!isValidUser) {
    return next(
      new HttpError(
        "password and email mismatch, please enter correct creditials",
        500
      )
    );
  }

  let token;
  try {
    token = jwt.sign(
      { id: identifyUser.id, email: identifyUser.email },
      "secretkey_notshare_anyone",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(
      new HttpError(
        "password and email mismatch, please enter correct creditials",
        500
      )
    );
  }

  res.json({ id: identifyUser.id, email: identifyUser.email, token: token });
};

exports.getUsers = getUsers;
exports.signUp = signUP;
exports.logIn = logIn;
