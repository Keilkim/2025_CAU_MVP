# PythonAnywhere 배포 가이드 - www.hipd.ai.kr

## 현재 설정 정보
- **도메인**: www.hipd.ai.kr
- **사용자명**: kimseunghun
- **프로젝트 경로**: `/home/kimseunghun/Alleralert` (대문자 A)
- **가상환경**: `/home/kimseunghun/.virtualenvs/alleralert` (소문자 a)

## 1. Bash 콘솔에서 패키지 설치

```bash
# 가상환경 활성화
workon alleralert

# backend 디렉토리로 이동
cd ~/Alleralert/backend

# 필수 패키지 설치
pip install flask flask-cors requests

# requirements.txt가 있는 경우
pip install -r requirements.txt
```

## 2. PythonAnywhere Web 탭 설정

### Source code
```
/home/kimseunghun/Alleralert
```

### Working directory
```
/home/kimseunghun/Alleralert/backend
```

### WSGI configuration file
WSGI configuration file 링크를 클릭하여 편집하고, `wsgi.py` 파일의 내용을 복사하여 붙여넣기

### Virtualenv
```
/home/kimseunghun/.virtualenvs/alleralert
```

## 3. Static Files 설정 (프론트엔드)

Static files 섹션에서 추가:

| URL | Directory |
|-----|-----------|
| `/` | `/home/kimseunghun/Alleralert/` |
| `/js/` | `/home/kimseunghun/Alleralert/js/` |
| `/css/` | `/home/kimseunghun/Alleralert/css/` |
| `/images/` | `/home/kimseunghun/Alleralert/images/` |

## 4. 환경 변수 설정

Web 탭의 Environment variables 섹션에서:

```
SECRET_KEY = your-production-secret-key-here-change-this
GEMINI_API_KEY = AIzaSyC0-TW57YUHAh_3-XjsKLXVmqmMD7hk9AU
DATABASE_PATH = /home/kimseunghun/Alleralert/backend/alleralert.db
UPLOAD_FOLDER = /home/kimseunghun/Alleralert/backend/uploads
ENVIRONMENT = production
```

## 5. 파일 권한 설정

```bash
cd ~/Alleralert/backend

# uploads 폴더 생성
mkdir -p uploads
chmod 755 uploads

# 데이터베이스 파일 생성 및 권한 설정
touch alleralert.db
chmod 664 alleralert.db

# backend 폴더 권한
chmod 755 .
```

## 6. 프론트엔드 API URL 수정

프론트엔드 JavaScript 파일들에서 API URL 변경:

### js/main.js, js/auth.js, js/allergy.js, js/analysis.js
```javascript
// 기존
const API_URL = 'http://localhost:5000';

// 변경 (HTTPS 사용!)
const API_URL = 'https://www.hipd.ai.kr';
```

## 7. 테스트

### Import 테스트 (Bash 콘솔)
```bash
workon alleralert
cd ~/Alleralert/backend
python -c "from app import app; print('Import successful!')"
```

### API 테스트
```bash
curl https://www.hipd.ai.kr/
# 예상 출력: {"status": "active", "service": "AllerAlert API", "version": "1.0.0"}
```

### 웹사이트 접속
브라우저에서 https://www.hipd.ai.kr 접속

## 8. 문제 해결

### Error log 확인
Web 탭 → Error log 링크 클릭

### 일반적인 오류

#### "No module named 'flask'"
```bash
workon alleralert
pip install flask flask-cors requests
```

#### "No module named 'app'"
- WSGI 파일의 경로 확인
- 프로젝트 경로: `/home/kimseunghun/Alleralert` (대문자 A)

#### 404 Error (프론트엔드)
- Static files 설정 확인
- index.html 파일 위치: `/home/kimseunghun/Alleralert/index.html`

#### CORS Error
- WSGI 파일에 CORS 설정 확인
- 프론트엔드 API URL이 HTTPS인지 확인

## 9. 최종 체크리스트

- [ ] 가상환경 생성 및 패키지 설치 완료
- [ ] WSGI configuration 파일 복사 완료
- [ ] Static files 설정 완료
- [ ] 환경 변수 설정 완료
- [ ] 파일 권한 설정 완료
- [ ] 프론트엔드 API URL 변경 완료
- [ ] Reload 버튼 클릭
- [ ] API 엔드포인트 테스트 완료
- [ ] 웹사이트 정상 접속 확인

## 10. 보안 권장사항

⚠️ **중요**: 프로덕션 배포 전 반드시 변경하세요!

1. **SECRET_KEY**: 랜덤한 새 키로 변경
2. **GEMINI_API_KEY**: 환경변수로 관리
3. **DEBUG = False**: 확인
4. **HTTPS 사용**: 모든 통신을 HTTPS로
5. **데이터베이스 백업**: 정기적인 백업 설정