# PythonAnywhere 최종 설정 가이드

## 현재 설정 정보
- **사용자명**: kimseunghun
- **프로젝트 경로**: `/home/kimseunghun/Alleralert` (대문자 A 주의!)
- **가상환경 경로**: `/home/kimseunghun/.virtualenvs/Alleralert`
- **Backend 경로**: `/home/kimseunghun/Alleralert/backend`

## 1. PythonAnywhere Web 탭 설정

### Source code
```
/home/kimseunghun/Alleralert
```

### Working directory
```
/home/kimseunghun/Alleralert/backend
```

### WSGI configuration file
클릭하여 편집하고, `wsgi.py` 파일의 내용을 복사하여 붙여넣기

### Virtualenv
```
/home/kimseunghun/.virtualenvs/Alleralert
```

## 2. Bash 콘솔에서 패키지 설치

```bash
# 가상환경이 이미 있는 경우
workon Alleralert

# 가상환경이 없는 경우 생성
mkvirtualenv Alleralert --python=/usr/bin/python3.10

# backend 디렉토리로 이동
cd ~/Alleralert/backend

# 패키지 설치
pip install flask
pip install flask-cors
pip install requests

# 또는 requirements.txt가 있는 경우
pip install -r requirements.txt
```

## 3. 디렉토리 및 파일 권한 설정

```bash
cd ~/Alleralert/backend

# uploads 폴더 생성 및 권한 설정
mkdir -p uploads
chmod 755 uploads

# 데이터베이스 파일 권한 (파일이 있는 경우)
touch alleralert.db
chmod 664 alleralert.db

# backend 폴더 권한
chmod 755 .
```

## 4. 환경 변수 설정 (Web 탭)

Environment variables 섹션에서:
```
SECRET_KEY = your-production-secret-key-here
GEMINI_API_KEY = AIzaSyC0-TW57YUHAh_3-XjsKLXVmqmMD7hk9AU
DATABASE_PATH = /home/kimseunghun/Alleralert/backend/alleralert.db
UPLOAD_FOLDER = /home/kimseunghun/Alleralert/backend/uploads
```

## 5. 테스트

### Bash 콘솔에서 import 테스트
```bash
workon Alleralert
cd ~/Alleralert/backend
python -c "from app import app; print('Import successful!')"
```

### 앱 재시작
Web 탭에서 "Reload" 버튼 클릭

### 브라우저에서 확인
```
https://kimseunghun.pythonanywhere.com/
```

## 6. 문제 해결

### Error log 확인
Web 탭 → Error log 링크 클릭

### 일반적인 오류와 해결책

#### "No module named 'flask'"
```bash
workon Alleralert
pip install flask flask-cors requests
```

#### "No module named 'app'"
WSGI 파일에서 경로 확인:
- 프로젝트 경로가 `/home/kimseunghun/Alleralert`인지 확인 (대문자 A)
- backend 경로가 올바른지 확인

#### Database 오류
```bash
cd ~/Alleralert/backend
touch alleralert.db
chmod 664 alleralert.db
chmod 755 .
```

## 7. 프론트엔드 연결

프론트엔드 코드에서 API URL 변경:
```javascript
// 기존
const API_URL = 'http://localhost:5000';

// 변경 (HTTPS 사용!)
const API_URL = 'https://kimseunghun.pythonanywhere.com';
```

## 8. 보안 체크리스트

- [ ] SECRET_KEY 변경 (production용 새 키 생성)
- [ ] DEBUG = False 확인
- [ ] GEMINI_API_KEY 환경변수로 관리
- [ ] HTTPS 사용 확인
- [ ] CORS 설정 확인 (필요한 도메인만 허용)

## 9. 최종 확인사항

1. **파일 구조**:
   ```
   /home/kimseunghun/Alleralert/
   ├── backend/
   │   ├── app.py
   │   ├── wsgi.py
   │   ├── requirements.txt
   │   ├── alleralert.db
   │   └── uploads/
   └── frontend/
       └── (프론트엔드 파일들)
   ```

2. **가상환경 활성화 확인**:
   ```bash
   which python
   # 출력: /home/kimseunghun/.virtualenvs/Alleralert/bin/python
   ```

3. **API 엔드포인트 테스트**:
   ```bash
   curl https://kimseunghun.pythonanywhere.com/
   # 예상 출력: {"status": "active", "service": "AllerAlert API", "version": "1.0.0"}
   ```

문제가 계속되면 Error log의 전체 내용을 확인하세요!