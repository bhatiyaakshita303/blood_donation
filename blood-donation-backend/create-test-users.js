const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blood_donation', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB');
    createTestUsers();
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

async function createTestUsers() {
    try {
        // Create test donors
        const testDonors = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@test.com',
                phone: '1234567890',
                dateOfBirth: '1985-05-15',
                bloodType: 'O+',
                role: 'donor',
                password: 'password123',
                receiveNotifications: true,
                isActive: true
            },
            {
                firstName: 'Sarah',
                lastName: 'Wilson',
                email: 'sarah.wilson@test.com',
                phone: '0987654321',
                dateOfBirth: '1990-08-22',
                bloodType: 'A-',
                role: 'donor',
                password: 'password123',
                receiveNotifications: true,
                isActive: true
            },
            {
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike.johnson@test.com',
                phone: '5551234567',
                dateOfBirth: '1978-12-10',
                bloodType: 'B+',
                role: 'donor',
                password: 'password123',
                receiveNotifications: false,
                isActive: true
            }
        ];

        // Create test patients
        const testPatients = [
            {
                firstName: 'Alice',
                lastName: 'Cooper',
                email: 'alice.cooper@test.com',
                phone: '1112223333',
                dateOfBirth: '1992-03-18',
                bloodType: 'B+',
                role: 'patient',
                password: 'password123',
                receiveNotifications: true,
                isActive: true
            },
            {
                firstName: 'Mark',
                lastName: 'Evans',
                email: 'mark.evans@test.com',
                phone: '4445556666',
                dateOfBirth: '1988-07-25',
                bloodType: 'AB-',
                role: 'patient',
                password: 'password123',
                receiveNotifications: true,
                isActive: true
            },
            {
                firstName: 'Emily',
                lastName: 'Brown',
                email: 'emily.brown@test.com',
                phone: '7778889999',
                dateOfBirth: '1995-11-30',
                bloodType: 'O-',
                role: 'patient',
                password: 'password123',
                receiveNotifications: false,
                isActive: true
            }
        ];

        // Insert test donors
        for (const donor of testDonors) {
            const existingDonor = await User.findOne({ email: donor.email });
            if (!existingDonor) {
                await User.create(donor);
                console.log(`✅ Created donor: ${donor.firstName} ${donor.lastName} (${donor.email})`);
            } else {
                console.log(`⚠️  Donor already exists: ${donor.email}`);
            }
        }

        // Insert test patients
        for (const patient of testPatients) {
            const existingPatient = await User.findOne({ email: patient.email });
            if (!existingPatient) {
                await User.create(patient);
                console.log(`✅ Created patient: ${patient.firstName} ${patient.lastName} (${patient.email})`);
            } else {
                console.log(`⚠️  Patient already exists: ${patient.email}`);
            }
        }

        console.log('\n🎉 Test users created successfully!');
        console.log('\n👥 Test Donors:');
        testDonors.forEach(donor => {
            console.log(`  ${donor.firstName} ${donor.lastName} - ${donor.email} - ${donor.bloodType}`);
        });

        console.log('\n🏥 Test Patients:');
        testPatients.forEach(patient => {
            console.log(`  ${patient.firstName} ${patient.lastName} - ${patient.email} - ${patient.bloodType}`);
        });

        console.log('\n🔐 All test users can login with password: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test users:', error);
        process.exit(1);
    }
}
