@echo off
echo Starting aggressive Git add...

:: Remove cached files
git rm -r --cached .

:: Force add everything
git add --all -f

:: Show status
git status

:: Wait for user confirmation
echo.
echo Check the status above.
set /p continue=Do you want to commit and push these changes? (y/n):

if /i "%continue%"=="y" (
    git commit -m "Force add all project files"
    git push origin master
    echo Done!
) else (
    echo Operation cancelled
)

pause
