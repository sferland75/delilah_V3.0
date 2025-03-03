@echo off
echo Combining all section files into a complete assessment...
node combine-all.js
echo.
echo If successful, complete_assessment.json has been created
echo File location: %~dp0complete_assessment.json
pause
