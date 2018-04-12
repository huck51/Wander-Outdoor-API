const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentModel = new Schema({
  author: {
    type: ref,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  }
});


module.exports = mongoose.model('Comment', CommentModel);
