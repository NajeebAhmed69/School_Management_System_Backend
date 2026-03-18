
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require("../models/blacklist")



const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES ='8h';
exports.register = async (req, res) => {
    try {
        const { name, email, password, roleName } = req.body;
        // Check if user already exists
        const exists = await User.findOne({ email })
        if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
        if (exists) {
            return res.status(400).json({ message: 'User already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await Role.findOne({ name: roleName }) || await Role.findOne({ name: 'student' });
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role ? role._id : undefined,
        });
        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (error) {
   console.error(error);
    res.status(500).json({ error: 'Server error' });
    }
}


exports.login=async(req,res)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
        const user = await User.findOne({ email }).populate('role');
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
        const payload = { userId: user._id, role: user.role ? user.role.name : 'student' };
         const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
         
        res.cookie("token", token)
        res.json({
          token,
          user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role ? user.role.name : 'student',
      }
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.logout=async (req, res) => {
      const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}
