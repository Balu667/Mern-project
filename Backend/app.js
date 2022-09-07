const express = require("express");
const mongoose = require("mongoose");
const port = 5000;
const placeRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(bodyParser.json());

//serve the folder code or images outside the server In nodeJs is every request is comes for middlewares only

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/app.js", express.static(path.join("app.js")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  next(error);
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (req.headerSent) {
    next(error);
  } else {
    res.status(error.code || 500);
    res.json({ message: error.message || "Unexpected Error" });
  }
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mwhrt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Your Application running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
