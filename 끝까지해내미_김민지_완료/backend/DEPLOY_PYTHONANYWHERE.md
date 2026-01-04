# PythonAnywhere 배포 가이드

## 1. PythonAnywhere 계정 설정
1. [PythonAnywhere](https://www.pythonanywhere.com) 가입
2. 무료 또는 유료 계정 선택

## 2. 파일 업로드
### 방법 1: Git 사용 (권장)
```bash
# PythonAnywhere Bash 콘솔에서
cd ~
git clone https://github.com/yourusername/alleralert.git
```

### 방법 2: 수동 업로드
- Files 탭에서 직접 업로드
- `/home/yourusername/alleralert/` 디렉토리 구조 생성

## 3. 가상환경 설정
```bash
# Bash 콘솔에서
cd ~/alleralert
python3.10 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

## 4. WSGI 파일 수정
`wsgi.py` 파일에서 다음 항목 수정:
```python
# 실제 사용자명으로 변경
project_home = '/home/yourusername/alleralert'
```

## 5. Web App 설정
1. Web 탭으로 이동
2. "Add a new web app" 클릭
3. Python 3.10 선택
4. Manual configuration 선택

### Source code 설정
- Source code: `/home/yourusername/alleralert`
- Working directory: `/home/yourusername/alleralert/backend`

### WSGI configuration file
WSGI 설정 파일 경로를 클릭하여 편집:
```python
import sys
import os

# 프로젝트 경로 추가
project_home = '/home/yourusername/alleralert'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

backend_path = os.path.join(project_home, 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Flask app import
from app import app as application
from app import init_db

# 데이터베이스 초기화
init_db()

# Production 설정
application.config['DEBUG'] = False
application.config['DATABASE'] = os.path.join(backend_path, 'alleralert.db')

# SECRET_KEY 변경 (중요!)
application.config['SECRET_KEY'] = 'your-production-secret-key-here'

# Upload 폴더 생성
upload_folder = os.path.join(backend_path, 'uploads')
os.makedirs(upload_folder, exist_ok=True)
application.config['UPLOAD_FOLDER'] = upload_folder
```

### Virtualenv 설정
- Virtualenv: `/home/yourusername/alleralert/venv`

## 6. 정적 파일 설정 (필요시)
Static files 섹션에서:
- URL: `/static/`
- Directory: `/home/yourusername/alleralert/backend/static/`

## 7. 환경 변수 설정 (권장)
Web 탭의 Environment variables 섹션:
```
SECRET_KEY = your-production-secret-key
GEMINI_API_KEY = your-gemini-api-key
ENVIRONMENT = production
```

## 8. 데이터베이스 권한 설정
```bash
# Bash 콘솔에서
cd ~/alleralert/backend
chmod 664 alleralert.db
chmod 775 .
chmod 775 uploads
```

## 9. 앱 재시작
- Web 탭에서 "Reload" 버튼 클릭

## 10. 테스트
브라우저에서 확인:
```
https://yourusername.pythonanywhere.com/
```

## 문제 해결

### 500 에러 발생 시
1. Error log 확인 (Web 탭)
2. 권한 문제 확인
3. 패키지 설치 확인

### 데이터베이스 에러
```bash
# 권한 재설정
chmod 775 ~/alleralert/backend
chmod 664 ~/alleralert/backend/alleralert.db
```

### Import 에러
WSGI 파일의 경로 설정 확인

## 보안 권장사항

1. **SECRET_KEY 변경**: 프로덕션에서 반드시 새로운 키 사용
2. **DEBUG = False**: 프로덕션에서 디버그 모드 비활성화
3. **HTTPS 사용**: PythonAnywhere는 기본적으로 HTTPS 제공
4. **API 키 보호**: 환경 변수로 관리
5. **CORS 설정**: 필요한 도메인만 허용하도록 수정

## 프론트엔드 연결
프론트엔드 코드에서 API URL 변경:
```javascript
// 기존
const API_URL = 'http://localhost:5000';

// 변경
const API_URL = 'https://yourusername.pythonanywhere.com';
```