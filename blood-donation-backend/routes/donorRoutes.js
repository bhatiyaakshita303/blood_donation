const express = require('express');
const router = express.Router();
const { getDonors, getDonorById, updateDonor } = require('../controllers/donorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getDonors);

router.route('/:id')
    .get(protect, getDonorById)
    .put(protect, updateDonor);

module.exports = router;
