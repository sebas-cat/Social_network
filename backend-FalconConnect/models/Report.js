const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reportSchema = new Schema({
  reporterID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String, // post | comment | user | message
    required: true,
  },
  targetID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String, // open | reviewed | closed
    default: 'open',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'reports',
});

module.exports = model('Report', reportSchema);
