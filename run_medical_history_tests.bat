@echo off
echo Running Medical History Tests...
echo.

echo === Running Medical History Mapper Tests ===
npx jest src/services/__tests__/medicalHistoryMapper.test.ts --verbose

echo.
echo === Running Medical History Component Tests ===
npx jest src/sections/3-MedicalHistory/__tests__/MedicalHistory.integrated.test.tsx --verbose

echo.
echo === Running Standardized Tabs Tests ===
npx jest src/sections/3-MedicalHistory/__tests__/StandardizedTabs.test.tsx --verbose

echo.
echo === Running Assessment Context Integration Tests ===
npx jest src/test/assessment-context-integration/MedicalHistoryIntegration.test.tsx --verbose

echo.
echo All Medical History tests completed!
