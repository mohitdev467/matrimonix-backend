const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    language: { type: String, required: true },
    subscriptionType: {
      type: String,
      enum: ["Monthly", "Quarterly", "Free", "Yearly"],
      required: true,
    },
    isActive: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);
