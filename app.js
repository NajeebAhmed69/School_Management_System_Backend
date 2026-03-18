const express = require('express');
const connectDB = require('./configs/db');
require('dotenv').config();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const app = express();
const authRoutes=require('./routes/auth');
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const feeRoutes = require("./routes/fees");
const errorHandler = require("./middlewares/errorHandler");
// Connect to MongoDB
connectDB();
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
// Middleware to parse JSON
app.use(express.json());
// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
// Error handling middleware
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})