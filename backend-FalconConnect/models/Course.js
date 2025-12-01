const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const courseSchema = new Schema({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId, // creador / profesor
    ref: 'User',
  },
  career: [{
    code: { type: String },
    name: { type: String },
  }],
  instructor: { type: String },
}, {
  collection: 'courses',
});

module.exports = model('Course', courseSchema);
