@echo off
chcp 65001 > nul
echo ==========================================
echo  NingClean Cloudflare Tunnel Quick Start
echo ==========================================
echo.

set CLOUDFLARED=%USERPROFILE%\cloudflared.exe
set ADMIN_URL=http://localhost:3000

:: Check if cloudflared exists
if not exist "%CLOUDFLARED%" (
    echo Cloudflared belum terinstall. Mendownload...
    echo.
    
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%CLOUDFLARED%'"
    
    if exist "%CLOUDFLARED%" (
        echo ✅ Cloudflared berhasil diinstall!
    ) else (
        echo ❌ Gagal mendownload cloudflared.
        echo Silakan download manual dari: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
        pause
        exit /b 1
    )
) else (
    echo ✅ Cloudflared sudah terinstall.
)

echo.
echo Memulai tunnel ke %ADMIN_URL%...
echo URL akan muncul di bawah (tunggu beberapa detik)...
echo.
echo Tekan Ctrl+C untuk berhenti.
echo ==========================================
echo.

"%CLOUDFLARED%" tunnel --url %ADMIN_URL%
