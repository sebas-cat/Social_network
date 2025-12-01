const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  senderID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  attachments: [{
    type: String,
  }],
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String, // sent | delivered | read
    default: 'sent',
  },
}, {
  collection: 'messages',
});

module.exports = model('Message', messageSchema);
