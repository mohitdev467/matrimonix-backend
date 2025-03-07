const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
  {
    language: { type: String, required: true, unique: true },
    languageCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Language", languageSchema);
