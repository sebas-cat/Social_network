const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: [{
    type: String, // puede ser texto, URL de imagen, etc
  }],
  description: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
  like_count: {
    type: Number,
    default: 0,
  },
  comment_count: {
    type: Number,
    default: 0,
  },
  share_count: {
    type: Number,
    default: 0,
  },
  communityID: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
  },
  visibility: {
    type: String, // public | friends | private | community
    default: 'public',
  },
  status: {
    type: String, // active | archived | deleted ...
    default: 'active',
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  collection: 'posts',
});

module.exports = model('Post', postSchema);
