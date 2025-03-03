@echo off
echo Running New Mapper Service Tests...
echo.

echo Testing Initial Assessment mapper...
jest src/services/__tests__/initialAssessmentMapper.test.ts --coverage

echo.
echo Testing Purpose & Methodology mapper...
jest src/services/__tests__/purposeMethodologyMapper.test.ts --coverage

echo.
echo All tests completed.
