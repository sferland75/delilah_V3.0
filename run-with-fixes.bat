@echo off
echo Applying fixes and starting the development server...

call apply-fixes.bat

echo.
echo Starting development server...
call npm run dev