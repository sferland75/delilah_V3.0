@echo off
echo.
echo ==================================================
echo         DELILAH V3.0 EMERGENCY RESTART
echo ==================================================
echo.

echo Stopping any running servers...
taskkill /f /im node.exe 2>nul
timeout /t 1 /nobreak >nul

echo.
echo Clearing Next.js cache...
if exist ".next" rd /s /q ".next"

echo.
echo Setting up emergency config...
echo.

echo Starting server...
echo.
echo When the server starts, open http://localhost:3000 in your browser.
echo You should see the emergency navigation page.
echo.

npm run dev
