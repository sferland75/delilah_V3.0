@echo off
echo ===================================
echo Simple ZIP Backup of Delilah V3.0
echo ===================================

REM Create timestamp for zip filename
set TIMESTAMP=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%_%TIME:~0,2%-%TIME:~3,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_PATH=d:\delilah_V3.0_backup_%TIMESTAMP%.zip

REM Create zip backup without including node_modules
echo Creating backup without node_modules at:
echo %BACKUP_PATH%
echo.
echo Please wait, this may take a moment...

powershell -Command "Get-ChildItem -Path 'd:\delilah_V3.0' -Exclude 'node_modules','.next','.git' | Compress-Archive -DestinationPath '%BACKUP_PATH%' -Force"

echo.
echo Backup created at:
echo %BACKUP_PATH%
echo.

pause
