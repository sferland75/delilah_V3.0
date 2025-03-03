@echo off
echo Delilah V3.0 - Pattern Recognition Setup

:: Navigate to the pattern recognition directory
cd /d d:\delilah\pattern_recognition

:: Run the setup script
call setup.bat

:: Return to Delilah V3.0 directory
cd /d d:\delilah_V3.0

echo.
echo Setup complete! To run the pattern recognition system:
echo 1. cd /d d:\delilah\pattern_recognition
echo 2. run.bat
echo.
echo Or you can use the run_pattern_recognition.bat script.
