const User = require('../models/User');

// Get all users by role
const getUsersByRole = async (req, res) => {
    try {
        console.log('=== BACKEND USER CONTROLLER DEBUG ===');
        console.log('Request received for getUsersByRole');
        console.log('Role parameter:', req.params.role);
        console.log('Request method:', req.method);
        console.log('Request URL:', req.originalUrl);
        
        const { role } = req.params;
        
        // Validate role
        if (!['donor', 'patient', 'admin'].includes(role)) {
            console.log('Invalid role specified:', role);
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        console.log('Querying database for role:', role);
        
        // Add pagination for better performance
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // Reduced from 50 to 10
        const skip = (page - 1) * limit;

        // Use lean() for better performance and select only needed fields
        const users = await User.find({ role })
            .select('firstName lastName email phone bloodType role createdAt isActive') // Only select needed fields
            .lean() // Return plain JavaScript objects for better performance
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        console.log('Found users:', users.length);
        console.log('Sample user:', users[0] ? users[0].email : 'No users found');

        const response = {
            success: true,
            data: users,
            count: users.length,
            pagination: {
                page: page,
                limit: limit,
                hasMore: users.length === limit
            }
        };
        
        console.log('Sending response:', response);
        res.json(response);
    } catch (error) {
        console.error('Get users by role error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users',
            error: error.message
        });
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;
        
        // Build filter
        const filter = {};
        if (role && role !== 'all') filter.role = role;
        
        // Add search functionality
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { bloodType: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user'
        });
    }
};

// Update user (admin only)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Remove sensitive fields from updates
        delete updates.password;
        delete updates.role; // Only super admin can change roles
        
        const user = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user'
        });
    }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting user'
        });
    }
};

// Get user statistics
const getUserStats = async (req, res) => {
    try {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        const bloodTypeStats = await User.aggregate([
            {
                $match: { bloodType: { $exists: true } }
            },
            {
                $group: {
                    _id: '$bloodType',
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentUsers = await User.find()
            .select('firstName lastName email role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                roleStats: stats,
                bloodTypeStats: bloodTypeStats,
                recentUsers: recentUsers
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching statistics'
        });
    }
};

// Toggle user active status (admin only)
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isActive = user.isActive === undefined ? false : !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user status'
        });
    }
};

// Get logged-in user profile
const getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};

module.exports = {
    getUsersByRole,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserStats,
    toggleUserStatus,
    getUserProfile
};
