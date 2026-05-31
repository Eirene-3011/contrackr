@echo off
title ConTrackr Frontend
echo ================================================
echo   ConTrackr - Frontend (React + Vite)
echo ================================================
echo.
cd /d "%~dp0frontend"
echo Installing dependencies...
npm install
echo.
echo Starting frontend dev server...
echo.
echo Once started, open: http://localhost:5173
echo.
npm run dev
pause
