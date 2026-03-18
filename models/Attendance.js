
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: String,
  section: String,
  date: { type: Date, required: true },
  status: { type: String, enum: ['present','absent','late','leave'], default: 'present' },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // teacher/admin who marked
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

// avoid duplicate attendance for same student+date
AttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);