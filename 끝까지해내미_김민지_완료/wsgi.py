"""
WSGI configuration for PythonAnywhere deployment
Place this file at: /var/www/www_hipd_ai_kr_wsgi.py
"""

import sys
import os
from pathlib import Path

# Add your project directory to the sys.path
project_home = '/home/kimseunghun/Alleralert'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Add backend directory to path
backend_path = os.path.join(project_home, 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Set environment variables
os.environ['FLASK_ENV'] = 'production'
os.environ['PROJECT_ROOT'] = project_home

# Import environment variables from .env file if it exists
env_file = os.path.join(project_home, '.env')
if os.path.exists(env_file):
    from dotenv import load_dotenv
    load_dotenv(env_file)

# Import Flask app
from backend.app import app as application

# Configure Flask app for production
application.config.update(
    DEBUG=False,
    TESTING=False,
    SECRET_KEY=os.environ.get('SECRET_KEY', 'change-this-in-production-' + os.urandom(24).hex()),
    DATABASE=os.path.join(project_home, 'backend', 'alleralert.db'),
    UPLOAD_FOLDER=os.path.join(project_home, 'backend', 'uploads'),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB max file size
)

# Ensure upload directory exists
upload_dir = application.config['UPLOAD_FOLDER']
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir, mode=0o755)

# Initialize database if needed
db_path = application.config['DATABASE']
if not os.path.exists(db_path):
    # Create database directory if it doesn't exist
    db_dir = os.path.dirname(db_path)
    if not os.path.exists(db_dir):
        os.makedirs(db_dir, mode=0o755)

    # Initialize database
    with application.app_context():
        from backend.app import init_db
        init_db()
        print(f"Database initialized at {db_path}")

# Logging configuration for production
import logging
from logging.handlers import RotatingFileHandler

if not application.debug:
    # Create logs directory
    log_dir = os.path.join(project_home, 'logs')
    if not os.path.exists(log_dir):
        os.makedirs(log_dir, mode=0o755)

    # Set up rotating file handler
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, 'alleralert.log'),
        maxBytes=10240000,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    application.logger.addHandler(file_handler)

    application.logger.setLevel(logging.INFO)
    application.logger.info('Alleralert startup')

print("=" * 50)
print("WSGI Configuration Loaded Successfully")
print(f"Project Home: {project_home}")
print(f"Database: {application.config['DATABASE']}")
print(f"Upload Folder: {application.config['UPLOAD_FOLDER']}")
print(f"Debug Mode: {application.config['DEBUG']}")
print("=" * 50)