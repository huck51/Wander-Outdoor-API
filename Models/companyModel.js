const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
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
  password: {
    type: String,
    required: true,
  },
  companyCode: {
    type: String,
    default: "69696969", // Remember to change this back to 'unique: true'
  },
  guides: {
    type: [String],
  },
  trips: {
    type: [String],
  },
  about: {
    type: String,
  },
  locations: {
    type: [String],
    // required: true,
  },
  permits: {
    type: [String],
    // required: true,
  },
  rating: {
    type: Number,
  },
  activities: {
    type: [String],
    // required: true,
  },
  logo: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model('Company', CompanySchema);
