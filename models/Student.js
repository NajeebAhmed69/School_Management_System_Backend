const mongoose = require('mongoose');

const ParentContactSchema = new mongoose.Schema({
  name: String,
  relation: String,
  phone: String
}, { _id: false });

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  dob: Date,
  gender: { type: String, enum: ['male','female','other'], default: 'male' },
  admissionNo: { type: String, required: true, unique: true },
  class: String,
  section: String,
  rollNo: String,
  parentContacts: [ParentContactSchema],
  healthInfo: String,
  address: String,
  photo: String,
  createdAt: { type: Date, default: Date.now }
});

StudentSchema.index({ admissionNo: 1 });

module.exports = mongoose.model('Student', StudentSchema);

