# AllerAlert - 알레르기 정보 관리 시스템

알레르기 정보를 관리하고 제품 사진을 통해 알레르기 유발 성분을 분석하는 웹 애플리케이션입니다.

## 📱 주요 기능

1. **사용자 인증**
   - 회원가입 및 로그인
   - 개인별 알레르기 정보 관리

2. **알레르기 정보 관리**
   - 19가지 주요 알레르기 요인 선택
   - 커스텀 알레르기 추가
   - 알레르기 정보 저장 및 수정

3. **제품 사진 분석**
   - 카메라 또는 갤러리에서 사진 선택
   - AI 기반 성분 분석
   - 알레르기 위험도 판단 (안전/주의/위험)

4. **반응형 디자인**
   - 모바일 최적화
   - 태블릿 및 데스크톱 지원

## 🚀 시작하기

### 프론트엔드 실행

1. 프로젝트 폴더를 열고 `index.html`을 브라우저에서 실행합니다.

```bash
# Live Server 사용시 (VS Code)
# index.html 우클릭 > Open with Live Server
```

### 백엔드 실행 (선택사항)

1. Python 가상환경 생성 및 활성화:

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

2. 패키지 설치:

```bash
pip install -r requirements.txt
```

3. 서버 실행:

```bash
python app.py
```

서버는 http://localhost:5000 에서 실행됩니다.

## 📁 프로젝트 구조

```
AllerAlert/
│
├── index.html              # 메인 HTML 파일
├── css/
│   ├── styles.css         # 기본 스타일
│   └── responsive.css     # 반응형 스타일
├── js/
│   ├── main.js            # 메인 네비게이션
│   ├── auth.js            # 인증 기능
│   ├── allergy.js         # 알레르기 관리
│   └── analysis.js        # 이미지 분석
├── backend/
│   ├── app.py             # Flask 서버
│   └── requirements.txt   # Python 패키지
└── README.md

```

## 🎨 화면 구성

1. **로그인 페이지**: 사용자 인증
2. **메인 페이지**: 사진 촬영/선택 및 알레르기 설정
3. **알레르기 설정 페이지**: 개인 알레르기 정보 관리
4. **사진 분석 페이지**: 선택한 사진 미리보기 및 분석
5. **결과 페이지**: 분석 결과 및 위험도 표시

## 🔧 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python, Flask
- **Database**: SQLite (LocalStorage for frontend)
- **API**: Gemini API (이미지 분석용)

## 📌 주요 알레르기 요인

- 계란, 우유, 메밀, 땅콩, 대두, 밀
- 고등어, 게, 새우, 돼지고기
- 복숭아, 토마토, 아황산류
- 호두, 닭고기, 쇠고기
- 오징어, 조개류, 잣

## ⚠️ 주의사항

- 현재 이미지 분석은 시뮬레이션 모드로 동작합니다.
- 실제 서비스 운영시 Gemini API 키를 환경변수로 관리해야 합니다.
- 의료 목적으로 사용하지 마시고 참고용으로만 활용하세요.

## 📱 모바일 최적화

- 터치 친화적인 UI 요소 (최소 48px)
- 드래그 앤 드롭 지원
- 모바일 카메라 직접 접근
- 반응형 레이아웃

## 🔒 보안

- 비밀번호 해싱 (Werkzeug)
- CORS 설정
- SQL Injection 방지
- XSS 방지

## 📄 라이선스

MIT License

## 👥 기여

버그 리포트 및 기능 제안은 Issues를 통해 남겨주세요.

---

Made with ❤️ for allergy-safe life