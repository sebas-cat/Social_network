const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const likeSchema = new Schema({
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
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'likes',
});

module.exports = model('Like', likeSchema);
