const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  postID: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'comments',
});

module.exports = model('Comment', commentSchema);
