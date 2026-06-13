const mongoose = require('mongoose');

const bloodStockSchema = new mongoose.Schema({
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  units: {
    type: Number,
    required: true,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Available', 'Low', 'Critical', 'Out of Stock'],
    default: 'Available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BloodStock', bloodStockSchema);
