@echo off
REM Progress Photos Setup Script for Windows

echo Setting up Progress Photos application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm install

REM Create necessary directories
echo Creating directories...
if not exist "data" mkdir data
if not exist "uploads" mkdir uploads
if not exist "uploads\thumbnails" mkdir uploads\thumbnails

echo Setup complete!
echo.
echo To start the development server, run:
echo npm run dev
echo.
echo Then open http://localhost:3000 in your browser.
pause
