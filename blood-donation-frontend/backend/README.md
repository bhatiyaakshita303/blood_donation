# Blood Donation Backend Server

## Quick Setup Guide

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will start on http://localhost:5000

### 3. Verify Server is Running
Open your browser and go to: http://localhost:5000/api/users
You should see an empty users array if the server is working.

### 4. Test Registration
1. Make sure the backend server is running (you should see "Server running on http://localhost:5000")
2. Go to the frontend application
3. Try to register a new user
4. Check the backend console for registration messages

### 5. Check Database
After registration, you can check the database:
```bash
sqlite3 blood_donation.db
.tables
SELECT * FROM users;
```

## Troubleshooting

### If you get "Backend server is not running":
1. Make sure you're in the backend directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server
4. Check for any error messages in the terminal

### If you get "Email already registered":
1. Check the database for existing users
2. Use a different email address
3. Or clear the database: `rm blood_donation.db`

### If you get port errors:
1. Make sure port 5000 is not in use
2. Or change the port in server.js

## Database Info
- Database file: `blood_donation.db`
- Table: `users`
- All registration data is stored here permanently
