const express = require('express');
const router = express.Router();
const {
    createBloodRequest,
    getUserBloodRequests,
    getAllBloodRequests,
    getMatchingRequests,
    approveBloodRequest,
    rejectBloodRequest,
    completeBloodRequest,
    getBloodRequestStats,
    respondToBloodRequest
} = require('../controllers/bloodRequestController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// Create blood request
router.post('/', createBloodRequest);

// Get user's blood requests
router.get('/my-requests', getUserBloodRequests);

// Get matching requests (for donors)
router.get('/matching', getMatchingRequests);

// Get statistics
router.get('/stats', getBloodRequestStats);

// Get all blood requests (admin only)
router.get('/', getAllBloodRequests);

// Approve blood request (admin only)
router.patch('/:id/approve', approveBloodRequest);

// Reject blood request (admin only)
router.patch('/:id/reject', rejectBloodRequest);

// Complete blood request (admin only)
router.patch('/:id/complete', completeBloodRequest);

router.patch('/:id/respond', respondToBloodRequest); // donor responds

module.exports = router;
