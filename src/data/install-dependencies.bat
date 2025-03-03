@echo off
echo Installing Node.js dependencies for assessment loader...
cd /d %~dp0
npm init -y
echo Dependencies installed successfully.
echo.
echo To generate the complete assessment data, run:
echo node sample_assessment_loader.js
pause
