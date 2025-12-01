const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const communitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: { type: String },
  type: {
    type: String, // course | project | interest | club
  },
  ownerID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  member_count: {
    type: Number,
    default: 0,
  },
  visibility: {
    type: String, // public | private
    default: 'public',
  },
}, {
  collection: 'communities',
});

module.exports = model('Community', communitySchema);
