@echo off
chcp 65001 > nul
title TMD Studio Pro v3.2 AI Cinematic Edition
color 0B

echo ===============================================================================
echo                🎬 TMD STUDIO PRO v3.2 AI CINEMATIC EDITION 🎬
echo         (8 Generative Video Engines, 24/7 AI Livestream, Sound Design)
echo ===============================================================================
echo.

echo [*] Đang kiểm tra môi trường Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] KHÔNG TÌM THẤY NODE.JS! Vui lòng cài đặt Node.js từ https://nodejs.org/
    pause
    exit /b
)

echo [*] Node.js đã sẵn sàng.
echo [*] Đang khởi động TMD Studio Pro Server trên cổng 3000...

:: Kiểm tra port 3000 xem có process nào đang chạy chưa
netstat -ano | findstr :3000 >nul 2>nul
if %errorlevel% equ 0 (
    echo [*] Server TMD Studio Pro đã đang chạy ngầm trên port 3000.
) else (
    start /b node server.js >nul 2>nul
    timeout /t 2 >nul
    echo [*] Khởi động server thành công!
)

echo [*] Đang mở giao diện TMD Studio Pro trong trình duyệt...
start http://localhost:3000/studio/index.html

echo.
echo ===============================================================================
echo  Hệ thống đang hoạt động tại: http://localhost:3000/studio/index.html
echo  Để tắt hệ thống, bạn có thể đóng cửa sổ này hoặc nhấn phím bất kỳ.
echo ===============================================================================
echo.
pause
