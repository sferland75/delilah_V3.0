@echo off
echo Setting up Delilah V3.0 on laptop...

:: Change to user directory
cd c:\users\ferla

:: Clone the repository
git clone https://github.com/sferland75/delilah_V3.0.git

:: Change to project directory
cd delilah_V3.0

:: Install dependencies
npm install

:: Verify setup
echo.
echo Repository Status:
git status
echo.
echo Branch Status:
git branch -v

echo Done! Repository is ready.
pause