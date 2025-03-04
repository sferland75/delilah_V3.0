@echo off
echo ===================================
echo GitHub Token-Based Push
echo ===================================
echo.

REM Create a branch with a unique name to avoid conflicts
set BRANCH_NAME=routing-fix-%RANDOM%
echo Creating new branch: %BRANCH_NAME%
git checkout -b %BRANCH_NAME%

REM Add and commit changes
echo.
echo Adding all changes...
git add .

echo.
echo Committing changes...
git commit -m "Fixed routing issues - Restored Pages Router functionality"

REM Update the remote URL to include a token placeholder
echo.
echo Updating remote URL to use token authentication...
echo NOTE: You will be prompted for your GitHub Personal Access Token

REM Prompt for token
echo.
echo Please enter your GitHub Personal Access Token:
set /p TOKEN=

REM Update the URL with the token
git remote set-url origin https://%TOKEN%@github.com/sferland75/delilah_V3.0.git

REM Push the branch
echo.
echo Pushing new branch %BRANCH_NAME% to GitHub...
git push -u origin %BRANCH_NAME%

echo.
echo If successful, your code is now on GitHub in the %BRANCH_NAME% branch.
echo You can access it at:
echo https://github.com/sferland75/delilah_V3.0/tree/%BRANCH_NAME%
echo.
echo From your laptop, you can:
echo 1. Clone the repository
echo 2. Checkout this branch with: git checkout %BRANCH_NAME%
echo.
pause