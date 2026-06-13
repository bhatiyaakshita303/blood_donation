const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models
const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');

const app = express();
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Test endpoint to get all users (for development)
app.get('/api/test/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ 
      success: true, 
      data: users,
      message: 'Users retrieved successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving users',
      error: error.message 
    });
  }
});

// Blood requests endpoints
app.get('/api/blood-requests', authenticateToken, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: 'pending' })
      .populate('patientId', 'firstName lastName email bloodType')
      .sort({ createdAt: -1 });
    
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
app.get('/api/blood-requests/patient/:email', authenticateToken, async (req, res) => {
  try {
    const patientEmail = req.params.email;
    
    // Find patient first to get their ID
    const patient = await User.findOne({ email: patientEmail });
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    // Get all requests for this patient
    const requests = await BloodRequest.find({ patientId: patient._id })
      .sort({ createdAt: -1 });
    
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

// User management endpoints
app.get('/api/users/profile/:email', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      data: user,
      message: 'User profile retrieved successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving user profile',
      error: error.message 
    });
  }
});

app.put('/api/users/profile/:email', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, bloodType, emergencyContact } = req.body;
    
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { 
        firstName, 
        lastName, 
        phone, 
        address, 
        bloodType, 
        emergencyContact,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      data: user,
      message: 'User profile updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating user profile',
      error: error.message 
    });
  }
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, bloodType, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'patient',
      bloodType,
      phone,
      createdAt: new Date()
    });

    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error registering user',
      error: error.message 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        role: user.role,
        bloodType: user.bloodType 
      },
      message: 'Login successful' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error logging in',
      error: error.message 
    });
  }
});

// Admin endpoints
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }

    const users = await User.find({}).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: users,
      message: 'Users retrieved successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving users',
      error: error.message 
    });
  }
});

app.get('/api/admin/blood-requests', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }

    const requests = await BloodRequest.find({})
      .populate('patientId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
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

// Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blood-donation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`MongoDB connected: ${process.env.MONGODB_URI}`);
  });
}).catch((error) => {
  console.error('Database connection error:', error);
});

module.exports = app;
