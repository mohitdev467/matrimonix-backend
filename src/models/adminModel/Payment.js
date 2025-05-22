const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    packageAmount: {
      type: Number,
      default: 0,
    },
    paymentTransactionId: {
      type: String,
    },
    discount: {
      type: Number,
      default: 0,
    },
    bookingId: {
      type: String,
    },
    subscriptionObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    paymentType: {
      type: String,
      default: "Cash",
    },
    extraItemTotalAmount: {
      type: Number,
      default: 0,
    },
    localPayStatus: {
      type: String,
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
   
    paidAmount: {
      type: Number,
      default: 0,
    },
   
    totalPaidAmount: {
      type: Number,
      default: 0,
    },
 
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
 
module.exports = mongoose.model("Payment", PaymentSchema);
 
