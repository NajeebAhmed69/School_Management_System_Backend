
const express = require('express');
const router = express.Router();
const studentCtrl = require('../controllers/studentController');
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');

// create student (admin/teacher)
router.post('/', auth, rbac.rbacMiddleware(['admin','teacher']), studentCtrl.createStudent);

// list (admin/teacher/parent/student)
router.get('/', auth, rbac.rbacMiddleware(['admin','teacher','parent','student']), studentCtrl.listStudents);

// get single
router.get('/:id', auth, rbac.rbacMiddleware(['admin','teacher','parent','student']), studentCtrl.getStudent);

// update
router.put('/:id', auth, rbac.rbacMiddleware(['admin','teacher']), studentCtrl.updateStudent);

// delete
router.delete('/:id', auth, rbac.rbacMiddleware(['admin']), studentCtrl.deleteStudent);

module.exports = router;