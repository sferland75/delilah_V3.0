@echo off
echo ===================================
echo Delilah V3.0 One-Click Fix
echo ===================================
echo.

REM Run both fix scripts
echo Step 1: Fixing all require/import paths...
call fix-all-require-paths.bat

echo Step 2: Fixing all UI paths and creating fallbacks...
call fix-all-paths.bat

echo.
echo ===================================
echo All fixes have been applied!
echo ===================================
echo.
echo The application should now be functioning with the Pages Router.
echo If you're still experiencing issues, try accessing:
echo - http://localhost:3000/simple-nav
echo - http://localhost:3000/fallback/
echo.
echo Starting Next.js development server...
npm run dev