@echo off
echo ===== Applying Pattern Recognition Optimizations =====

echo.
echo 1. Backing up original PatternMatcher.js...
copy /Y src\utils\pdf-import\PatternMatcher.js src\utils\pdf-import\PatternMatcher.original.js
if errorlevel 1 (
  echo ERROR: Failed to backup PatternMatcher.js
  exit /b 1
) else (
  echo Backup created: src\utils\pdf-import\PatternMatcher.original.js
)

echo.
echo 2. Installing optimized PatternMatcher...
copy /Y src\utils\pdf-import\PatternMatcher.optimized.js src\utils\pdf-import\PatternMatcher.js
if errorlevel 1 (
  echo ERROR: Failed to install optimized PatternMatcher
  exit /b 1
) else (
  echo Installed optimized PatternMatcher
)

echo.
echo 3. Installing new section extractors...
echo - Installing FUNCTIONAL_STATUSExtractor
copy /Y src\utils\pdf-import\patterns\FUNCTIONAL_STATUSExtractor.js src\utils\pdf-import\FUNCTIONAL_STATUSExtractor.js
echo - Installing TYPICAL_DAYExtractor
copy /Y src\utils\pdf-import\patterns\TYPICAL_DAYExtractor.js src\utils\pdf-import\TYPICAL_DAYExtractor.js
echo - Installing ADLSExtractor
copy /Y src\utils\pdf-import\patterns\ADLSExtractor.js src\utils\pdf-import\ADLSExtractor.js

echo.
echo 4. Running implementation test...
node src/utils/pdf-import/runImplementation.js > pattern_recognition_test_output.txt
if errorlevel 1 (
  echo ERROR: Implementation test failed
  exit /b 1
) else (
  echo Implementation test completed. Results saved to pattern_recognition_test_output.txt
)

echo.
echo 5. Running the dashboard generator...
mkdir public\pattern_repository 2>nul
mkdir public\pattern_repository\dashboard 2>nul
copy /Y pattern_repository\dashboard\index.html public\pattern_repository\dashboard\index.html
if errorlevel 1 (
  echo WARNING: Failed to copy dashboard to public directory
) else (
  echo Dashboard copied to public directory
)

echo.
echo ===== Pattern Recognition Optimization Complete =====
echo.
echo Documentation:
echo - See PATTERN_RECOGNITION_OPTIMIZATION.md for details on the changes made
echo - Access the dashboard at http://localhost:3000/pattern_repository/dashboard/index.html
echo - Test results are in pattern_recognition_test_output.txt
echo.
echo Next steps:
echo 1. Start the application with 'npm run dev'
echo 2. Verify the dashboard loads correctly
echo 3. Test with sample documents
echo.
