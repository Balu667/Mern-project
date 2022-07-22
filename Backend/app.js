/** @format */

const express = require("express");
const mongoose = require("mongoose");
const port = 5000;
const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");

const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");

const app = express();

// console.log(placeRoutes);

app.use(bodyParser.json());

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  next(error);
});

app.use((error, req, res, next) => {
  console.log(req.headerSent);
  if (req.headerSent) {
    next(error);
  } else {
    res.status(error.code || 500);
    res.json({ message: error.message || "Unexpected Error" });
  }
});

mongoose
  .connect(
    "mongodb+srv://mahendra:Balumahi7780@cluster0.mwhrt.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Your Application running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
