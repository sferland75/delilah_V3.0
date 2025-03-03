@echo off
echo Running Attendant Care section tests...
npm test -- --testPathPattern=9-AttendantCare --no-cache --watchAll=false > test_output_attendant_care.txt 2>&1
echo Test output saved to test_output_attendant_care.txt
echo.
echo To review the tests:
echo 1. Look for "Tests:" at the end of the output file
echo 2. Check for passing/failing tests
echo.
type test_output_attendant_care.txt | findstr /C:"Tests:" /C:"PASS" /C:"FAIL" 
