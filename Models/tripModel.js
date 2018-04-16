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
  guides: {
    type: [String],
  },
  rating: {
    type: Number,
  },
  _id: {
    type: Schema.types.ObjectId,
    unique: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  }
});


module.exports = mongoose.model('Trip', TripSchema);
