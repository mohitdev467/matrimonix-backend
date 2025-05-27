const mongoose = require("mongoose");

const occupationSchema = new mongoose.Schema(
  {
    occupation: { type: String, required: true, unique: true },
    language: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Occupation", occupationSchema);
