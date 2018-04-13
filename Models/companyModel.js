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
    type: String,
    unique: true,
  },
  guides: {
    type: Array,
  },
  trips: {
    type: Array,
  },
  about: {
    type: String,
  },
  locations: {
    type: Array,
    required: true,
  },
  permits: {
    type: Array,
    required: true,
  },
  rating: {
    type: Number,
  },
  activities: {
    type: Array,
    required: true,
  },
  logo: {},
});

module.exports = mongoose.model('Company', CompanySchema);
