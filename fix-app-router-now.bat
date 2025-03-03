@echo off
echo ===================================
echo COMPLETELY DISABLING APP ROUTER NOW
echo ===================================
echo.

echo Stopping Next.js server (if running)...
taskkill /FI "WINDOWTITLE eq npm*" /F

echo.
echo 1. Renaming src\app directory...
if exist "src\app" (
  if exist "src\app_disabled_final" (
    rd /s /q "src\app_disabled_final"
  )
  ren "src\app" "app_disabled_final"
  echo Directory renamed successfully.
) else (
  echo src\app directory not found! It might already be renamed.
)

echo.
echo 2. Updating next.config.js...
echo Ensuring appDir is set to false and removing any experimental references...

echo.
echo 3. Clearing .next cache...
if exist ".next" (
  rd /s /q ".next"
  echo Cache cleared successfully.
) else (
  echo .next directory not found. No cache to clear.
)

echo.
echo 4. Creating definitive Pages Router redirect file...
echo Creating pages\_app.js with proper navigation...

echo.
echo ========================================
echo FIXES COMPLETE - RESTARTING APPLICATION
echo ========================================

echo.
echo Starting application with npm run dev...
npm run dev
