@echo off
echo Running Assessment Context Integration Tests...
echo.

npx jest --config jest.config.js src/test/assessment-context-integration/MedicalHistoryIntegration.test.tsx src/test/assessment-context-integration/SymptomsAssessmentIntegration.test.tsx src/test/assessment-context-integration/FunctionalStatusIntegration.test.tsx src/test/assessment-context-integration/TypicalDayIntegration.test.tsx src/test/assessment-context-integration/EnvironmentalAssessmentIntegration.test.tsx src/test/assessment-context-integration/ActivitiesOfDailyLivingIntegration.test.tsx src/test/assessment-context-integration/AttendantCareIntegration.test.tsx

echo.
echo Assessment Context Integration Tests Complete
pause
