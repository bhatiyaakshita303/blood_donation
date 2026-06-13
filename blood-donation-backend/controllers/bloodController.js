const BloodStock = require('../models/BloodStock');

// REST API endpoints for blood stocks
const getBloodStocks = async (req, res) => {
    try {
        const stocks = await BloodStock.find({});
        res.json({
            success: true,
            data: stocks,
            count: stocks.length
        });
    } catch (error) {
        console.error('Get blood stocks error:', error);
        res.status(500).json({ message: error.message });
    }
};

const addBloodStock = async (req, res) => {
    try {
        console.log('=== ADD BLOOD STOCK ===');
        console.log('Request body:', req.body);
        
        const { bloodType, units } = req.body;
        
        if (!bloodType || !units) {
            console.log('❌ Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Blood type and units are required'
            });
        }
        
        console.log('Looking for existing stock:', bloodType);
        let stock = await BloodStock.findOne({ bloodType });
        console.log('Found stock:', stock);
        
        // Calculate status based on total units
        let totalUnits = units;
        if (stock) {
            totalUnits = stock.units + units;
        }
        
        let status = 'Available';
        if (totalUnits === 0) {
            status = 'Out of Stock';
        } else if (totalUnits < 5) {
            status = 'Low';
        }
        
        if (stock) {
            // Update existing stock
            console.log('Updating existing stock');
            stock.units += units;
            stock.status = status;
            stock.lastUpdated = new Date();
            await stock.save();
        } else {
            // Create new stock
            console.log('Creating new stock');
            stock = await BloodStock.create({
                bloodType,
                units,
                status,
                lastUpdated: new Date()
            });
        }
        
        console.log('✅ Stock saved:', stock);
        res.status(201).json({
            success: true,
            data: stock,
            message: 'Blood stock added successfully'
        });
    } catch (error) {
        console.error('Add blood stock error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Internal server error',
            error: error.stack
        });
    }
};

const updateBloodStock = async (req, res) => {
    try {
        console.log('=== UPDATE BLOOD STOCK ===');
        console.log('Request body:', req.body);
        
        const { id } = req.params;
        const updateData = req.body;
        
        const stock = await BloodStock.findByIdAndUpdate(id, updateData, { new: true });
        
        res.json({
            success: true,
            data: stock,
            message: 'Blood stock updated successfully'
        });
    } catch (error) {
        console.error('Update blood stock error:', error);
        res.status(500).json({ message: error.message });
    }
};

const deleteBloodStock = async (req, res) => {
    try {
        console.log('=== DELETE BLOOD STOCK ===');
        console.log('Request params:', req.params);
        
        const { id } = req.params;
        
        const stock = await BloodStock.findByIdAndDelete(id);
        
        res.json({
            success: true,
            data: stock,
            message: 'Blood stock deleted successfully'
        });
    } catch (error) {
        console.error('Delete blood stock error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getBloodStocks,
    addBloodStock,
    updateBloodStock,
    deleteBloodStock
};
