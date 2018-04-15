const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuideSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyCode: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
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
  bio: {
    type: String,
    required: true,
  },
  certs: {
    type: [String],
  },
  profilePic: {},
  _id: {
    type: Schema.types.ObjectId,
    unique: true,
  },
  rating: {
    type: Number,
  },
  trips: {
    type: [String],
    required: true,
  },
  activities: {
    type: [String],
    required: true,
  },
});


module.exports = mongoose.model('Guide', GuideSchema);
