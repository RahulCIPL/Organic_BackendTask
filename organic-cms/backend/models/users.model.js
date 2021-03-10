const mongoose = require("mongoose");


// Purpose: Users Schema
// Created By: CIPL
const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emailaddress: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    status: { type: Boolean },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = Users = mongoose.model("users", usersSchema);
