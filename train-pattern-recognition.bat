@echo off
echo Delilah V3.0 - Pattern Recognition Training
echo ==========================================
echo.
echo This script will train the pattern recognition system using the expanded dataset.
echo.

echo Step 1: Checking for expanded dataset...
if not exist "pattern_repository\expanded_dataset" (
  echo Error: Expanded dataset not found.
  echo Please ensure the expanded_dataset directory exists in pattern_repository.
  echo Aborting training.
  exit /b 1
) else (
  echo - Expanded dataset found.
  echo - Number of documents in dataset: 
  dir /b /a-d "pattern_repository\expanded_dataset\*.pdf" 2>nul | find /c /v ""
)
echo.

echo Step 2: Setting up Node environment...
if not exist "node_modules\pdfjs-dist" (
  echo - PDF.js not found. Installing dependencies...
  call npm install pdfjs-dist@2.16.105 --save
) else (
  echo - PDF.js found.
)
echo.

echo Step 3: Running pattern analysis script...
echo - This may take several minutes depending on the dataset size.
echo - Processing started at %time%
echo.

echo - Creating log directory...
if not exist "logs" mkdir "logs"

echo - Analyzing documents...
node scripts/analyze-patterns.js > logs/pattern-analysis-%date:~-4,4%%date:~-7,2%%date:~-10,2%.log
if %errorlevel% neq 0 (
  echo Error: Pattern analysis failed.
  echo Please check the logs for details.
  exit /b 1
)
echo - Pattern analysis completed at %time%
echo.

echo Step 4: Generating updated pattern matchers...
echo - Creating backup of current pattern matchers...
if not exist "backups" mkdir "backups"
set backup_dir=backups\patterns_%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%
set backup_dir=%backup_dir: =0%
mkdir "%backup_dir%"
copy "src\utils\pdf-import\PatternMatcher.js" "%backup_dir%\"
echo - Generating new pattern matchers...
node scripts/generate-matchers.js > logs/pattern-generation-%date:~-4,4%%date:~-7,2%%date:~-10,2%.log
if %errorlevel% neq 0 (
  echo Error: Pattern matcher generation failed.
  echo Please check the logs for details.
  exit /b 1
)
echo - Pattern matchers generated successfully.
echo.

echo Step 5: Validating pattern recognition...
echo - Running validation tests...
node scripts/validate-patterns.js > logs/pattern-validation-%date:~-4,4%%date:~-7,2%%date:~-10,2%.log
if %errorlevel% neq 0 (
  echo Warning: Some validation tests failed.
  echo Please check the validation log for details.
  echo You may need to adjust the pattern matchers manually.
) else (
  echo - Validation completed successfully.
)
echo.

echo Step 6: Updating confidence scoring...
echo - Recalibrating confidence scoring based on validation results...
node scripts/calibrate-confidence.js > logs/confidence-calibration-%date:~-4,4%%date:~-7,2%%date:~-10,2%.log
if %errorlevel% neq 0 (
  echo Warning: Confidence calibration failed.
  echo Using default confidence scoring.
) else (
  echo - Confidence scoring updated successfully.
)
echo.

echo Step 7: Creating PDF.js font configuration...
echo - Ensuring PDF.js is properly configured...
if not exist "public\standard_fonts" (
  echo - Creating standard_fonts directory...
  mkdir "public\standard_fonts"
  
  echo - Creating placeholder font files...
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSerif.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSerifBold.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSans.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSansItalic.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSansBold.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSansBoldItalic.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSerifItalic.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitMono.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitMonoItalic.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitMonoBold.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitMonoBoldItalic.pfb"
)

if not exist "public\pdf.worker.js" (
  echo - Copying PDF.js worker...
  copy /Y "node_modules\pdfjs-dist\build\pdf.worker.js" "public\pdf.worker.js"
)
echo - PDF.js configuration completed.
echo.

echo Training completed successfully at %time%!
echo.
echo Summary:
echo - Pattern analysis completed
echo - Pattern matchers generated
echo - Validation tests run
echo - Confidence scoring calibrated
echo - PDF.js configured
echo.
echo Next steps:
echo 1. Check the logs for any warnings or issues
echo 2. Start the app and test with the test page:
echo    npm run dev
echo    Navigate to: http://localhost:3000/test-pdf-import
echo 3. Test with various PDF documents to validate extraction
echo.
