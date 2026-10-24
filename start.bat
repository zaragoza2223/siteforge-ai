@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo       SiteForge AI - MVP launcher
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found. Install Node.js 20.6+ from https://nodejs.org/
  echo Then close and reopen this file.
  pause
  exit /b 1
)

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo Created .env from .env.example
)

if not exist "node_modules" (
  echo Installing dependencies. This step requires internet access...
  call npm install
  if errorlevel 1 goto failed
)

echo.
echo Starting SiteForge AI...
echo Open http://localhost:5173 in your browser.
echo Keep this window open while using the app.
echo.
call npm run dev
if errorlevel 1 goto failed
goto end

:failed
echo.
echo SiteForge AI could not start. Read the error message above.
echo If package installation failed, check your internet connection and run npm install manually.
pause
exit /b 1

:end
endlocal
