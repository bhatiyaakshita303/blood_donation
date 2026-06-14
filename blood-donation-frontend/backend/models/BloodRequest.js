const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  hospital: {
    type: String,
    required: true,
    trim: true
  },
  urgency: {
    type: String,
    required: true,
    enum: ['normal', 'urgent', 'critical']
  },
  requiredDate: {
    type: Date,
    required: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
