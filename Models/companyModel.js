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
  _id: {
    type: Schema.types.ObjectId,
    unique: true,
  },
  companyCode: {
    unique: true,
  },
  guides: {},
  trips: {},
  about: {
    type: String,
  },
  locations: {
    required: true,
  },
  permits: {},
  rating: {},
});

module.exports = mongoose.model('Company', CompanySchema);
