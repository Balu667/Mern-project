/** @format */

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const User = require("../models/users");

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
      401
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    password,
    places,
    image:
      "https://scontent.fblr12-1.fna.fbcdn.net/v/t1.6435-9/168898908_2970385969917602_5369120451877331572_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=730e14&_nc_ohc=uHdXDZo6JJwAX8G0OaQ&_nc_ht=scontent.fblr12-1.fna&oh=00_AT-9JAPhaDhFNPoAd8rXCrzYT5-yLZNrSwES6jJmgVL-2w&oe=6300F2B6",
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signup failed, Please try again", 500));
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
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
    return next(new HttpError("Email is not registered, Plese register first"));
  }
  if (identifyUser.password === password) {
    res.json({ user: identifyUser.toObject({ getters: true }) });
  } else {
    return next(
      new HttpError(
        "password and email mismatch, please enter correct creditials"
      )
    );
  }
};

exports.getUsers = getUsers;
exports.signUp = signUP;
exports.logIn = logIn;
