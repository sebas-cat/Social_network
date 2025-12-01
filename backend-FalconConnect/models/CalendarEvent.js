const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const calendarEventSchema = new Schema({
  ownerID: {
    type: Schema.Types.ObjectId, // dueño del calendario
    ref: 'User',
    required: true,
  },
  creatorID: [{
    type: String, // según diagrama array[string], puedes cambiar a ObjectId
  }],
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String, // class | exam | meeting | reminder
  },
  description: { type: String },
  courseID: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  startDate: { type: Date },
  endDate: { type: Date },
  allDay: { type: Boolean, default: false },
  location: { type: String },
  visibility: [{
    type: String, // public | private | course | community
  }],
  career: [{
    type: Object, // podrías detallar como { code, name } igual que en Course
  }],
  userID: {
    type: Schema.Types.ObjectId, // invitado principal u otro usuario relacionado
    ref: 'User',
  },
  status: {
    type: String,
    default: 'active',
  },
}, {
  collection: 'calendar_events',
});

module.exports = model('CalendarEvent', calendarEventSchema);
