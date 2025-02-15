@echo off
echo Syncing all project files...

:: Force add all files
git add -A

:: Commit changes
git commit -m "Sync all project files"

:: Push to remote
git push origin master

echo Done!
pause
