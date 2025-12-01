const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  courseID: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  description: { type: String },
  documentURL: [{
    type: String,
  }],
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'projects',
});

module.exports = model('Project', projectSchema);
