import { Schema, model } from "mongoose";

// Purpose: Users Schema
// Created By: CIPL
const usersSchema = new Schema(
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

export default Users = model("users", usersSchema);
