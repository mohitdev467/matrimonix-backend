const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
  category: { type: String, required: true },
  about: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  pricing: { type: String, required: true },
  landmark: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  serviceOffer: { type: String, required: true },
  image: { type: String, required: true },
  bannerImage: { type: String, required: true },
});

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);

module.exports = ServiceProvider;
