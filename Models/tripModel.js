const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  companyName: {
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
  guides: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  rating: {
    rate: {
      type: Number,
      default: 5,
    },
    numberOfRatings: {
      type: Number,
      default: 0,
    },
  },
  picture: {
    type: String,
  },
  stats: {},
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  likes: {
    type: Number,
  },
  chex:{
    type: [String],
  },
  tags: {
    type: [String],
  },
  roleGroup: {
    type: String,
    default: 'trip',
  },
  tripUrl: {
    type: String,
  }
});


module.exports = mongoose.model('Trip', TripSchema);

// field: [{type: Schema.Types.ObjectId, ref: Model}]
