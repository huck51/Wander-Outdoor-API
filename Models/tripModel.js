const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Trip = new Schema({
  name: {},
  company: {},
  location: {},
  description: {},
  price: {},
  guides: {},
  rating: {},
});


module.exports = mongoose.model('Trip', TripSchema);
