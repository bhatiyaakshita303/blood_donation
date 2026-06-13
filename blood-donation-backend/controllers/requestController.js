const BloodRequest = require('../models/BloodRequest');

const createRequest = async (req, res) => {
    const { patientName, bloodGroup, quantity, reason } = req.body;

    try {
        const newRequest = await BloodRequest.create({
            user: req.user._id,
            patientName,
            bloodGroup,
            quantity,
            reason
        });
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const patientContactDonor = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.status = "patient_contacted";
        await request.save();

        res.json({ message: "Patient contacted donor", request });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const donationDone = async (req, res) => {
    try {

        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.status = "completed";
        await request.save();

        res.json({ message: "Donation marked as done. Waiting for admin approval.", request });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDonorHistory = async (req, res) => {
    try {

        console.log("Logged donor ID:", req.user._id);

        const donations = await BloodRequest.find({
            donorId: req.user._id,
            status: "completed"
        });

        console.log("Donations found:", donations);

        res.json(donations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRequests = async (req, res) => {
    try {
        let requests;
        // Admins can see all, donors and patients see only their requests
        if (req.user.role === 'admin') {
            requests = await BloodRequest.find().populate('user', 'name email');
        } else {
            requests = await BloodRequest.find({ user: req.user._id });
        }
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await BloodRequest.findById(req.params.id);

        if (request) {
            request.status = status;
            await request.save();
            res.json(request);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRequest,
    getRequests,
    updateRequestStatus,
    patientContactDonor,
    donationDone,
    getDonorHistory
};
