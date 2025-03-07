const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    income: { type: String, required: true, unique: true },
    language: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
