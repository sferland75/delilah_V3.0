@echo off
echo Cleaning up branches...

:: Force delete main locally
git branch -D main

:: Delete main remotely
git push origin --delete main

echo Done!
pause