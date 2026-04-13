@echo off
chcp 65001 > nul
echo ==========================================
echo  NingClean Multi-Service Tunnel
echo ==========================================
echo.

set CLOUDFLARED=%USERPROFILE%\cloudflared.exe

:: Check if cloudflared exists
if not exist "%CLOUDFLARED%" (
    echo Cloudflared belum terinstall. Mendownload...
    echo.
    
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%CLOUDFLARED%'"
    
    if exist "%CLOUDFLARED%" (
        echo ✅ Cloudflared berhasil diinstall!
    ) else (
        echo ❌ Gagal mendownload cloudflared.
        pause
        exit /b 1
    )
)

echo Pilih service yang mau di-tunnel:
echo [1] Admin Panel saja (port 3000)
echo [2] API saja (port 4000)  
echo [3] Admin + API (2 tunnel)
echo.
set /p choice="Pilih (1/2/3): "

if "%choice%"=="1" goto admin
if "%choice%"=="2" goto api
if "%choice%"=="3" goto both

:admin
echo.
echo Memulai tunnel ke Admin Panel (http://localhost:3000)...
echo.
echo 🌐 URL akan muncul di bawah dalam beberapa detik...
echo    Copy URL tersebut dan bagikan!
echo.
echo Tekan Ctrl+C untuk berhenti.
echo ==========================================
"%CLOUDFLARED%" tunnel --url http://localhost:3000
goto end

:api
echo.
echo Memulai tunnel ke API (http://localhost:4000)...
echo.
echo 🌐 URL akan muncul di bawah dalam beberapa detik...
echo    Update NEXT_PUBLIC_API_URL di .env.local!
echo.
echo Tekan Ctrl+C untuk berhenti.
echo ==========================================
"%CLOUDFLARED%" tunnel --url http://localhost:4000
goto end

:both
echo.
echo Memulai 2 tunnel secara parallel...
echo.

start "Admin Tunnel" cmd /c "echo Admin Tunnel & echo Tunggu URL... & %CLOUDFLARED% tunnel --url http://localhost:3000 & pause"
timeout /t 2 > nul
start "API Tunnel" cmd /c "echo API Tunnel & echo Tunggu URL... & %CLOUDFLARED% tunnel --url http://localhost:4000 & pause"

echo ✅ 2 window tunnel dibuka!
echo.
echo Note: URL berbeda-beda setiap restart.
echo Untuk subdomain tetap, setup Cloudflare Tunnel dengan config file.
echo.
pause

:end
