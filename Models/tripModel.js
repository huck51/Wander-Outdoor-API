const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  city: {
    type: String,
    requried: true,
  },
  stateName: {
    type: String,
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
  picture: {
    type: String,
  },
  stats: {},
  reviews: {
    type: [String],
  },
  likes: {
    type: Number,
  },
  chex:{
    type: [String],
  },
});


module.exports = mongoose.model('Trip', TripSchema);

// field: [{type: Schema.Types.ObjectId, ref: Model}]
