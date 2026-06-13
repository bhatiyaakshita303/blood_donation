const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = 5000;

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:8080', 'http://127.0.0.1:4200'],
    credentials: true
}));

// Route files
const authRoutes = require('./routes/authRoutes');
const bloodRoutes = require('./routes/bloodRoutes');
const requestRoutes = require('./routes/requestRoutes');
const donorRoutes = require('./routes/donorRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const userRoutes = require('./routes/userRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/blood', bloodRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Blood Donation API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test users endpoint
app.get('/api/test/users', (req, res) => {
    User.find({}).select('-password').limit(5).then(users => {
        res.json({
            success: true,
            message: 'Test endpoint working',
            count: users.length,
            data: users
        });
    }).catch(error => {
        res.status(500).json({
            success: false,
            message: 'Test endpoint error',
            error: error.message
        });
    });
});

// Test donor endpoint specifically
app.get('/api/test/donors', (req, res) => {
    console.log('Test donor endpoint called');
    User.find({ role: 'donor' }).select('-password').limit(5).then(users => {
        console.log('Found donors:', users.length);
        res.json({
            success: true,
            message: 'Test donor endpoint working',
            count: users.length,
            data: users
        });
    }).catch(error => {
        console.error('Test donor endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Test donor endpoint error',
            error: error.message
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🩸 Blood Donation API Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: MongoDB (blood_donation)`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`👥 Users endpoint: http://localhost:${PORT}/api/users`);
    console.log(`🩸 Blood requests: http://localhost:${PORT}/api/blood-requests`);
});

// Error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
