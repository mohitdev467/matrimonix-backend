const mongoose = require("mongoose");

const religionSchema = new mongoose.Schema(
  {
    religion: { type: String, required: true, unique: true },
    language: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Religion", religionSchema);
