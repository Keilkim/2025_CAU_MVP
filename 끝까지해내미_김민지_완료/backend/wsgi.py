"""
WSGI configuration for PythonAnywhere deployment
Domain: www.hipd.ai.kr
Copy this content to the WSGI configuration file in PythonAnywhere Web interface
"""

import sys
import os
from pathlib import Path

# PythonAnywhere configuration
USERNAME = 'kimseunghun'
project_home = f'/home/{USERNAME}/Alleralert'  # Fixed: capital A in Alleralert

# Add project and backend to path
if project_home not in sys.path:
    sys.path.insert(0, project_home)

backend_path = os.path.join(project_home, 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Import Flask application
from app import app as application

# Production settings
application.config.update(
    DEBUG=False,
    TESTING=False,
    SECRET_KEY=os.environ.get('SECRET_KEY', 'prod-secret-key-' + os.urandom(16).hex()),
    DATABASE=os.path.join(backend_path, 'alleralert.db'),
    UPLOAD_FOLDER=os.path.join(backend_path, 'uploads'),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB max
    GEMINI_API_KEY=os.environ.get('GEMINI_API_KEY', 'AIzaSyC0-TW57YUHAh_3-XjsKLXVmqmMD7hk9AU'),
    # CORS settings for www.hipd.ai.kr
    CORS_ORIGINS=['https://www.hipd.ai.kr', 'http://www.hipd.ai.kr']
)

# Ensure directories exist
os.makedirs(application.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
try:
    with application.app_context():
        from app import init_db
        init_db()
except Exception as e:
    print(f"Database initialization error: {e}")

# Logging for production
if not application.config['DEBUG']:
    import logging
    logging.basicConfig(level=logging.INFO)