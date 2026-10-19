@echo off
title TMD Studio Pro - Video Editor & Vietnamese Humanizer
echo ======================================================================
echo           TMD STUDIO PRO - VIDEO EDITOR & VIETNAMESE HUMANIZER
echo ======================================================================
echo.
echo [1/2] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [2/2] Launching TMD Studio Pro Desktop GUI...
start "" "msedge.exe" --app="http://localhost:3000" --window-size=1440,900 || start "" "chrome.exe" --app="http://localhost:3000" --window-size=1440,900 || start http://localhost:3000

node server.js
pause
