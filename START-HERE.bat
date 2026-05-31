@echo off
title ConTrackr - Quick Start
echo ================================================
echo   ConTrackr Setup Guide
echo ================================================
echo.
echo BEFORE RUNNING:
echo.
echo 1. Open XAMPP Control Panel (as Administrator)
echo 2. Start APACHE and MYSQL
echo 3. Go to http://localhost/phpmyadmin
echo 4. Create database: contrackr_db
echo 5. Import database\contrackr.sql into contrackr_db
echo.
echo ================================================
echo.
echo Opening setup instructions...
start "" "README.md"
echo.
echo When ready:
echo   Double-click start-backend.bat  (in a CMD window)
echo   Double-click start-frontend.bat (in ANOTHER CMD window)
echo.
echo Then open: http://localhost:5173
echo.
pause
