const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  author: {
    type: String,
  },
  text: {
    type: String,
  },
  date: {
    type: String,
    default: new Date().toUTCString(),
  },
  rate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Review', ReviewSchema);
