@echo off
echo Forcing Git to recognize all files...

:: Remove any existing Git index
del .git\index

:: Reset the Git repository
git reset

:: Force add everything including src directory
git add -f src/*
git add -f .gitignore
git add -f *.js
git add -f *.json
git add -f *.md

:: Commit changes
git commit -m "Force add all source files"

:: Push to remote
git push origin master

echo Done!
pause
