const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuideSchema = new Schema({
  firstName: {},
  lastName: {},
  companyName: {},
  companyCode: {},
  email: {},
  phone: {},
  DOB: {},
  username: {},
  password: {},
  bio: {},
  certs: {},
  profilePic: {},
  _id: {},
  rating: {},
  trips: {},
});


module.exports = mongoose.model('Guide', GuideSchema);
