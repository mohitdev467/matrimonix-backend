const mongoose = require('mongoose');

const complexionSchema = new mongoose.Schema({
  complexion: { type: String, required: true }
});

const Complexion = mongoose.model('Complexion', complexionSchema);

module.exports = Complexion;