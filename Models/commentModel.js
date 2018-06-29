const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentModel = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: new Date().toUTCString(),
  },
  likes: {
    type: Number,
  },
});


module.exports = mongoose.model('Comment', CommentModel);
