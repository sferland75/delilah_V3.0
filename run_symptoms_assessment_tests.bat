@echo off
echo Running Symptoms Assessment Tests...
echo.

echo === Running Symptoms Assessment Mapper Tests ===
npx jest src/services/__tests__/symptomsAssessmentMapper.test.ts --verbose

echo.
echo === Running Symptoms Assessment Component Tests ===
npx jest src/sections/4-SymptomsAssessment/__tests__/SymptomsAssessment.integrated.test.tsx --verbose

echo.
echo === Running Symptoms Schema Tests ===
npx jest src/sections/4-SymptomsAssessment/__tests__/schema.updated.test.ts --verbose

echo.
echo === Running Migration Tests ===
npx jest src/sections/4-SymptomsAssessment/__tests__/migration.test.ts --verbose

echo.
echo === Running Assessment Context Integration Tests ===
npx jest src/test/assessment-context-integration/SymptomsAssessmentIntegration.test.tsx --verbose

echo.
echo All Symptoms Assessment tests completed!
