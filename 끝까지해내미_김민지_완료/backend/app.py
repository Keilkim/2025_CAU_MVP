"""
AllerAlert Backend API
Flask 기반 백엔드 서버 - 이미지 분석 및 데이터 관리
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import base64
import requests
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import logging

app = Flask(__name__)
CORS(app)

# 설정 - 환경변수에서 가져오기 (production)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-only-for-development')
app.config['DATABASE'] = os.environ.get('DATABASE_PATH', 'alleralert.db')
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Gemini API 설정 - 환경변수에서 가져오기
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyC0-TW57YUHAh_3-XjsKLXVmqmMD7hk9AU')
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent'

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 데이터베이스 초기화
def init_db():
    """데이터베이스 테이블 생성"""
    conn = sqlite3.connect(app.config['DATABASE'])
    cursor = conn.cursor()

    # 사용자 테이블
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 알레르기 정보 테이블
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_allergies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            allergy_name TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # 분석 기록 테이블
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_name TEXT,
            detected_allergens TEXT,
            status TEXT,
            confidence REAL,
            analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    conn.commit()
    conn.close()

# 알레르기 요인 데이터베이스
ALLERGY_FACTORS = [
    '계란', '우유', '메밀', '땅콩', '대두', '밀',
    '고등어', '게', '새우', '돼지고기', '복숭아', '토마토',
    '아황산류', '호두', '닭고기', '쇠고기', '오징어', '조개류', '잣'
]

# 제품 성분 데이터베이스 (샘플)
PRODUCT_DATABASE = {
    "초코파이": ["밀가루", "계란", "우유", "대두", "초콜릿"],
    "새우깡": ["새우", "밀", "대두", "팜유"],
    "땅콩강정": ["땅콩", "밀가루", "계란", "설탕"],
    "치즈볼": ["우유", "밀", "대두", "치즈"],
    "우유": ["우유"],
    "두유": ["대두"],
    "아몬드브리즈": ["아몬드"],
}

@app.route('/')
def index():
    """API 상태 확인"""
    return jsonify({
        'status': 'active',
        'service': 'AllerAlert API',
        'version': '1.0.0'
    })

@app.route('/api/register', methods=['POST'])
def register():
    """사용자 회원가입"""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': '아이디와 비밀번호를 입력해주세요'}), 400

    conn = sqlite3.connect(app.config['DATABASE'])
    cursor = conn.cursor()

    # 중복 확인
    cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': '이미 존재하는 아이디입니다'}), 400

    # 사용자 생성
    password_hash = generate_password_hash(password)
    cursor.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)',
                   (username, password_hash))
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()

    return jsonify({
        'message': '회원가입 성공',
        'user_id': user_id
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    """사용자 로그인"""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = sqlite3.connect(app.config['DATABASE'])
    cursor = conn.cursor()

    cursor.execute('SELECT id, password_hash FROM users WHERE username = ?',
                   (username,))
    user = cursor.fetchone()
    conn.close()

    if not user or not check_password_hash(user[1], password):
        return jsonify({'error': '아이디 또는 비밀번호가 일치하지 않습니다'}), 401

    return jsonify({
        'message': '로그인 성공',
        'user_id': user[0],
        'username': username
    }), 200

@app.route('/api/allergies/<int:user_id>', methods=['GET', 'POST', 'PUT'])
def manage_allergies(user_id):
    """사용자 알레르기 정보 관리"""
    conn = sqlite3.connect(app.config['DATABASE'])
    cursor = conn.cursor()

    if request.method == 'GET':
        # 알레르기 정보 조회
        cursor.execute('SELECT allergy_name FROM user_allergies WHERE user_id = ?',
                       (user_id,))
        allergies = [row[0] for row in cursor.fetchall()]
        conn.close()

        return jsonify({'allergies': allergies}), 200

    elif request.method in ['POST', 'PUT']:
        # 알레르기 정보 저장/업데이트
        data = request.json
        allergies = data.get('allergies', [])

        # 기존 데이터 삭제
        cursor.execute('DELETE FROM user_allergies WHERE user_id = ?', (user_id,))

        # 새 데이터 삽입
        for allergy in allergies:
            cursor.execute('INSERT INTO user_allergies (user_id, allergy_name) VALUES (?, ?)',
                           (user_id, allergy))

        conn.commit()
        conn.close()

        return jsonify({'message': '알레르기 정보가 저장되었습니다'}), 200

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    """이미지 분석 API"""
    data = request.json
    user_id = data.get('user_id')
    image_base64 = data.get('image')

    if not image_base64:
        return jsonify({'error': '이미지가 없습니다'}), 400

    try:
        # Gemini API 호출 (실제 구현)
        # analysis_result = call_gemini_api(image_base64)

        # 임시 시뮬레이션
        analysis_result = simulate_analysis()

        # 사용자 알레르기 정보 조회
        conn = sqlite3.connect(app.config['DATABASE'])
        cursor = conn.cursor()
        cursor.execute('SELECT allergy_name FROM user_allergies WHERE user_id = ?',
                       (user_id,))
        user_allergies = [row[0] for row in cursor.fetchall()]

        # 알레르기 체크
        detected_allergens = check_allergens(
            analysis_result['ingredients'],
            user_allergies
        )

        # 위험도 판단
        status = determine_status(detected_allergens)

        # 분석 기록 저장
        cursor.execute('''
            INSERT INTO analysis_history
            (user_id, product_name, detected_allergens, status, confidence)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            user_id,
            analysis_result.get('product_name', 'Unknown'),
            json.dumps(detected_allergens),
            status,
            analysis_result.get('confidence', 0.0)
        ))
        conn.commit()
        conn.close()

        return jsonify({
            'status': status,
            'product_name': analysis_result.get('product_name'),
            'ingredients': analysis_result.get('ingredients', []),
            'detected_allergens': detected_allergens,
            'confidence': analysis_result.get('confidence', 0.0),
            'message': get_status_message(status, detected_allergens)
        }), 200

    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({'error': '분석 중 오류가 발생했습니다'}), 500

def simulate_analysis():
    """분석 시뮬레이션 (개발용)"""
    import random
    products = list(PRODUCT_DATABASE.keys())
    selected_product = random.choice(products)

    return {
        'product_name': selected_product,
        'ingredients': PRODUCT_DATABASE[selected_product],
        'confidence': 0.85 + random.random() * 0.15
    }

def check_allergens(ingredients, user_allergies):
    """성분과 사용자 알레르기 비교"""
    detected = []

    for ingredient in ingredients:
        for allergy in user_allergies:
            if allergy in ingredient or ingredient in allergy:
                if allergy not in detected:
                    detected.append(allergy)

    return detected

def determine_status(detected_allergens):
    """위험도 판단"""
    if len(detected_allergens) == 0:
        return 'safe'
    elif len(detected_allergens) <= 2:
        return 'warning'
    else:
        return 'danger'

def get_status_message(status, allergens):
    """상태별 메시지 생성"""
    if status == 'safe':
        return '알레르기 유발 성분이 검출되지 않았습니다.'
    elif status == 'warning':
        return f"주의: {', '.join(allergens)} 성분이 포함되어 있습니다."
    else:
        return f"위험: 다수의 알레르기 유발 성분({', '.join(allergens)})이 검출되었습니다."

@app.route('/api/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    """분석 기록 조회"""
    conn = sqlite3.connect(app.config['DATABASE'])
    cursor = conn.cursor()

    cursor.execute('''
        SELECT product_name, detected_allergens, status, confidence, analyzed_at
        FROM analysis_history
        WHERE user_id = ?
        ORDER BY analyzed_at DESC
        LIMIT 20
    ''', (user_id,))

    history = []
    for row in cursor.fetchall():
        history.append({
            'product_name': row[0],
            'detected_allergens': json.loads(row[1]),
            'status': row[2],
            'confidence': row[3],
            'analyzed_at': row[4]
        })

    conn.close()

    return jsonify({'history': history}), 200

@app.route('/api/allergy-factors', methods=['GET'])
def get_allergy_factors():
    """알레르기 요인 목록 조회"""
    return jsonify({'factors': ALLERGY_FACTORS}), 200

if __name__ == '__main__':
    # 업로드 폴더 생성
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # 데이터베이스 초기화
    init_db()

    # 서버 실행 - Production에서는 WSGI 서버가 실행
    # PythonAnywhere에서는 이 부분이 실행되지 않음
    app.run(debug=False, host='0.0.0.0', port=5000)