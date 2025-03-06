const mongoose = require("mongoose");
const { addDefaultChallanged } = require("../helpers/challengedHelper");
const { addDefaultComplexion } = require("../helpers/complexationHelper");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected Successfully");
    await addDefaultChallanged();
    await addDefaultComplexion();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
module.exports = connectDB;
