const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  name: {
    type: String,
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  companyName: {
    type: String,
  },
  companyEmail: {
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
  },
  picture: {
    type: String,
  },
  stats: {},
  tripsQualified: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
  tripsCompleted: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
  certs: {
    type: [String],
  },
  activities: {
    type: [String],
  },
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
  roleGroup: {
    type: String,
  },
  bio: {
    type: String,
  },
  city: {
    type: String,
  },
  stateName: {
    type: String,
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  likes: {
    type: Number,
  },
  chex: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  companiesOwned: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  customer: {
    type: String,
  },
  subscribed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', UserSchema);
