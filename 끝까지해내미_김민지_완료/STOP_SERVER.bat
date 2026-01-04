@echo off
echo ========================================
echo   서버 종료 중...
echo ========================================
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *http.server*"
echo.
echo 서버가 종료되었습니다.
pause
