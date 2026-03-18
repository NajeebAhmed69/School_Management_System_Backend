const Student = require('../models/Student');

// Create a new student
exports.createStudent = async (req, res) => {

    try {
      const data = req.body;
      if (!data.firstName || !data.admissionNo || !data.class) {
      return res.status(400).json({ error: 'firstName, admissionNo and class are required' });
    }
    const exists = await Student.findOne({ admissionNo: data.admissionNo });
    if (exists) return res.status(400).json({ error: 'Admission number already exists' });
    const student = await Student.create(data);
    res.status(201).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// List students with pagination & simple search
exports.listStudents = async (req, res) => {
  try {
    let { page = 1, limit = 20, q } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = q ? {
      $or: [
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { admissionNo: new RegExp(q,
        'i') },
        { class: new RegExp(q, 'i') }
      ]
    } : {};

    const data = await Student.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filter);
    res.json({ data, total, page, limit });
  } catch (err) {
    console.error('listStudents error', err);
    res.status(500).json({ error: err.message });
  }
};

// Get single student
exports.getStudent = async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Student not found' });
    res.json(s);
  } catch (err) {
    console.error('getStudent', err);
    res.status(500).json({ error: err.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const data = req.body;
    const s = await Student.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!s) return res.status(404).json({ error: 'Student not found' });
    res.json(s);
  } catch (err) {
    console.error('updateStudent', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const s = await Student.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteStudent', err);
    res.status(500).json({ error: err.message });
  }
}