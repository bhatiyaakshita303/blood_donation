const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blood_donation', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB');
    createAdminUser();
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

async function createAdminUser() {
    try {
        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@bloodbank.com' });
        
        if (existingAdmin) {
            console.log('✅ Admin user already exists:');
            console.log('Email: admin@bloodbank.com');
            console.log('Password: admin123');
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@bloodbank.com',
            phone: '1234567890',
            dateOfBirth: '1990-01-01',
            bloodType: 'O+',
            role: 'admin',
            password: 'admin123',
            receiveNotifications: true,
            isActive: true
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@bloodbank.com');
        console.log('Password: admin123');
        console.log('');
        console.log('🔐 You can now login with these credentials');
        console.log('🌐 Go to: http://localhost:4200/login');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}
