const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseID: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  content: {
    text: { type: String },
    images: { type: String }, // o [String] si quieres varias
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'notes',
});

module.exports = model('Note', noteSchema);
