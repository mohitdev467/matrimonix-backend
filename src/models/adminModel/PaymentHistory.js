const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  packages: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
  },
  orderId: {
    type: String,
    required: [false, "Order ID is required"],
  },
  sessionId: {
    type: String,
  },
  paymentStatus: {
    type: String,
    required: [true, "Payment status is required"],
  },
  amount: {
    type: Number,
    required: [false, "Amount is required"],
  },
  
},{timestamps:true});

module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);
