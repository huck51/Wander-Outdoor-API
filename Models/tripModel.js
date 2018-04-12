const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Trip = new Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    requried: true,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  guides: {},
  rating: {},
  _id: {
    type: Schema.types.ObjectId,
    unique: true,
  }
});


module.exports = mongoose.model('Trip', TripSchema);
