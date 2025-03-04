@echo off
echo ===================================
echo Creating ZIP Backup of Delilah V3.0
echo ===================================
echo.

REM Create a timestamp for the backup filename
set TIMESTAMP=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

REM Define backup path
set BACKUP_PATH=d:\delilah_V3.0_backup_%TIMESTAMP%.zip

REM Create the ZIP backup using PowerShell
echo Creating ZIP backup at %BACKUP_PATH%...
powershell -Command "Compress-Archive -Path 'd:\delilah_V3.0\*' -DestinationPath '%BACKUP_PATH%' -Force"

REM Verify the backup was created
IF EXIST "%BACKUP_PATH%" (
  echo.
  echo ===================================
  echo SUCCESS: Backup created!
  echo ===================================
  echo.
  echo Your project has been backed up to:
  echo %BACKUP_PATH%
  echo.
  echo File size: 
  for %%I in ("%BACKUP_PATH%") do echo %%~zI bytes
) ELSE (
  echo.
  echo ===================================
  echo ERROR: Backup creation failed
  echo ===================================
  echo.
  echo Please check if you have enough disk space and appropriate permissions.
)

echo.
pause