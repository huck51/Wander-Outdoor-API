const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TravelerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  _id: {
    type: Schema.types.ObjectId,
    unique: true,
  },
  profilePic: {},
  stats: {},
  trips: {
    type: Array,
  },
  rating: {},
});

module.exports = mongoose.model('Traveler', TravelerSchema);
