const mongoose = require("mongoose");

const casteSchema = new mongoose.Schema(
  {
    caste: { type: String, required: true, unique: true },
    language: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Caste", casteSchema);
