const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretblooddonationkey', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { firstName, lastName, email, phone, dateOfBirth, bloodType, role, password, receiveNotifications } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
            bloodType,
            role: role || 'donor', // default role
            password,
            receiveNotifications: receiveNotifications || false
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    dateOfBirth: user.dateOfBirth,
                    bloodType: user.bloodType,
                    role: user.role,
                    receiveNotifications: user.receiveNotifications
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    bloodType: user.bloodType,
                    role: user.role
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe };
