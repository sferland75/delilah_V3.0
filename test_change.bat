@echo off
echo Testing Git tracking...

:: Make a small change to config.ts
echo // Test comment >> src/config.ts

:: Check git status
git status

:: Revert the change
git checkout src/config.ts

echo Done!
pause