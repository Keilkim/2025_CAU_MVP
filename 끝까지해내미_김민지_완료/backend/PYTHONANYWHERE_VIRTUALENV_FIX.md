# PythonAnywhere Virtualenv 설정 문제 해결 가이드

## 문제 진단
PythonAnywhere에서 "There is a problem with your virtualenv setup" 오류가 발생하는 일반적인 원인:

1. 가상환경이 생성되지 않음
2. 가상환경 경로가 잘못 설정됨
3. Python 버전 불일치
4. WSGI 파일의 경로 설정 오류

## 해결 방법

### 방법 1: 가상환경 없이 설정 (초보자 권장)

1. **Web 탭에서 Virtualenv 섹션 비우기**
   - Virtualenv 경로를 완전히 비워두세요

2. **Bash 콘솔에서 패키지 설치**
   ```bash
   cd ~/alleralert/backend
   pip3.10 install --user -r requirements.txt
   ```

3. **간단한 WSGI 파일 사용** (`wsgi_simple.py`)
   ```python
   # USERNAME을 실제 사용자명으로 변경
   USERNAME = 'yourusername'
   ```

4. **Web 탭에서 WSGI 파일 내용 복사**
   - WSGI configuration file 링크 클릭
   - `wsgi_simple.py` 내용을 복사하여 붙여넣기

### 방법 2: 가상환경 올바르게 설정

1. **Bash 콘솔에서 가상환경 생성**
   ```bash
   # 기존 가상환경 삭제 (있는 경우)
   rm -rf ~/.virtualenvs/alleralert

   # 새 가상환경 생성
   mkvirtualenv alleralert --python=/usr/bin/python3.10

   # 가상환경 활성화
   workon alleralert

   # 패키지 설치
   cd ~/alleralert/backend
   pip install -r requirements.txt
   ```

2. **Web 탭에서 Virtualenv 경로 설정**
   ```
   /home/yourusername/.virtualenvs/alleralert
   ```
   (yourusername을 실제 사용자명으로 변경)

3. **WSGI 파일 수정**
   - `wsgi.py`의 USERNAME 변경
   - Python 버전 확인 및 수정

### 방법 3: PythonAnywhere 기본 설정 사용

1. **새 Web App 생성**
   - Web 탭에서 기존 앱 삭제
   - "Add a new web app" 클릭
   - Flask 선택
   - Python 3.10 선택

2. **자동 생성된 WSGI 파일 수정**
   ```python
   import sys

   # 프로젝트 경로 추가
   path = '/home/yourusername/alleralert/backend'
   if path not in sys.path:
       sys.path.append(path)

   from app import app as application
   ```

## 일반적인 오류 메시지와 해결책

### "No module named 'app'"
- backend 폴더 경로가 sys.path에 없음
- 해결: WSGI 파일의 경로 확인

### "No module named 'flask'"
- Flask가 설치되지 않음
- 해결: `pip install flask` 또는 가상환경 확인

### "Permission denied"
- 파일 권한 문제
- 해결: `chmod 755 ~/alleralert/backend`

## 체크리스트

□ PythonAnywhere 사용자명 확인
□ Python 버전 확인 (3.8, 3.9, 3.10)
□ 프로젝트 경로 확인 (`/home/username/alleralert`)
□ requirements.txt 파일 존재 확인
□ app.py 파일 존재 확인
□ WSGI 파일에서 USERNAME 변경
□ Web 탭에서 Reload 클릭

## 테스트 방법

1. **Bash 콘솔에서 테스트**
   ```bash
   cd ~/alleralert/backend
   python3.10 -c "from app import app; print('Import successful!')"
   ```

2. **Error log 확인**
   - Web 탭 → Error log 링크 클릭
   - 최근 오류 메시지 확인

## 권장 설정 순서

1. 먼저 `wsgi_simple.py` 사용 (가상환경 없이)
2. 작동 확인 후 가상환경 설정
3. 필요시 고급 기능 추가

## 도움말

문제가 계속되면:
1. Error log의 전체 메시지 확인
2. PythonAnywhere 포럼 검색
3. 다음 정보와 함께 문의:
   - Python 버전
   - Error log 내용
   - WSGI 파일 내용
   - 디렉토리 구조