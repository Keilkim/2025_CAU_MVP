# 2025 중앙대학교 RISE 창업캠프 MVP 프로젝트

중앙대학교 RISE 창업캠프에서 개발된 9개의 MVP 프로젝트 모음입니다.

## 프로젝트 목록

| # | 프로젝트명 | 팀/개인 | 기술 스택 | 설명 |
|---|-----------|---------|-----------|------|
| 1 | **CalSnap** | 굿모닝베이커리 (이서영) | Next.js | 칼로리 스냅 앱 |
| 2 | **치료 일지 앱** | 기억을 짓는 사람들 (김송희) | Flask, Python | 치매 환자 치료 일지 관리 |
| 3 | **ML Server Platform** | 김민건 | Next.js, TypeScript | ML 서버 플랫폼 |
| 4 | **AllerAlert** | 끝까지해내미 (김민지) | Flask, HTML/JS | 알레르기 경고 서비스 |
| 5 | **바우덕이 게임** | 바우덕이 | Next.js, TypeScript | 리듬 게임 |
| 6 | **파충류/곤충 용품샵** | 박건우 | Next.js, TypeScript | 특수동물 용품 쇼핑몰 |
| 7 | **Fire Pouch Shop** | 엔지니어링 베이 (변동민) | Next.js | 방화 파우치 쇼핑몰 |
| 8 | **맛남앱** | 팀파이 | Next.js, TypeScript | 맛집 추천 앱 |
| 9 | **Pet Emergency** | 포넥스 (박찬욱) | Next.js, TypeScript | 반려동물 응급 서비스 |

## 폴더 구조

```
├── 굿모닝베이커리_이서영_완료/    # CalSnap
├── 기억을 짓는 사람들_김송희_완료/ # 치료 일지 앱
├── 김민건/                        # ML Server Platform
├── 끝까지해내미_김민지_완료/      # AllerAlert
├── 바우덕이/                      # 바우덕이 게임
├── 박건우_완료/                   # 파충류/곤충 용품샵
├── 엔지니어링 베이_변동민_완료/   # Fire Pouch Shop
├── 팀파이/                        # 맛남앱
└── 포넥스_박찬욱_완료/            # Pet Emergency
```

## 로컬 실행 방법

### Next.js 프로젝트 (대부분의 프로젝트)
```bash
cd [프로젝트 폴더]/[앱 폴더]
npm install
npm run dev
```

### Flask 프로젝트 (기억을 짓는 사람들, 끝까지해내미)
```bash
cd [프로젝트 폴더]
pip install -r requirements.txt
python app.py
```

## 배포

- **Vercel**: Next.js 프로젝트 배포
- **Supabase**: 백엔드 및 데이터베이스
- **PythonAnywhere**: Flask 프로젝트 배포

## 라이선스

이 프로젝트들은 중앙대학교 RISE 창업캠프의 교육 목적으로 개발되었습니다.
