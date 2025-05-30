const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
 {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat_type: {
      type: String,
      enum: ["permanent", "temporary"],
      default: "permanent",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderSocketId: String,
    receiverSocketId: String,
    messages: [
      {
        message: String,
        dateTime: Date,
        socketId: String,
        userId: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
