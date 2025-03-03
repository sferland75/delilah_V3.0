@echo off
echo Checking all files in repository...

:: List all files recursively
echo --- All Files in Directory ---
dir /s /b /a-d

echo.
echo --- Git Status ---
git status

echo.
echo --- Git LS-Files ---
git ls-files

pause
