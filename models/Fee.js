
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String }, // cash, bank, online
  ref: String
}, { _id: false });

const FeeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  description: String,
  amount: { type: Number, required: true },
  dueDate: Date,
  status: { type: String, enum: ['paid','pending','partial','overdue'], default: 'pending' },
  payments: [PaymentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fee', FeeSchema);