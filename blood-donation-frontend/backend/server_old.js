const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models
const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./blood_donation.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        dateOfBirth TEXT NOT NULL,
        bloodType TEXT NOT NULL,
        role TEXT NOT NULL,
        password TEXT NOT NULL,
        receiveNotifications INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created or already exists.');
        }
    });
}

// Routes

// Register user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dateOfBirth, bloodType, role, password, receiveNotifications } = req.body;
        
        console.log('Registration request:', { firstName, lastName, email, role, bloodType });
        
        // Check if user already exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (row) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert new user
            const sql = `INSERT INTO users (firstName, lastName, email, phone, dateOfBirth, bloodType, role, password, receiveNotifications)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [firstName, lastName, email, phone, dateOfBirth, bloodType, role, hashedPassword, receiveNotifications ? 1 : 0], function(err) {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ success: false, message: 'Registration failed' });
                }
                
                console.log('User registered successfully:', { id: this.lastID, email });
                
                res.status(201).json({
                    success: true,
                    message: 'Registration successful',
                    user: {
                        id: this.lastID,
                        firstName,
                        lastName,
                        email,
                        role,
                        bloodType,
                        phone,
                        dateOfBirth
                    }
                });
            });
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login request:', { email });
        
        // Find user by email
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
            
            // Compare password
            const match = await bcrypt.compare(password, user.password);
            
            if (!match) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
            
            console.log('User logged in successfully:', { id: user.id, email });
            
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    bloodType: user.bloodType
                }
            });
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all users (for testing)
app.get('/api/users', (req, res) => {
    db.all('SELECT id, firstName, lastName, email, role, bloodType, createdAt FROM users', [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({
            success: true,
            users: rows
        });
    });
});

// Blood requests endpoints
app.get('/api/blood-requests', async (req, res) => {
  try {
    const requests = await db.all('SELECT * FROM blood_requests WHERE status = ?', ['pending']);
    
    res.json({ 
      success: true, 
      data: requests,
      message: 'Blood requests retrieved successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving blood requests',
      error: error.message 
    });
  }
});

// Get blood requests for specific patient
app.get('/api/blood-requests/patient/:email', async (req, res) => {
  try {
    const patientEmail = req.params.email;
    
    // Find patient first to get their ID
    const patient = await db.get('SELECT id FROM users WHERE email = ?', [patientEmail]);
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    // Get all requests for this patient
    const requests = await db.all('SELECT * FROM blood_requests WHERE patientId = ?', [patient.id]);
    
    res.json({ 
      success: true, 
      data: requests,
      message: 'Patient blood requests retrieved successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving patient blood requests',
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Database: blood_donation.db');
});

// Error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
