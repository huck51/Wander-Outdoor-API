const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    default: 'Wild America Guiding Co.'
  },
  location: {
    type: String,
    requried: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  guides: {
    type: [String],
  },
  rating: {
    type: Number,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  stats: {},
});


module.exports = mongoose.model('Trip', TripSchema);
