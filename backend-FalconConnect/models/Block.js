const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const blockSchema = new Schema({
  blockerID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blockedID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'blocks',
});

module.exports = model('Block', blockSchema);
