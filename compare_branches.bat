@echo off
echo Comparing main and master branches...

echo.
echo Files different between main and master:
git diff --name-status main master

echo.
echo Commit history on main:
git log --oneline main -n 5

echo.
echo Commit history on master:
git log --oneline master -n 5

pause