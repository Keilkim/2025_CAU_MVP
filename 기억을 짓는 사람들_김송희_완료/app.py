"""
치매 환자 맞춤형 테라피 시스템 - Flask Backend
"""
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from functools import wraps
import sqlite3
import os
import json
import uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'mcplab-therapy-secret-key-2024'  # 고정 세션 키 (배포용)

# 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, 'therapy.db')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'ogg', 'm4a', 'aac'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 최대 50MB
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # 정적 파일 캐시 비활성화


# ============ 데이터베이스 ============

def get_db():
    """데이터베이스 연결"""
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    """데이터베이스 초기화"""
    with get_db() as db:
        db.executescript('''
            -- 사용자 테이블
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- 프리셋 테이블 (여러 개 저장 가능)
            CREATE TABLE IF NOT EXISTS presets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT NOT NULL,
                colors TEXT,
                music_mood TEXT,
                memory_type TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            -- 미디어 테이블
            CREATE TABLE IF NOT EXISTS media (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                type TEXT,
                filename TEXT,
                original_name TEXT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            -- 활동 기록 테이블
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                activity_type TEXT,
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        ''')
        db.commit()


# ============ 유틸리티 함수 ============

def login_required(f):
    """로그인 필수 데코레이터"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            if request.is_json:
                return jsonify({'error': '로그인이 필요합니다.'}), 401
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function


def allowed_file(filename, file_type):
    """허용된 파일 확장자 확인"""
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    if file_type == 'photo':
        return ext in ALLOWED_IMAGE_EXTENSIONS
    elif file_type == 'music':
        return ext in ALLOWED_AUDIO_EXTENSIONS
    return False


def get_user_upload_folder(user_id, media_type):
    """사용자별 업로드 폴더 경로"""
    folder = os.path.join(app.config['UPLOAD_FOLDER'], str(user_id), media_type)
    os.makedirs(folder, exist_ok=True)
    return folder


# ============ 페이지 라우트 ============

@app.route('/')
def index():
    """로그인/회원가입 페이지"""
    if 'user_id' in session:
        # 프리셋이 있으면 프리셋 목록으로, 없으면 설정 페이지로
        with get_db() as db:
            count = db.execute(
                'SELECT COUNT(*) as count FROM presets WHERE user_id = ?',
                (session['user_id'],)
            ).fetchone()['count']
            if count > 0:
                return redirect(url_for('presets'))
            return redirect(url_for('settings'))
    return render_template('index.html')


@app.route('/presets')
@login_required
def presets():
    """프리셋 목록 페이지"""
    return render_template('presets.html')


@app.route('/settings')
@login_required
def settings():
    """설정 페이지"""
    return render_template('settings.html')


@app.route('/display')
@login_required
def display():
    """테라피 디스플레이 페이지"""
    return render_template('display.html')


# ============ 인증 API ============

@app.route('/api/register', methods=['POST'])
def api_register():
    """회원가입"""
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'error': '아이디와 비밀번호를 입력해주세요.'}), 400

    if len(username) < 2:
        return jsonify({'error': '아이디는 2자 이상이어야 합니다.'}), 400

    if len(password) < 4:
        return jsonify({'error': '비밀번호는 4자 이상이어야 합니다.'}), 400

    try:
        with get_db() as db:
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO users (username, password_hash) VALUES (?, ?)',
                (username, generate_password_hash(password))
            )
            db.commit()
            user_id = cursor.lastrowid

            # 자동 로그인
            session['user_id'] = user_id
            session['username'] = username

            return jsonify({
                'success': True,
                'message': '회원가입이 완료되었습니다.',
                'user': {'id': user_id, 'username': username}
            })
    except sqlite3.IntegrityError:
        return jsonify({'error': '이미 사용 중인 아이디입니다.'}), 400


@app.route('/api/login', methods=['POST'])
def api_login():
    """로그인"""
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'error': '아이디와 비밀번호를 입력해주세요.'}), 400

    with get_db() as db:
        user = db.execute(
            'SELECT * FROM users WHERE username = ?', (username,)
        ).fetchone()

        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            return jsonify({
                'success': True,
                'message': '로그인되었습니다.',
                'user': {'id': user['id'], 'username': user['username']}
            })

    return jsonify({'error': '아이디 또는 비밀번호가 올바르지 않습니다.'}), 401


@app.route('/api/logout', methods=['POST'])
def api_logout():
    """로그아웃"""
    session.clear()
    return jsonify({'success': True, 'message': '로그아웃되었습니다.'})


@app.route('/api/me')
def api_me():
    """현재 로그인 사용자 정보"""
    if 'user_id' in session:
        return jsonify({
            'logged_in': True,
            'user': {
                'id': session['user_id'],
                'username': session['username']
            }
        })
    return jsonify({'logged_in': False})


# ============ 프리셋 API ============

@app.route('/api/presets', methods=['GET'])
@login_required
def api_get_presets():
    """사용자 프리셋 목록 조회"""
    user_id = session['user_id']
    with get_db() as db:
        presets_list = db.execute(
            'SELECT * FROM presets WHERE user_id = ? ORDER BY created_at DESC', (user_id,)
        ).fetchall()

        result = []
        for p in presets_list:
            result.append({
                'id': p['id'],
                'name': p['name'],
                'colors': json.loads(p['colors']) if p['colors'] else [],
                'music_mood': p['music_mood'],
                'memory_type': p['memory_type'],
                'created_at': p['created_at']
            })

        return jsonify({'presets': result, 'count': len(result)})


@app.route('/api/presets', methods=['POST'])
@login_required
def api_create_preset():
    """새 프리셋 생성"""
    user_id = session['user_id']
    data = request.get_json()

    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': '프리셋 이름을 입력해주세요.'}), 400

    colors = json.dumps(data.get('colors', []))
    music_mood = data.get('music_mood')
    memory_type = data.get('memory_type')

    with get_db() as db:
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO presets (user_id, name, colors, music_mood, memory_type)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, name, colors, music_mood, memory_type))
        db.commit()
        preset_id = cursor.lastrowid

    return jsonify({
        'success': True,
        'message': '프리셋이 저장되었습니다.',
        'preset': {
            'id': preset_id,
            'name': name,
            'colors': data.get('colors', []),
            'music_mood': music_mood,
            'memory_type': memory_type
        }
    })


@app.route('/api/presets/<int:preset_id>', methods=['GET'])
@login_required
def api_get_preset(preset_id):
    """특정 프리셋 조회"""
    user_id = session['user_id']
    with get_db() as db:
        preset = db.execute(
            'SELECT * FROM presets WHERE id = ? AND user_id = ?', (preset_id, user_id)
        ).fetchone()

        if not preset:
            return jsonify({'error': '프리셋을 찾을 수 없습니다.'}), 404

        return jsonify({
            'id': preset['id'],
            'name': preset['name'],
            'colors': json.loads(preset['colors']) if preset['colors'] else [],
            'music_mood': preset['music_mood'],
            'memory_type': preset['memory_type']
        })


@app.route('/api/presets/<int:preset_id>', methods=['DELETE'])
@login_required
def api_delete_preset(preset_id):
    """프리셋 삭제"""
    user_id = session['user_id']

    with get_db() as db:
        preset = db.execute(
            'SELECT * FROM presets WHERE id = ? AND user_id = ?',
            (preset_id, user_id)
        ).fetchone()

        if not preset:
            return jsonify({'error': '프리셋을 찾을 수 없습니다.'}), 404

        db.execute('DELETE FROM presets WHERE id = ?', (preset_id,))
        db.commit()

    return jsonify({'success': True, 'message': '프리셋이 삭제되었습니다.'})


# ============ 미디어 API ============

@app.route('/api/upload/<media_type>', methods=['POST'])
@login_required
def api_upload(media_type):
    """파일 업로드 (photo 또는 music)"""
    if media_type not in ['photo', 'music']:
        return jsonify({'error': '잘못된 미디어 타입입니다.'}), 400

    if 'file' not in request.files:
        return jsonify({'error': '파일이 없습니다.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': '파일이 선택되지 않았습니다.'}), 400

    if not allowed_file(file.filename, media_type):
        return jsonify({'error': '허용되지 않는 파일 형식입니다.'}), 400

    user_id = session['user_id']
    # 원본 파일명에서 확장자 추출 (secure_filename 전에)
    original_filename = file.filename
    if '.' in original_filename:
        ext = original_filename.rsplit('.', 1)[1].lower()
    else:
        return jsonify({'error': '파일 확장자가 없습니다.'}), 400

    original_name = secure_filename(file.filename) or f"file.{ext}"
    filename = f"{uuid.uuid4().hex}.{ext}"

    folder = get_user_upload_folder(user_id, 'photos' if media_type == 'photo' else 'music')
    try:
        file.save(os.path.join(folder, filename))
    except Exception as e:
        return jsonify({'error': f'파일 저장 실패: {str(e)}'}), 500

    with get_db() as db:
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO media (user_id, type, filename, original_name)
            VALUES (?, ?, ?, ?)
        ''', (user_id, media_type, filename, original_name))
        db.commit()
        media_id = cursor.lastrowid

    return jsonify({
        'success': True,
        'message': '업로드 완료',
        'media': {
            'id': media_id,
            'type': media_type,
            'filename': filename,
            'original_name': original_name,
            'url': f'/uploads/{user_id}/{"photos" if media_type == "photo" else "music"}/{filename}'
        }
    })


@app.route('/api/media', methods=['GET'])
@login_required
def api_get_media():
    """사용자 미디어 목록"""
    user_id = session['user_id']
    media_type = request.args.get('type')  # photo, music, 또는 None (전체)

    with get_db() as db:
        if media_type:
            media_list = db.execute(
                'SELECT * FROM media WHERE user_id = ? AND type = ? ORDER BY uploaded_at DESC',
                (user_id, media_type)
            ).fetchall()
        else:
            media_list = db.execute(
                'SELECT * FROM media WHERE user_id = ? ORDER BY uploaded_at DESC',
                (user_id,)
            ).fetchall()

        result = []
        for m in media_list:
            folder = 'photos' if m['type'] == 'photo' else 'music'
            result.append({
                'id': m['id'],
                'type': m['type'],
                'filename': m['filename'],
                'original_name': m['original_name'],
                'url': f'/uploads/{user_id}/{folder}/{m["filename"]}',
                'uploaded_at': m['uploaded_at']
            })

        return jsonify({'media': result})


@app.route('/api/media/<int:media_id>', methods=['DELETE'])
@login_required
def api_delete_media(media_id):
    """미디어 삭제"""
    user_id = session['user_id']

    with get_db() as db:
        media = db.execute(
            'SELECT * FROM media WHERE id = ? AND user_id = ?',
            (media_id, user_id)
        ).fetchone()

        if not media:
            return jsonify({'error': '미디어를 찾을 수 없습니다.'}), 404

        # 파일 삭제
        folder = 'photos' if media['type'] == 'photo' else 'music'
        file_path = os.path.join(
            get_user_upload_folder(user_id, folder),
            media['filename']
        )
        if os.path.exists(file_path):
            os.remove(file_path)

        # DB에서 삭제
        db.execute('DELETE FROM media WHERE id = ?', (media_id,))
        db.commit()

    return jsonify({'success': True, 'message': '삭제되었습니다.'})


@app.route('/uploads/<int:user_id>/<path:filename>')
def uploaded_file(user_id, filename):
    """업로드된 파일 제공"""
    folder = os.path.join(app.config['UPLOAD_FOLDER'], str(user_id))
    return send_from_directory(folder, filename)


# ============ 활동 기록 API ============

@app.route('/api/activity', methods=['POST'])
@login_required
def api_log_activity():
    """활동 기록"""
    user_id = session['user_id']
    data = request.get_json()

    activity_type = data.get('type')
    details = json.dumps(data.get('details', {}))

    with get_db() as db:
        db.execute('''
            INSERT INTO activity_logs (user_id, activity_type, details)
            VALUES (?, ?, ?)
        ''', (user_id, activity_type, details))
        db.commit()

    return jsonify({'success': True})


@app.route('/api/activity', methods=['GET'])
@login_required
def api_get_activity():
    """활동 기록 조회"""
    user_id = session['user_id']
    limit = request.args.get('limit', 50, type=int)

    with get_db() as db:
        logs = db.execute('''
            SELECT * FROM activity_logs
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        ''', (user_id, limit)).fetchall()

        result = []
        for log in logs:
            result.append({
                'id': log['id'],
                'type': log['activity_type'],
                'details': json.loads(log['details']) if log['details'] else {},
                'created_at': log['created_at']
            })

        return jsonify({'activities': result})


# ============ 앱 시작 ============

# 앱 시작 시 DB 초기화
init_db()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
