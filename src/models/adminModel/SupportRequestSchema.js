const mongoose = require("mongoose");

const SupportRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    subject: { type: String, required: false },
    scheduleMeeting: { type: String, required: false },
    yourMessage: { type: String, required: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportRequest", SupportRequestSchema);
