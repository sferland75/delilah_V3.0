@echo off
echo ===================================================
echo Applying fixes for data loading issues in Assessment Context
echo ===================================================

echo.
echo Step 1: Backing up original files...
echo.

REM Create backups
copy "src\sections\3-MedicalHistory\components\index.ts" "src\sections\3-MedicalHistory\components\index.ts.bak"
copy "src\sections\4-SymptomsAssessment\components\index.ts" "src\sections\4-SymptomsAssessment\components\index.ts.bak"
copy "src\sections\6-TypicalDay\components\index.ts" "src\sections\6-TypicalDay\components\index.ts.bak"
copy "src\components\LoadAssessment.tsx" "src\components\LoadAssessment.tsx.bak"

echo.
echo Step 2: Installing debug components...
echo.

REM Apply debug components
copy "src\sections\3-MedicalHistory\components\MedicalHistory.debug-index.ts" "src\sections\3-MedicalHistory\components\index.ts"
copy "src\sections\4-SymptomsAssessment\components\SymptomsAssessment.debug-index.ts" "src\sections\4-SymptomsAssessment\components\index.ts"
copy "src\components\LoadAssessment.fixed.tsx" "src\components\LoadAssessment.tsx"

echo.
echo Debug components installed. You can now test the application to identify issues.
echo.
echo When ready to apply the final fixes, press any key to continue...
pause

echo.
echo Step 3: Applying final fixes...
echo.

REM Restore original index files
copy "src\sections\3-MedicalHistory\components\index.ts.bak" "src\sections\3-MedicalHistory\components\index.ts"
copy "src\sections\4-SymptomsAssessment\components\index.ts.bak" "src\sections\4-SymptomsAssessment\components\index.ts"
copy "src\sections\6-TypicalDay\components\index.ts.bak" "src\sections\6-TypicalDay\components\index.ts"

REM Apply fixed component versions
copy "src\sections\3-MedicalHistory\components\MedicalHistory.integrated.fixed.tsx" "src\sections\3-MedicalHistory\components\MedicalHistory.integrated.tsx"
copy "src\sections\4-SymptomsAssessment\components\SymptomsAssessment.integrated.fixed.tsx" "src\sections\4-SymptomsAssessment\components\SymptomsAssessment.integrated.tsx"
copy "src\sections\6-TypicalDay\components\TypicalDay.integrated.fixed.tsx" "src\sections\6-TypicalDay\components\TypicalDay.integrated.tsx"

REM Keep the fixed LoadAssessment component
echo.
echo All fixes have been applied!
echo.
echo ===================================================
echo NEXT STEPS:
echo 1. Restart your development server
echo 2. Load the sample cases to verify data appears correctly
echo 3. Check Medical History, Emotional Symptoms, and Typical Day sections
echo ===================================================

echo.
echo Press any key to exit...
pause
