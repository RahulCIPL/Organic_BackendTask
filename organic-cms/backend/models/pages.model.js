const mongoose = require("mongoose");

// Purpose: Pages Schema
// Created By: CIPL
const pagesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    keywords: { type: Array },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = Pages = mongoose.model("pages", pagesSchema);
