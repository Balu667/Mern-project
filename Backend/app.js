/** @format */

const express = require("express");
const port = 5000;
const placeRoutes = require("./routes/places-routes");
const bodyParser = require("body-parser");

const app = express();

// console.log(placeRoutes);

app.use("/api/places", placeRoutes);

// app.use(bodyParser.json());

app.use((error, req, res, next) => {
  console.log(req.headerSent);
  if (req.headerSent) {
    next(error);
  } else {
    res.status(error.code || 500);
    res.json({ message: error.message || "Unexpected Error" });
  }
});

app.listen(port, () => {
  console.log(`Your Application running on port ${port}`);
});
