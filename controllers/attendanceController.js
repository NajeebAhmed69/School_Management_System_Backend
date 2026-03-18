
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance (bulk or single). Expect body: { records: [{ student, date, status, class, section, notes }] }
exports.markAttendanceBulk = async (req, res) => {
    try {
        const { records } = req.body;
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ error: 'records array required' });
        }

        const results = [];
        for (const r of records) {
            const doc = {
                student: r.student,
                date: r.date ? new Date(r.date) : new Date(),
                status: r.status || 'present',
                class: r.class,
                section: r.section,
                notes: r.notes,
                markedBy: req.user ? req.user._id : undefined
            };
            try {
                const saved = await Attendance.findOneAndUpdate(
                    { 
                        student: doc.student, 
                        date: { 
                            $gte: new Date(doc.date.setHours(0, 0, 0, 0)), 
                            $lt: new Date(doc.date.setHours(23, 59, 59, 999)) 
                        } 
                    },
                    { $set: doc },
                    { upsert: true, new: true }
                );
                results.push({ student: doc.student, status: 'ok', id: saved._id });
            } catch (e) {
                results.push({ student: doc.student, status: 'error', message: e.message });
            }
        }

        res.json({ results });
    } catch (err) {
        console.error('markAttendanceBulk', err);
        res.status(500).json({ error: err.message });
    }
};

// Get attendance for a student (range)
exports.getAttendanceForStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { from, to } = req.query;
        const filter = { student: id };
        // “Get attendance where student = this ID”
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }
        const records = await Attendance.find(filter).sort({ date: -1 });
        res.json(records);
    } catch (err) {
        console.error('getAttendanceForStudent', err);
        res.status(500).json({ error: err.message });
    }
};

// Monthly attendance summary for a class It creates a monthly attendance report for a class, showing how many times each student was present, absent. 
exports.monthlyClassSummary = async (req, res) => {
    try {
        const { className, month, year } = req.query;
        if (!className || !month || !year) return res.status(400).json({ error: 'className, month, year required' });

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const agg = await Attendance.aggregate([
            { 
                $match: 
                { 
                    class: className,
                     date: { 
                        $gte: start, $lt: end
                        } 
                } 
                },
            { 
                $group: 
                { 
                    _id: { 
                        student: '$student', status: '$status' 
                    }, 
                    count: 
                    {
                     $sum: 1 
                    } 
                } 
            },
            { 
                $group: { 
                    _id: '$_id.student', 
                    statuses: { 
                        $push: { 
                            status: '$_id.status', 
                            count: '$count' 
                        } 
                    } 
                } 
            },
        ]);
        res.json({ data: agg });
    } catch (err) {
        console.error('monthlyClassSummary', err);
        res.status(500).json({ error: err.message });
    }
};