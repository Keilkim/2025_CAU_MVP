"""
WSGI configuration for AllerAlert on PythonAnywhere
Domain: www.hipd.ai.kr
"""

import sys
import os

# PythonAnywhere 설정
USERNAME = 'kimseunghun'

# 프로젝트 경로 추가
project_home = f'/home/{USERNAME}/Alleralert'
backend_path = os.path.join(project_home, 'backend')

# Python 경로 설정
if project_home not in sys.path:
    sys.path.insert(0, project_home)
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Flask 앱 import
try:
    from app import app as application
    from app import init_db

    # 프로덕션 설정
    application.config.update(
        DEBUG=False,
        TESTING=False,
        SECRET_KEY=os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production'),
        DATABASE=os.path.join(backend_path, 'alleralert.db'),
        UPLOAD_FOLDER=os.path.join(backend_path, 'uploads'),
        MAX_CONTENT_LENGTH=16 * 1024 * 1024  # 16MB
    )

    # uploads 폴더 생성
    os.makedirs(application.config['UPLOAD_FOLDER'], exist_ok=True)

    # 데이터베이스 초기화
    with application.app_context():
        init_db()

    print("AllerAlert app loaded successfully")

except Exception as e:
    print(f"Error loading AllerAlert app: {e}")
    # 에러 시 디버그용 간단한 앱 생성
    from flask import Flask
    application = Flask(__name__)

    @application.route('/')
    def error():
        return f"""
        <h1>AllerAlert Loading Error</h1>
        <p>Error: {str(e)}</p>
        <p>Check the error logs for more details.</p>
        <ul>
            <li>Project path: {project_home}</li>
            <li>Backend path: {backend_path}</li>
            <li>Python paths: {sys.path}</li>
        </ul>
        """