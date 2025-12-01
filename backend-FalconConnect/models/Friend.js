const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const friendSchema = new Schema({
  requesterID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String, // pending | accepted | rejected
    default: 'pending',
  },
  date_request: {
    type: Date,
    default: Date.now,
  },
  date_update: {
    type: Date,
  },
}, {
  collection: 'friends',
});

module.exports = model('Friend', friendSchema);
