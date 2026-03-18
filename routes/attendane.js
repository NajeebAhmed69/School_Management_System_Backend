
const express = require('express');
const router = express.Router();
const attendanceCtrl = require('../controllers/attendanceController');
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');

// mark attendance (bulk)
router.post('/', auth, rbac(['teacher','admin']), attendanceCtrl.markAttendanceBulk);

// get attendance for student
router.get('/student/:id', auth, rbac.rbacMiddleware(['admin','teacher','parent','student']), attendanceCtrl.getAttendanceForStudent);

// monthly class summary
router.get('/summary/monthly', auth, rbac.rbacMiddleware(['admin','teacher']), attendanceCtrl.monthlyClassSummary);

module.exports = router;