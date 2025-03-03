@echo off
echo Applying all necessary fixes for Delilah V3.0...
echo.

echo 1. Applying syntax error fixes...
call fix-both-syntax-errors.bat

echo.
echo 2. Applying routing fixes...
call apply-routing-fix.bat

echo.
echo 3. Starting the application...
npm run dev
