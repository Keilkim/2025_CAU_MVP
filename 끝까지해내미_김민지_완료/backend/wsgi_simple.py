"""
Simplified WSGI configuration for PythonAnywhere
"""

import sys
import os

# ===== 필수 수정 사항 =====
# PythonAnywhere 사용자명을 입력하세요
USERNAME = 'kimseunghun'  # ← 여기에 실제 사용자명 입력!

# 프로젝트가 있는 경로
path = f'/home/{USERNAME}/alleralert/backend'
if path not in sys.path:
    sys.path.append(path)

# Flask 앱 import
from app import app as application

# 데이터베이스 초기화
from app import init_db
init_db()

# Production 설정
application.config['DEBUG'] = False

# 데이터베이스 경로 설정
application.config['DATABASE'] = os.path.join(path, 'alleralert.db')

# Upload 폴더 설정
upload_folder = os.path.join(path, 'uploads')
os.makedirs(upload_folder, exist_ok=True)
application.config['UPLOAD_FOLDER'] = upload_folder

# ===== 보안 설정 (중요!) =====
# SECRET_KEY를 변경하세요
application.config['SECRET_KEY'] = 'change-this-to-random-secret-key-in-production'

# Gemini API Key (환경변수 사용 권장)
# import os
# GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'your-api-key')