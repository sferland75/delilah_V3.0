@echo off
echo Verifying repository status...

echo.
echo Branch status:
git branch -vv

echo.
echo Remote status:
git remote show origin

echo.
echo Local status:
git status

pause