const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  companyName: {
    type: String,
  },
  companyCode: {
    type: String,
  },
  DOB: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  picture: {
    type: String,
  },
  stats: {},
  tripsQualified: {
    type: [String],
  },
  tripsCompleted: {
    type: [String],
  },
  certs: {
    type: [String],
  },
  activities: {
    type: [String],
  },
  rating: {
    rate: {
      type: Number,
    },
    numberOfRatings: {
      type: Number,
    },
  },
  roleGroup: {
    type: String,
  },
  bio: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  }
  reviews: {
    type: [Object],
  },
});

module.exports = mongoose.model('User', UserSchema);
