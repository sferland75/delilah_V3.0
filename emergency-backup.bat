@echo off
echo ===================================
echo Creating Emergency Backup of Delilah V3.0
echo ===================================
echo.

REM Create timestamp for the backup folder name
set TIMESTAMP=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%_%TIME:~0,2%-%TIME:~3,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_FOLDER=d:\delilah_backup_%TIMESTAMP%

REM Create backup folder
echo Creating backup folder at:
echo %BACKUP_FOLDER%
mkdir "%BACKUP_FOLDER%"

REM Copy all files except node_modules and .git
echo.
echo Copying files (excluding node_modules and .git)...
xcopy "d:\delilah_V3.0\*" "%BACKUP_FOLDER%\" /E /I /H /Y /EXCLUDE:d:\delilah_V3.0\exclude.txt

REM Create the exclude.txt file
echo node_modules > d:\delilah_V3.0\exclude.txt
echo .git >> d:\delilah_V3.0\exclude.txt
echo .next >> d:\delilah_V3.0\exclude.txt

REM Verify the backup was created
dir "%BACKUP_FOLDER%"

echo.
echo ===================================
echo Backup complete!
echo ===================================
echo.
echo Your code has been backed up to:
echo %BACKUP_FOLDER%
echo.
echo You can now safely continue working on your project.
echo.
pause