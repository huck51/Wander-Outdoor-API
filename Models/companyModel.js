const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CompanySchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  stateName: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  companyPhone: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true,
  },
  companyCode: {
    type: String,
    unique: true,
  },
  guides: {
    type: [String],
  },
  trips: {
    type: [String],
  },
  bio: {
    type: String,
  },
  locations: {
    type: [String],
  },
  permits: {
    type: [String],
  },
  rating: {
    type: Number,
  },
  activities: {
    type: [String],
  },
  picture: {
    type: String,
  },
  reviews: {
    type: [String],
  },
  likes: {
    type: Number,
  },
  chex: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Company', CompanySchema);
