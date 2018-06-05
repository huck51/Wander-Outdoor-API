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
    type: Number,
  },
  roleGroup: {
    type: String,
  }
});

module.exports = mongoose.model('User', UserSchema);
