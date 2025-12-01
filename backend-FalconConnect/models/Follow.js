const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const followSchema = new Schema({
  followerID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followedID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'follows',
});

module.exports = model('Follow', followSchema);
