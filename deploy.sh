#!/bin/bash

# Ensure script exits immediately if any command fails
set -e

echo "Starting deployment setup..."

# Navigate to project root
cd "${PWD}"

# Check if package.json exists at root
if [ -f "package.json" ]; then
  # Frontend build
  echo "Installing frontend dependencies..."
  npm install

  echo "Building frontend..."
  npm run build
else
  echo "No package.json found at root, skipping frontend build."
fi

# Create the models directory in backend if it doesn't exist
echo "Setting up backend directory structure..."
mkdir -p backend/models

# Move the User model to the correct location if it exists
if [ -f "backend/modals/user.js" ]; then
  echo "Moving User model to correct location..."
  cp -f backend/modals/user.js backend/models/user.js
else
  echo "User model not found in modals directory, checking if it already exists in models..."
  if [ ! -f "backend/models/user.js" ]; then
    echo "ERROR: User model not found in either directory!"
    exit 1
  fi
fi

# Backend setup
echo "Installing backend dependencies..."
cd backend
npm install

# Move back to root directory
cd ..

echo "Deployment setup complete!"