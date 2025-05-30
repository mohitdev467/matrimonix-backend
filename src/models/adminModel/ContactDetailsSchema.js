const mongoose = require("mongoose");

const contactDetailsSchema = new mongoose.Schema({
  location: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  socialLinks: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
}, { timestamps: true });

module.exports = mongoose.model("ContactDetail", contactDetailsSchema);