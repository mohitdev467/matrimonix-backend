const mongoose = require("mongoose");

const DeleteRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    countryCode: { type: String, required: false, default:"+91" },
    number: { type: String, required: false },
    reason: { type: String, required: false },
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeleteRequest", DeleteRequestSchema);
