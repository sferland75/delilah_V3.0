@echo off
echo Clearing Next.js cache and restarting the application...
echo.

echo Stopping Next.js server (if running)...
taskkill /FI "WINDOWTITLE eq npm*" /F

echo Clearing Next.js cache...
if exist ".next" rd /s /q ".next"

echo Cache cleared successfully.
echo.
echo Starting application...
npm run dev
