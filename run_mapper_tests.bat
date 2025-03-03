@echo off
echo Running Mapper Service Tests...
echo.

echo Testing Environmental Cross References...
jest src/services/__tests__/environmentalCrossReferences.test.ts --coverage

echo.
echo Testing Environmental Assessment mapper...
jest src/services/__tests__/environmentalAssessmentMapper.test.ts --coverage

echo.
echo Testing Functional Status mapper...
jest src/services/__tests__/functionalStatusMapper.test.ts --coverage

echo.
echo Testing Typical Day mapper...
jest src/services/__tests__/typicalDayMapper.test.ts --coverage

echo.
echo Testing Activities of Daily Living mapper...
jest src/services/__tests__/activitiesOfDailyLivingMapper.test.ts --coverage

echo.
echo Testing Attendant Care mapper...
jest src/services/__tests__/attendantCareMapper.test.ts --coverage

echo.
echo Testing Initial Assessment mapper...
jest src/services/__tests__/initialAssessmentMapper.test.ts --coverage

echo.
echo Testing Purpose & Methodology mapper...
jest src/services/__tests__/purposeMethodologyMapper.test.ts --coverage

echo.
echo Running Integration Tests...

echo.
echo Testing Environmental Assessment integration...
jest src/test/assessment-context-integration/EnvironmentalAssessmentIntegration.test.tsx --coverage

echo.
echo Testing Functional Status integration...
jest src/test/assessment-context-integration/FunctionalStatusIntegration.test.tsx --coverage

echo.
echo Testing Typical Day integration...
jest src/test/assessment-context-integration/TypicalDayIntegration.test.tsx --coverage

echo.
echo Testing Activities of Daily Living integration...
jest src/test/assessment-context-integration/ActivitiesOfDailyLivingIntegration.test.tsx --coverage

echo.
echo Testing Attendant Care integration...
jest src/test/assessment-context-integration/AttendantCareIntegration.test.tsx --coverage

echo.
echo Testing PDF Import integration...
jest src/test/pdf-integration/PdfImportIntegration.test.tsx --coverage

echo.
echo All tests completed.
