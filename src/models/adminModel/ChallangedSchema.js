const mongoose = require('mongoose');

const challangedSchema = new mongoose.Schema({
  challanged_id: { type: Number, required: true, unique: true },
  challanged: { type: String, required: true }
});

const Challanged = mongoose.model('Challanged', challangedSchema);

module.exports = Challanged;