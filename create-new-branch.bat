@echo off
echo ===================================
echo Creating a Brand New Branch
echo ===================================
echo.

REM Create a unique branch name
set BRANCH_NAME=routing-fix-march-%RANDOM%

REM Create and switch to the new branch
echo Creating and switching to new branch: %BRANCH_NAME%
git checkout -b %BRANCH_NAME%

REM Add all files to the branch
echo.
echo Adding all files to the new branch...
git add .

REM Commit changes
echo.
echo Committing changes to the new branch...
git commit -m "Fixed routing issues - Complete Pages Router restoration"

REM Push the new branch to GitHub
echo.
echo Pushing new branch to GitHub...
echo Branch name: %BRANCH_NAME%
git push -u origin %BRANCH_NAME%

REM Check if the push was successful
IF %ERRORLEVEL% EQU 0 (
  echo.
  echo ===================================
  echo SUCCESS: Branch pushed to GitHub!
  echo ===================================
  echo.
  echo Your fixes are now available in the %BRANCH_NAME% branch at:
  echo https://github.com/sferland75/delilah_V3.0/tree/%BRANCH_NAME%
  echo.
  echo From your laptop, you can:
  echo 1. git clone https://github.com/sferland75/delilah_V3.0.git
  echo 2. git checkout %BRANCH_NAME%
  echo.
  echo Branch name: %BRANCH_NAME%
) ELSE (
  echo.
  echo ===================================
  echo ERROR: Push failed
  echo ===================================
  echo.
  echo Your changes are committed locally to branch: %BRANCH_NAME%
  echo.
  echo Please note the branch name for future reference: %BRANCH_NAME%
  echo.
  echo Try pushing manually with:
  echo git push -u origin %BRANCH_NAME%
)

echo.
pause