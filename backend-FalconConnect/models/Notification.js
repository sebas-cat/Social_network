const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String, // like | comment | follow | message | event...
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean, // true = leída, false = no leída
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  referenceID: {
    type: Schema.Types.ObjectId, // post, comment, user, event, etc
  },
  referenceType: {
    type: String, // "Post", "Comment", "User", "CalendarEvent", etc
  },
}, {
  collection: 'notifications',
});

module.exports = model('Notification', notificationSchema);
