# PythonAnywhere 설정 가이드 - AllerAlert

## 현재 상황
로그를 보니 다른 앱이 실행 중입니다. AllerAlert를 설정하는 방법입니다.

## 1. Bash 콘솔에서 가상환경 및 패키지 설치

```bash
# 가상환경 생성 (이미 있다면 스킵)
mkvirtualenv alleralert --python=/usr/bin/python3.10

# 가상환경 활성화
workon alleralert

# 프로젝트 디렉토리로 이동
cd ~/Alleralert/backend

# 필수 패키지 설치
pip install flask flask-cors requests

# 데이터베이스 및 폴더 권한 설정
touch alleralert.db
chmod 664 alleralert.db
mkdir -p uploads
chmod 755 uploads
chmod 755 .
```

## 2. Web 탭 설정

### 기본 설정
- **Source code**: `/home/kimseunghun/Alleralert`
- **Working directory**: `/home/kimseunghun/Alleralert/backend`
- **Python version**: 3.10
- **Virtualenv**: `/home/kimseunghun/.virtualenvs/alleralert`

### WSGI Configuration File
`/var/www/www_hipd_ai_kr_wsgi.py` 파일을 클릭하여 편집하고, `wsgi_alleralert.py`의 내용을 붙여넣기

### Static Files 설정 (모두 삭제 후 다시 추가)

| URL | Directory |
|-----|-----------|
| `/` | `/home/kimseunghun/Alleralert` |
| `/static/` | `/home/kimseunghun/Alleralert` |
| `/css/` | `/home/kimseunghun/Alleralert/css` |
| `/js/` | `/home/kimseunghun/Alleralert/js` |
| `/images/` | `/home/kimseunghun/Alleralert/images` |

### Environment Variables
Web 탭의 Environment variables 섹션에서:
```
SECRET_KEY=your-production-secret-key-here
GEMINI_API_KEY=AIzaSyC0-TW57YUHAh_3-XjsKLXVmqmMD7hk9AU
DATABASE_PATH=/home/kimseunghun/Alleralert/backend/alleralert.db
UPLOAD_FOLDER=/home/kimseunghun/Alleralert/backend/uploads
```

## 3. 프론트엔드 파일 확인

프론트엔드 파일들이 올바른 위치에 있는지 확인:
```
/home/kimseunghun/Alleralert/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── auth.js
│   ├── allergy.js
│   └── analysis.js
└── backend/
    ├── app.py
    ├── alleralert.db
    └── uploads/
```

## 4. 프론트엔드 API URL 수정

모든 JavaScript 파일에서 API URL 변경:

```javascript
// 변경 전
const API_URL = 'http://localhost:5000';

// 변경 후
const API_URL = 'https://www.hipd.ai.kr';
```

## 5. 테스트

### API 테스트
```bash
curl https://www.hipd.ai.kr/
# 예상 결과: {"status": "active", "service": "AllerAlert API", "version": "1.0.0"}
```

### 웹사이트 접속
브라우저에서 https://www.hipd.ai.kr 접속

## 6. 문제 해결

### Error Log 확인
Web 탭에서 Error log 링크를 클릭하여 오류 확인

### 일반적인 오류

#### "No module named 'flask'"
```bash
workon alleralert
pip install flask flask-cors requests
```

#### "No module named 'app'"
WSGI 파일의 경로가 올바른지 확인

#### 404 Error
Static files 설정 확인

## 7. 기존 앱과의 충돌 해결

현재 로그인 관련 앱이 실행 중인 것으로 보입니다. AllerAlert로 완전히 교체하려면:

1. WSGI 파일을 완전히 새로 작성
2. Static files 설정을 모두 삭제 후 재설정
3. Reload 버튼 클릭

## 8. 최종 체크리스트

- [ ] 가상환경 생성 완료
- [ ] 패키지 설치 완료
- [ ] WSGI 파일 수정 완료
- [ ] Static files 설정 완료
- [ ] 환경 변수 설정 완료
- [ ] 프론트엔드 API URL 수정 완료
- [ ] Reload 완료
- [ ] API 테스트 성공
- [ ] 웹사이트 정상 작동 확인