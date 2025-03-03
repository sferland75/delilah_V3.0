@echo off
echo Running all test suites...

REM Run Medical History tests
echo === Running Medical History Tests ===
npm test -- --testPathPattern=src/services/__tests__/medicalHistoryMapper.test.ts --coverage
npm test -- --testPathPattern=src/sections/3-MedicalHistory/__tests__/ --coverage
npm test -- --testPathPattern=src/test/assessment-context-integration/MedicalHistoryIntegration.test.tsx --coverage

REM Run Symptoms Assessment tests
echo === Running Symptoms Assessment Tests ===
npm test -- --testPathPattern=src/services/__tests__/symptomsAssessmentMapper.test.ts --coverage
npm test -- --testPathPattern=src/sections/4-SymptomsAssessment/__tests__/ --coverage
npm test -- --testPathPattern=src/test/assessment-context-integration/SymptomsAssessmentIntegration.test.tsx --coverage

REM Run Export Functionality tests
echo === Running Export Functionality Tests ===
npm test -- --testPathPattern=src/services/export/__tests__/ --coverage
npm test -- --testPathPattern=src/components/ReportDrafting/__tests__/ExportOptions.test.tsx --coverage

REM Run existing tests
echo === Running Existing Tests ===
npm test -- --testPathPattern=ActivitiesOfDailyLiving --coverage

echo All tests completed!