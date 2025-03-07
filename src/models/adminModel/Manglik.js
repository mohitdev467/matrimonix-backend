const mongoose = require("mongoose");

const manglikSchema = new mongoose.Schema(
  {
    manglik: { type: String, required: true, unique: true },
    language: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manglik", manglikSchema);
