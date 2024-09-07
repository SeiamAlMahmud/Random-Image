const mongoose = require('mongoose');

// ইমেজের জন্য Schema তৈরি করা
const ImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['boy', 'girl'],
    required: true
  }
},{timestamps: true});

module.exports = mongoose.model('Image', ImageSchema);