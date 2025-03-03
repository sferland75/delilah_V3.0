@echo off
echo Applying careful, manual fixes to the Next.js development server...
echo.
echo This will:
echo 1. Back up the original file if needed
echo 2. Fix path.relative calls
echo 3. Remove duplicate safePath functions
echo 4. Wrap awaits in an async function
echo.
node manual-fix.js
echo.
echo Fix complete. Try running:
echo npm run dev
