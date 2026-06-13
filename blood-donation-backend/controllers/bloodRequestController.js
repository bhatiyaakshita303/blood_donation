const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

// Create a new blood request
const createBloodRequest = async (req, res) => {
    try {
        const {
            patientName,
            bloodGroup,
            quantity,
            reason,
            hospital,
            urgency,
            requiredDate,
            contactPhone,
            notes
        } = req.body;

        // Validate required fields
        if (!patientName || !bloodGroup || !quantity || !reason || !hospital || !requiredDate || !contactPhone) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Create blood request
        const bloodRequest = new BloodRequest({
            user: req.user.id,
            patientName,
            bloodGroup,
            quantity,
            reason,
            hospital,
            urgency: urgency || 'normal',
            requiredDate,
            contactPhone,
            notes
        });

        await bloodRequest.save();

        // Populate user information
        await bloodRequest.populate('user', 'firstName lastName email phone');

        res.status(201).json({
            success: true,
            message: 'Blood request created successfully',
            data: bloodRequest
        });
    } catch (error) {
        console.error('Create blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating blood request'
        });
    }
};

// Get all blood requests for a user
const getUserBloodRequests = async (req, res) => {
    try {
        // Get all requests for logged-in user (past + present + future)
        const requests = await BloodRequest.find({ user: req.user.id })
            .populate('user', 'firstName lastName email bloodType') // include bloodType if needed
            .populate('approvedBy', 'firstName lastName')
            .sort({ requiredDate: -1 }); // newest request first

        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Get user blood requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blood requests'
        });
    }
};

// Get all blood requests (for admin)
const getAllBloodRequests = async (req, res) => {
    try {
        const { status, urgency, bloodGroup } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (urgency) filter.urgency = urgency;
        if (bloodGroup) filter.bloodGroup = bloodGroup;

        const requests = await BloodRequest.find(filter)
            .populate('user', 'firstName lastName email phone bloodType')
            .populate('approvedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Get all blood requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blood requests'
        });
    }
};

// Get matching blood requests for donors
const getMatchingRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'donor') {
            return res.status(403).json({
                success: false,
                message: 'Only donors can view matching requests'
            });
        }

        // Get compatible blood groups
        const donorBloodGroup = user.bloodType;
        const compatibleGroups = getCompatibleBloodGroups(donorBloodGroup);

        // Find matching requests
        const requests = await BloodRequest.find({
            bloodGroup: { $in: compatibleGroups },
            status: 'approved'
        })
            .populate('user', 'firstName lastName phone')
            .sort({ urgency: -1, requiredDate: 1 });

        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Get matching requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching matching requests'
        });
    }
};

// Approve blood request (admin only)
const approveBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const request = await BloodRequest.findById(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request can only be approved if pending'
            });
        }

        request.status = 'approved';
        request.approvedBy = req.user.id;
        request.approvedAt = new Date();
        if (notes) request.notes = notes;

        await request.save();
        await request.populate('approvedBy', 'firstName lastName');

        res.json({
            success: true,
            message: 'Blood request approved successfully',
            data: request
        });
    } catch (error) {
        console.error('Approve blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while approving blood request'
        });
    }
};

// Reject blood request (admin only)
const rejectBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        const request = await BloodRequest.findById(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request can only be rejected if pending'
            });
        }

        request.status = 'rejected';
        request.rejectionReason = rejectionReason || 'Request rejected by admin';

        await request.save();

        res.json({
            success: true,
            message: 'Blood request rejected successfully',
            data: request
        });
    } catch (error) {
        console.error('Reject blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while rejecting blood request'
        });
    }
};

// Complete blood request (admin only)
const completeBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await BloodRequest.findById(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        if (request.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Request can only be completed if approved'
            });
        }

        request.status = 'completed';
        request.completedAt = new Date();

        await request.save();

        res.json({
            success: true,
            message: 'Blood request completed successfully',
            data: request
        });
    } catch (error) {
        console.error('Complete blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while completing blood request'
        });
    }
};

// Helper function to get compatible blood groups
function getCompatibleBloodGroups(donorGroup) {
    const compatibility = {
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'O-': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
        'A+': ['A+', 'AB+'],
        'A-': ['A+', 'A-', 'AB+', 'AB-'],
        'B+': ['B+', 'AB+'],
        'B-': ['B+', 'B-', 'AB+', 'AB-'],
        'AB+': ['AB+'],
        'AB-': ['AB+', 'AB-']
    };

    return compatibility[donorGroup] || [];
}

// Get blood request statistics
const getBloodRequestStats = async (req, res) => {
    try {
        const stats = await BloodRequest.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const urgencyStats = await BloodRequest.aggregate([
            {
                $group: {
                    _id: '$urgency',
                    count: { $sum: 1 }
                }
            }
        ]);

        const bloodGroupStats = await BloodRequest.aggregate([
            {
                $group: {
                    _id: '$bloodGroup',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                statusStats: stats,
                urgencyStats: urgencyStats,
                bloodGroupStats: bloodGroupStats
            }
        });
    } catch (error) {
        console.error('Get blood request stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
};

// ---------
const respondToBloodRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        const request = await BloodRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "approved") {
            return res.status(400).json({
                message: "Only approved requests can be responded to"
            });
        }

        const donor = await User.findById(req.user.id);

        request.donorId = donor._id;
        request.donorName = donor.firstName + " " + donor.lastName;
        request.donorContact = donor.phone;
        request.status = "donor_responded";

        await request.save();

        res.json({
            success: true,
            message: "Donor response recorded",
            data: request
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBloodRequest,
    getUserBloodRequests,
    getAllBloodRequests,
    getMatchingRequests,
    approveBloodRequest,
    rejectBloodRequest,
    completeBloodRequest,
    getBloodRequestStats,
    respondToBloodRequest
};
