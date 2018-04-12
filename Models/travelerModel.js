const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TravelerSchema = new Schema({
  firstName: {},
  lastName: {},
  DOB: {},
  email: {},
  phone: {},
  username: {},
  password: {},
  _id: {},
  profilePic: {},
  stats: {},
  trips: {},
  rating: {},
});

module.exports = mongoose.model('Traveler', TravelerSchema);
