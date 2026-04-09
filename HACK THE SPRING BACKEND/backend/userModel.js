// itemModel.js
const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    caste: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    income: {
      type: String,
      required: true,
      min: 0,
    },
    religion: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    presentClass: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

// userSchema.plugin(passportLocalMongoose);
const user = mongoose.model("User", userSchema);

module.exports = user;
