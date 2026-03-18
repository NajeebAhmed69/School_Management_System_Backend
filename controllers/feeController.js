
const Fee = require('../models/Fee');
const Student = require('../models/Student');

// Create fee invoice
exports.createFee = async (req, res) => {
    try {
        const { student, amount, dueDate, description } = req.body;
        if (!student || !amount) return res.status(400).json({ error: 'student and amount required' });

        // optional: verify student exists
        const s = await Student.findById(student);
        if (!s) return res.status(400).json({ error: 'Invalid student id' });

        const fee = await Fee.create({
             student,
             amount,
             dueDate, 
             description, 
             status: amount === 0 ? 'paid' : 'pending' 
            });
        res.status(201).json(fee);
    } catch (err) {
        console.error('createFee', err);
        res.status(500).json({ error: err.message });
    }
};

// Pay (add payment) -> updates status
exports.addPayment = async (req, res) => {
    try {
        const { feeId } = req.params;
        const { amount, method, ref } = req.body;
        if (!amount) return res.status(400).json({ error: 'amount is required' });

        const fee = await Fee.findById(feeId);

        if (!fee) return res.status(404).json({ error: 'Fee not found' });

        fee.payments.push({ amount, method, ref });
        const totalPaid = fee.payments.reduce((s, p) => s + p.amount, 0);

        if (totalPaid >= fee.amount) fee.status = 'paid';
        else if (totalPaid > 0) fee.status = 'partial';

        await fee.save();
        res.json(fee);
    } catch (err) {
        console.error('addPayment', err);
        res.status(500).json({ error: err.message });
    }
};

// Get student fees
exports.getFeesForStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const fees = await Fee.find({ student: studentId }).sort({ createdAt: -1 });
        res.json(fees);
    } catch (err) {
        console.error('getFeesForStudent', err);
        res.status(500).json({ error: err.message });
    }
};

// List fees (with filters)
exports.listFees = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        const fees = await Fee.find(filter).skip((page - 1) * limit).limit(parseInt(limit)).populate('student');

        //Used for frontend pagination
        const total = await Fee.countDocuments(filter);
        res.json({ fees, total });
    } catch (err) {
        console.error('listFees', err);
        res.status(500).json({ error: err.message });
    }
};