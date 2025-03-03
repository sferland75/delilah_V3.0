@echo off
echo Running comprehensive fixes for Next.js development server...
echo.

echo Step 1: Fixing duplicate safePath functions and path.relative type errors...
call temp-fixes\run-fix.bat

echo.
echo Step 2: Fixing await error...
call temp-fixes\run-await-fix.bat

echo.
echo All fixes have been applied. Try running the development server:
echo npm run dev
