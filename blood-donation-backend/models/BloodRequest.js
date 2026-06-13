const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true },
    hospital: { type: String, required: true },
    urgency: { type: String, required: true, enum: ['normal', 'urgent', 'critical'], default: 'normal' },
    requiredDate: { type: Date, required: true },
    contactPhone: { type: String, required: true },
    status: {
        type: String,
        enum: [
            'pending',
            'approved',
            'donor_responded',
            'patient_contacted',
            'donation_done',
            'completed',
            'rejected'
        ],
        default: 'pending'
    },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    donorName: { type: String },
    donorContact: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    completedAt: { type: Date },
    notes: { type: String }
}, { timestamps: true });

// Index for faster queries
bloodRequestSchema.index({ user: 1, status: 1 });
bloodRequestSchema.index({ bloodGroup: 1, status: 1 });
bloodRequestSchema.index({ urgency: 1, requiredDate: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
