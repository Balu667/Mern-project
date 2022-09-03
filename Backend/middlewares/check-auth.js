const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization = "Bearer token"
    if (!token) {
      throw new Error("Authentication failed !");
    }
    const decodedToken = jwt.verify(token, "secretkey_notshare_anyone");
    console.log(decodedToken);
    req.userData = { userId: decodedToken.id };
    next();
  } catch (err) {
    return next(new HttpError("Autharization failed ", 401));
  }
};

module.exports = checkAuth;
