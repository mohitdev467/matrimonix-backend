const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  image: {
    type: String, // store image URL or path
    required: true
  },
  groomName: {
    type: String,
    required: true
  },
  brideName: {
    type: String,
    required: true
  },
  marriedFrom: {
    type: String,
    required: true
  },
  ratings: {
    type: String, 
    required: true,
  
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
