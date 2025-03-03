@echo off
echo Cleaning up branches...

:: Delete main branch locally (force)
git branch -D main

:: Delete backup-master since we don't need it
git branch -D backup-master

:: Delete main branch on remote
git push origin --delete main

echo Done!
git branch -v
pause