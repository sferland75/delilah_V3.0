@echo off
echo ===================================
echo Backing up Delilah V3.0 to GitHub
echo ===================================
echo.

REM Ensure we're in the right directory
cd /d d:\delilah_V3.0

REM Check git status
echo Checking git status...
git status

REM Stage all changes
echo.
echo Adding all changes to git...
git add .

REM Create a descriptive commit message with timestamp
echo.
echo Creating commit...
set COMMIT_MSG=Fixed routing issues - Restored Pages Router functionality - %DATE% %TIME%
git commit -m "%COMMIT_MSG%"

REM Push to master branch
echo.
echo Pushing to master branch at github.com/sferland75/delilah_V3.0...
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
  echo Commit message: %COMMIT_MSG%
) ELSE (
  echo.
  echo ===================================
  echo ERROR: Push failed
  echo ===================================
  echo.
  echo Please check if:
  echo 1. You have the correct permissions to push to this repository
  echo 2. Your network connection is working
  echo 3. The remote repository exists
  echo.
  echo You can try manually with these commands:
  echo git add .
  echo git commit -m "Fixed routing issues"
  echo git push origin master
)

echo.
pause