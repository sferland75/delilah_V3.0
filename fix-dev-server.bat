@echo off
echo Fixing all Next.js development server issues...
node temp-fixes\fix-all-awaits.js
echo.
echo Fix applied. Now try running 'npm run dev'
pause
