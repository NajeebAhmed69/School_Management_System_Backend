const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  profile: {
    phone: String,
    avatar: String,
    address: String
  },
  linkedStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // optional for parents
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);


