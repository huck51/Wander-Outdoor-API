const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  companyName: {},
  companyAddress: {},
  companyPhone: {},
  contactName: {},
  jobTitle: {},
  contactPhone: {},
  contactEmail: {},
  password: {},
  _id: {},
  companyCode: {},
  guides: {},
  trips: {},
  about: {},
  locations: {},
  permits: {},
  rating: {},
});

module.exports = mongoose.model('Company', CompanySchema);
