@echo off
echo Running Comprehensive Tests Across All Sections

REM Run the Export Tests
echo.
echo ===== Running Export Functionality Tests =====
npx jest --config jest.config.js src/services/export/__tests__/export-service.test.ts src/services/export/__tests__/email-sharing.test.ts src/services/export/__tests__/print-functionality.test.ts src/services/export/__tests__/word-export.test.ts src/components/ui/__tests__/tabs.test.tsx 

REM Run the Assessment Context Integration Tests
echo.
echo ===== Running Assessment Context Integration Tests =====
npx jest --config jest.config.js src/test/assessment-context-integration/MedicalHistoryIntegration.test.tsx src/test/assessment-context-integration/SymptomsAssessmentIntegration.test.tsx src/test/assessment-context-integration/FunctionalStatusIntegration.test.tsx src/test/assessment-context-integration/TypicalDayIntegration.test.tsx

REM Run the PDF Import Tests
echo.
echo ===== Running PDF Import Tests =====
npx jest --config jest.config.js src/test/pdf-integration

REM Run the Attendant Care Tests
echo.
echo ===== Running Attendant Care Tests =====
npx jest src/sections/9-AttendantCare/__tests__ --no-cache

REM Generate combined coverage report for all tests
echo.
echo ===== Generating Comprehensive Coverage Report =====
npx jest --coverage --no-cache > comprehensive_test_output.txt 2>&1

echo.
echo Test output saved to comprehensive_test_output.txt
echo.
echo Comprehensive Test Run Complete
pause
