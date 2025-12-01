const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const shareSchema = new Schema({
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
  collection: 'shares',
});

module.exports = model('Share', shareSchema);
