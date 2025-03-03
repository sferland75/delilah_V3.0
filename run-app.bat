@echo off
echo Starting Delilah V3.0 with all fixes applied...
echo.

call apply-routing-fix.bat

echo Starting the development server...
npm run dev
