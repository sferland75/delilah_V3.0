@echo off
echo ===================================
echo Detailed Backup of Delilah V3.0 to GitHub
echo ===================================
echo.

REM Ensure we're in the right directory
cd /d d:\delilah_V3.0

REM Check git status
echo Checking git status...
git status

REM Stage and commit configuration changes
echo.
echo Committing configuration changes...
git add next.config.js jsconfig.json tsconfig.json
git commit -m "Fix: Updated Next.js configuration for Pages Router"

REM Stage and commit path fixes
echo.
echo Committing import path fixes...
git add pages\*.tsx pages\*.js pages\assessment\*.tsx
git commit -m "Fix: Updated import paths for Pages Router compatibility"

REM Stage and commit emergency navigation
echo.
echo Committing emergency navigation files...
git add public\fallback\* public\root.html pages\simple-nav.tsx
git commit -m "Add: Created reliable emergency navigation alternatives"

REM Stage and commit documentation
echo.
echo Committing documentation...
git add PAGES_ROUTER_RESTORATION.md ROUTING_911_EMERGENCY_FIX.md
git commit -m "Doc: Added documentation for routing system restoration"

REM Stage and commit scripts
echo.
echo Committing fix scripts...
git add *.bat
git commit -m "Tools: Added batch scripts for fixing routing issues"

REM Stage and commit any remaining changes
echo.
echo Committing any remaining changes...
git add .
git commit -m "Fix: Additional routing fixes and cleanup"

REM Push to master branch
echo.
echo Pushing all commits to master branch at github.com/sferland75/delilah_V3.0...
git push origin master

REM Verify the push was successful
IF %ERRORLEVEL% EQU 0 (
  echo.
  echo ===================================
  echo SUCCESS: Changes pushed to GitHub!
  echo ===================================
  echo.
  echo Your fixes have been successfully backed up to:
  echo https://github.com/sferland75/delilah_V3.0
  echo Branch: master
  echo With multiple detailed commits
) ELSE (
  echo.
  echo ===================================
  echo ERROR: Push failed
  echo ===================================
  echo.
  echo Please try the simpler git-backup.bat script or push manually.
)

echo.
pause