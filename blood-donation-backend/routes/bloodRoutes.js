const express = require('express');
const router = express.Router();
const { getBloodStocks, addBloodStock, updateBloodStock, deleteBloodStock } = require('../controllers/bloodController');

// Public routes for blood stock management
router.get('/', getBloodStocks);
router.post('/', addBloodStock);
router.put('/:id', updateBloodStock);
router.delete('/:id', deleteBloodStock);

module.exports = router;
