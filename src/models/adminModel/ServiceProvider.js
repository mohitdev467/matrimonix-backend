const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema(
  {
    serviceProviderName: { type: String, required: true },
    language: { type: String, required: false },
    category: { type: String, required: true },
    about: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    pricing: { type: String, required: true },
    landmark: { type: String, required: true },
    latitude: { type: String, required: false },
    longitude: { type: String, required: false },
    serviceOffer: { type: String, required: true },
    image: { type: String, required: false },
    bannerImage: { type: String, required: false },
  },
  { timestamps: true }
);

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);

module.exports = ServiceProvider;
