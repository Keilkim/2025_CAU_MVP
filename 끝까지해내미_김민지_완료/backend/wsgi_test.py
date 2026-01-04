"""
Test WSGI configuration for debugging
"""

import sys
import os

# 경로 설정
USERNAME = 'kimseunghun'
project_home = f'/home/{USERNAME}/Alleralert'
backend_path = os.path.join(project_home, 'backend')

sys.path.insert(0, project_home)
sys.path.insert(0, backend_path)

# 간단한 테스트 앱
from flask import Flask, jsonify

application = Flask(__name__)

@application.route('/')
def test():
    return jsonify({
        'status': 'active',
        'message': 'Test WSGI is working',
        'project_home': project_home,
        'backend_path': backend_path,
        'python_paths': sys.path[:5]  # 처음 5개 경로만 표시
    })

@application.route('/api/test')
def api_test():
    return jsonify({'message': 'API endpoint working'})

# 실제 app.py 로드 시도
try:
    from app import app
    application.register_blueprint(app, url_prefix='/real')
    load_status = 'App loaded successfully'
except Exception as e:
    load_status = f'Error loading app: {str(e)}'

@application.route('/status')
def status():
    return jsonify({
        'app_load_status': load_status,
        'files_in_backend': os.listdir(backend_path) if os.path.exists(backend_path) else 'Backend path not found'
    })