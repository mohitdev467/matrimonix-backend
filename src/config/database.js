const mongoose = require("mongoose");
const { addDefaultChallanged } = require("../helpers/challengedHelper");
const { addDefaultComplexion } = require("../helpers/complexationHelper");
const membershipExpiryJob = require("../helpers/membershipExpiryCronJob");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected Successfully");

    await addDefaultChallanged();
    await addDefaultComplexion();

    membershipExpiryJob.start();
    console.log("Membership expiry cron job started");

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
