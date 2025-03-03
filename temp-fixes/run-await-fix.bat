@echo off
echo Applying await fix to Next.js development server...
node temp-fixes\fix-await-error.js
echo.
echo Fix applied. Now try running 'npm run dev'
