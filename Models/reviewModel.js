const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: new Date().toUTCString(),
  },
});

module.exports = mongoose.model('Review', ReviewSchema);
