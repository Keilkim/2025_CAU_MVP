"""
WSGI configuration with Frontend support for PythonAnywhere
Domain: www.hipd.ai.kr
"""

import sys
import os
from pathlib import Path

# PythonAnywhere configuration
USERNAME = 'kimseunghun'
project_home = f'/home/{USERNAME}/Alleralert'

# Add project and backend to path
if project_home not in sys.path:
    sys.path.insert(0, project_home)

backend_path = os.path.join(project_home, 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Import Flask application
from flask import Flask, send_from_directory, send_file
from app import app as backend_app
from app import init_db

# Create main application
application = Flask(__name__, static_folder=project_home, static_url_path='')

# Register backend routes under /api prefix
application.register_blueprint(backend_app, url_prefix='/api')

# Serve frontend files
@application.route('/')
def index():
    """Serve the main index.html"""
    return send_file(os.path.join(project_home, 'index.html'))

@application.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    file_path = os.path.join(project_home, path)
    if os.path.isfile(file_path):
        return send_from_directory(project_home, path)
    # If file doesn't exist, return index.html (for SPA routing)
    return send_file(os.path.join(project_home, 'index.html'))

# Production settings
application.config.update(
    DEBUG=False,
    TESTING=False,
    SECRET_KEY=os.environ.get('SECRET_KEY', 'prod-secret-key-change-this'),
    DATABASE=os.path.join(backend_path, 'alleralert.db'),
    UPLOAD_FOLDER=os.path.join(backend_path, 'uploads'),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024
)

# Ensure directories exist
os.makedirs(application.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
try:
    with application.app_context():
        init_db()
except Exception as e:
    print(f"Database initialization error: {e}")

# Logging
if not application.config['DEBUG']:
    import logging
    logging.basicConfig(level=logging.INFO)