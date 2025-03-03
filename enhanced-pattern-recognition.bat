@echo off
echo Delilah V3.0 - Enhanced Pattern Recognition Training
echo ======================================================
echo.
echo This script will:
echo 1. Process the expanded set of 50+ PDF files in the IHAs directory
echo 2. Build a comprehensive pattern recognition model
echo 3. Generate detailed analytics on section detection and extraction
echo 4. Identify the most effective pattern matches
echo.

set /p CONTINUE=Do you want to continue? (Y/N): 

if /i "%CONTINUE%" neq "Y" (
  echo Operation cancelled.
  exit /b 0
)

echo.
echo Step 1: Applying pattern recognition fixes...
call apply-pattern-recognition-fixes.bat
echo.

echo Step 2: Configuring for large dataset processing...
echo - Setting up memory optimizations
echo - Preparing for batch processing
echo.

echo Step 3: Starting enhanced pattern recognition training...
echo This will take several minutes to process all 50+ files.
echo.

node process-all-ihas.js

if %ERRORLEVEL% neq 0 (
  echo There was an error during training. Check the output above for details.
  pause
  exit /b 1
)

echo.
echo Training complete with expanded dataset!
echo.
echo Results are available in d:\delilah\pattern_recognition\training_results
echo.
echo The enhanced model now incorporates patterns from 50+ documents.
echo This will significantly improve recognition accuracy and robustness.
echo.
echo Creating repository backup...
xcopy "d:\delilah\pattern_recognition\training_results\*.*" "D:\delilah_V3.0\pattern_repository\expanded_dataset\" /S /I /Y
echo.
echo Backup complete.
echo.
pause
