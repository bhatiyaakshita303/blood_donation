const express = require('express');
const router = express.Router();
const {
    getUsersByRole,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserStats,
    toggleUserStatus
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController');

router.get('/profile', protect, getUserProfile);

// Get users by role
router.get('/role/:role', getUsersByRole);

// Get all users with filtering and pagination
router.get('/', getAllUsers);

// Get user statistics
router.get('/stats', getUserStats);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Toggle user active status
router.patch('/:id/toggle-status', toggleUserStatus);

module.exports = router;
