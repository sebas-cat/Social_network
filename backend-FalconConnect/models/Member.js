const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const memberSchema = new Schema({
  communityID: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String, // admin | moderator | member
    default: 'member',
  },
  status: {
    type: String, // active | banned | pending
    default: 'active',
  },
  join_date: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'members',
});

module.exports = model('Member', memberSchema);
