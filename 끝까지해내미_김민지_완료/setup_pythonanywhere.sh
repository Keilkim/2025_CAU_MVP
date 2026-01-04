#!/bin/bash

# PythonAnywhere Setup Script for AllerAlert
# Run this script in PythonAnywhere Bash console

echo "========================================="
echo "AllerAlert PythonAnywhere Setup Script"
echo "========================================="

# Configuration
USERNAME="kimseunghun"
PROJECT_DIR="/home/${USERNAME}/Alleralert"
BACKEND_DIR="${PROJECT_DIR}/backend"

# Step 1: Navigate to project directory
echo "1. Navigating to project directory..."
cd "$PROJECT_DIR" || { echo "Error: Project directory not found"; exit 1; }

# Step 2: Create virtual environment
echo "2. Creating virtual environment..."
mkvirtualenv --python=python3.10 Alleralert

# Activate virtual environment
workon Alleralert

# Step 3: Install requirements
echo "3. Installing Python packages..."
pip install -r requirements.txt

# Step 4: Create necessary directories
echo "4. Creating necessary directories..."
mkdir -p "${BACKEND_DIR}/uploads"
mkdir -p "${PROJECT_DIR}/logs"

# Step 5: Set permissions
echo "5. Setting file permissions..."
chmod 775 "${BACKEND_DIR}/uploads"

# Step 6: Create .env file from template
echo "6. Setting up environment file..."
if [ ! -f "${PROJECT_DIR}/.env" ]; then
    if [ -f "${PROJECT_DIR}/.env.example" ]; then
        cp "${PROJECT_DIR}/.env.example" "${PROJECT_DIR}/.env"
        echo "Created .env file from template. Please edit it with your actual values."
    else
        echo "Warning: .env.example not found"
    fi
else
    echo ".env file already exists"
fi

# Step 7: Initialize database
echo "7. Initializing database..."
cd "$BACKEND_DIR"
python -c "from app import init_db; init_db()"

# Set database permissions
if [ -f "${BACKEND_DIR}/alleralert.db" ]; then
    chmod 664 "${BACKEND_DIR}/alleralert.db"
    echo "Database initialized and permissions set"
else
    echo "Warning: Database file not created"
fi

# Step 8: Generate secure secret key
echo "8. Generating secure secret key..."
SECRET_KEY=$(python -c "import os; print(os.urandom(24).hex())")
echo ""
echo "IMPORTANT: Add this secret key to your .env file or PythonAnywhere environment:"
echo "SECRET_KEY=${SECRET_KEY}"
echo ""

# Step 9: Final instructions
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your actual values:"
echo "   nano ${PROJECT_DIR}/.env"
echo ""
echo "2. Update WSGI configuration file in PythonAnywhere web interface"
echo ""
echo "3. Configure static files mapping:"
echo "   /statics/css/ -> ${PROJECT_DIR}/css"
echo "   /statics/js/ -> ${PROJECT_DIR}/js"
echo "   /statics/data/ -> ${PROJECT_DIR}/data"
echo ""
echo "4. Reload your web app from PythonAnywhere interface"
echo ""
echo "5. Check logs if any issues:"
echo "   tail -f /var/log/www.hipd.ai.kr.error.log"
echo ""
echo "========================================="