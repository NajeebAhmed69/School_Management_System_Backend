const express = require('express');
const router = express.Router();
const feeCtrl = require('../controllers/feeController');
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');

// create fee (admin)
router.post('/', auth, rbac(['admin']), feeCtrl.createFee);

// add payment (any finance person/admin)
router.post('/:feeId/pay', auth, rbac.rbacMiddleware(['admin','superadmin']), feeCtrl.addPayment);

// get fees for a student (parent/student themselves or admin)
router.get('/student/:studentId', auth, rbac.rbacMiddleware(['admin','teacher','parent','student']), feeCtrl.getFeesForStudent);

// list all fees (admin)
router.get('/', auth, rbac.rbacMiddleware(['admin']), feeCtrl.listFees);

module.exports = router;