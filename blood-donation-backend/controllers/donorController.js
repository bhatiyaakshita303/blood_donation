const User = require('../models/User');

// Admin gets all donors
const getDonors = async (req, res) => {
    try {
        const donors = await User.find({ role: 'donor' }).select('-password');
        res.json(donors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin or the Donor themselves can get the details
const getDonorById = async (req, res) => {
    try {
        const donor = await User.findById(req.params.id).select('-password');
        if (donor && (req.user.role === 'admin' || donor._id.toString() === req.user._id.toString())) {
            res.json(donor);
        } else {
            res.status(404).json({ message: 'Donor not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin or the Donor themselves can update info
const updateDonor = async (req, res) => {
    try {
        const donor = await User.findById(req.params.id);

        if (donor && (req.user.role === 'admin' || donor._id.toString() === req.user._id.toString())) {
            donor.name = req.body.name || donor.name;
            donor.bloodGroup = req.body.bloodGroup || donor.bloodGroup;
            donor.age = req.body.age || donor.age;
            donor.contact = req.body.contact || donor.contact;
            donor.address = req.body.address || donor.address;

            const updatedDonor = await donor.save();
            res.json({
                _id: updatedDonor._id,
                name: updatedDonor.name,
                email: updatedDonor.email,
                role: updatedDonor.role,
                bloodGroup: updatedDonor.bloodGroup,
                age: updatedDonor.age,
                contact: updatedDonor.contact,
                address: updatedDonor.address
            });
        } else {
            res.status(404).json({ message: 'Donor not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDonors, getDonorById, updateDonor };
