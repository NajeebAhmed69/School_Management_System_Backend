const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
    }, 
    // superadmin, admin, teacher, student, parent
  permissions: [{ type: String }] // optional detail-based permissions
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);