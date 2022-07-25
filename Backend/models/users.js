/** @format */

const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { required: true, type: String, unique: true },
  password: { required: true, minlength: 6, type: String },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
  image: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
