const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    cat_name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
