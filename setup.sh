#!/bin/bash

# Progress Photos Setup Script
echo "Setting up Progress Photos application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create necessary directories
echo "Creating directories..."
mkdir -p data
mkdir -p uploads
mkdir -p uploads/thumbnails

# Set permissions
chmod 755 data
chmod 755 uploads
chmod 755 uploads/thumbnails

echo "Setup complete!"
echo ""
echo "To start the development server, run:"
echo "npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser."
