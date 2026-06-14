@echo off
echo Starting Blood Donation Backend Server...
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the server
echo Starting server on http://localhost:5000
echo.
npm start

pause
