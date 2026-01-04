# PythonAnywhere 배포 가이드 (www.hipd.ai.kr)

## 배포 단계별 안내

### 1. PythonAnywhere 웹 설정 수정

#### 1.1 Source Code 경로 수정
- **현재**: `/home/kimseunghun//home/kimseunghun/Alleralert` (잘못됨)
- **수정**: `/home/kimseunghun/Alleralert`

#### 1.2 Working Directory 설정
- `/home/kimseunghun/Alleralert` 로 설정

### 2. WSGI 파일 설정

PythonAnywhere 웹 인터페이스에서 `/var/www/www_hipd_ai_kr_wsgi.py` 파일을 열고 아래 내용으로 교체:

```python
"""
WSGI configuration for PythonAnywhere
Domain: www.hipd.ai.kr
"""

import sys
import os

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
from app import app as application

# Production settings
application.config.update(
    DEBUG=False,
    TESTING=False,
    SECRET_KEY=os.environ.get('SECRET_KEY', 'prod-secret-key-' + os.urandom(16).hex()),
    DATABASE=os.path.join(backend_path, 'alleralert.db'),
    UPLOAD_FOLDER=os.path.join(backend_path, 'uploads'),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB max
    GEMINI_API_KEY=os.environ.get('GEMINI_API_KEY', 'AIzaSyC0-TW57YUHAh_3-XjsKLXVmqmMD7hk9AU')
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
```

### 3. 가상환경 생성 및 패키지 설치

Bash 콘솔에서 실행:

```bash
# 가상환경 생성
mkvirtualenv --python=python3.10 Alleralert

# 프로젝트 디렉토리로 이동
cd /home/kimseunghun/Alleralert

# 패키지 설치
pip install -r requirements.txt
```

### 4. Static Files 매핑 수정

PythonAnywhere 웹 인터페이스의 Static files 섹션:

| URL | Directory |
|-----|-----------|
| /statics/css/ | /home/kimseunghun/Alleralert/css |
| /statics/js/ | /home/kimseunghun/Alleralert/js |
| /statics/data/ | /home/kimseunghun/Alleralert/data |
| / | /home/kimseunghun/Alleralert |

**주의**: `/templates/` 매핑은 삭제하세요 (Flask가 내부적으로 처리)

### 5. 환경변수 설정

Bash 콘솔에서:

```bash
# .env 파일 생성
cd /home/kimseunghun/Alleralert
cp .env.example .env

# .env 파일 편집
nano .env
```

다음 값들을 설정:
```
SECRET_KEY=your-very-secure-random-key-here
FLASK_ENV=production
GEMINI_API_KEY=your-actual-gemini-api-key
```

### 6. 데이터베이스 권한 설정

```bash
cd /home/kimseunghun/Alleralert/backend

# 데이터베이스 파일 권한 설정
chmod 664 alleralert.db

# uploads 디렉토리 권한 설정
mkdir -p uploads
chmod 775 uploads
```

### 7. index.html 파일 업데이트

프로덕션용 HTML 파일 사용:

```bash
# 백업 생성
cp index.html index_development.html

# 프로덕션 버전 사용
cp index_production.html index.html
```

또는 index.html의 경로를 수동으로 수정:
- `href="css/` → `href="/statics/css/`
- `src="js/` → `src="/statics/js/`

### 8. JavaScript 파일 API URL 확인

`js/config.js` 파일 확인:

```javascript
// Production configuration
const API_BASE_URL = 'https://www.hipd.ai.kr';
```

### 9. 웹 앱 재시작

PythonAnywhere 웹 인터페이스에서:
1. "Reload www.hipd.ai.kr" 버튼 클릭

### 10. 테스트 및 디버깅

#### 로그 파일 확인
- Error log: `/var/log/www.hipd.ai.kr.error.log`
- Server log: `/var/log/www.hipd.ai.kr.server.log`

#### 일반적인 문제 해결

**500 Internal Server Error**
- WSGI 파일 문법 오류 확인
- 가상환경 활성화 확인
- requirements.txt 패키지 설치 확인

**404 Not Found**
- Static files 매핑 확인
- index.html 경로 확인

**Database Error**
- SQLite 파일 권한 확인
- uploads 디렉토리 권한 확인

### 11. 보안 강화 (프로덕션 필수)

1. **SECRET_KEY 변경**
   - 강력한 랜덤 키 생성: `python -c "import os; print(os.urandom(24).hex())"`

2. **CORS 제한**
   - backend/app.py에서 CORS 설정 수정:
   ```python
   CORS(app, origins=['https://www.hipd.ai.kr'])
   ```

3. **디버그 모드 확인**
   - WSGI 파일에서 `DEBUG=False` 확인

4. **API 키 보호**
   - Gemini API 키를 환경변수로 이동
   - JavaScript 파일에서 API 키 제거

### 12. 최종 체크리스트

- [ ] WSGI 파일 업데이트 완료
- [ ] 가상환경 생성 및 패키지 설치 완료
- [ ] Static files 매핑 설정 완료
- [ ] 환경변수 설정 완료
- [ ] 데이터베이스 권한 설정 완료
- [ ] index.html 경로 수정 완료
- [ ] JavaScript API URL 수정 완료
- [ ] 웹 앱 재시작 완료
- [ ] 사이트 접속 테스트 완료
- [ ] 로그인/회원가입 기능 테스트 완료
- [ ] 이미지 업로드 기능 테스트 완료

## 지원

문제가 발생하면:
1. Error log 확인
2. PythonAnywhere 포럼 검색
3. 개발자에게 문의