const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  cat_name: { type: String, required: true },
  image: { type: String, required: true },
  language: { type: String, required: true, enum: ['en', 'hi', 'mr'], comment: 'language code' },
  status: { type: Number, required: true, default: 1, enum: [0, 1], comment: '1 active, 0 inactive' },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true }
});

module.exports = mongoose.model('Category', categorySchema);