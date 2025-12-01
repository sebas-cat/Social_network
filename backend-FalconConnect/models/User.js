const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  career: {
    code: { type: String },
    name: { type: String },
  },
  imageUrl: { type: String },
  biography: { type: String },
  location: { type: String },
  privacy: {
    profile: { type: String, default: 'public' }, // public | friends | private
    posts: { type: String, default: 'public' },
  },
  role: {
    type: String,
    default: 'student', // student | professor | admin...
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  collection: 'users',
});

module.exports = model('User', userSchema);
