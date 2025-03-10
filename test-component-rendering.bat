@echo off
echo Testing component rendering after fixes...

echo.
echo Running specific tests for Medical History components...
npm test -- -t "MedicalHistory" --verbose

echo.
echo Running render tests for all components...
npm test -- --testPathPattern=".*\.test\.tsx$" --verbose

echo.
echo Testing complete! Review the output for any errors.