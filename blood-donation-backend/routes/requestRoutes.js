const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus, patientContactDonor, donationDone, getDonorHistory } = require('../controllers/requestController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createRequest)
    .get(protect, getRequests);

router.route('/:id')
    .put(protect, admin, updateRequestStatus); // Only admin can update request status

router.patch("/contact-donor/:id", protect, patientContactDonor);

router.patch("/donation-done/:id", protect, donationDone);

router.get('/donor-history', protect, getDonorHistory);

module.exports = router;
