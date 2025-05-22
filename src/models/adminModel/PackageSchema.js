const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    monthly_pay: { type: Number, required: false },
    language: { type: String, required: true },
    subscriptionType: {
      type: String,
      enum: ["Monthly", "Quarterly", "Free", "Yearly"],
      required: true,
    },
    durationInDays: {
      type: Number,
      required: true, 
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);
