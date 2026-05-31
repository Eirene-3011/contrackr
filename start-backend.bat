@echo off
title ConTrackr Backend
echo ================================================
echo   ConTrackr - Backend API Server
echo ================================================
echo.
echo Make sure XAMPP MySQL is running!
echo.
cd /d "%~dp0backend"
if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo IMPORTANT: Edit .env if your MySQL has a password!
    pause
)
echo Installing dependencies...
npm install
echo.
echo Starting backend server...
npm run dev
pause
