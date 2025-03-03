@echo off
echo Running FIXED Attendant Care section tests...
npm test -- --testPathPattern=9-AttendantCare --no-cache --watchAll=false > test_output_fixed.txt 2>&1
echo Test output saved to test_output_fixed.txt
echo.
echo Test Summary:
type test_output_fixed.txt | findstr /C:"Tests:" /C:"PASS" /C:"FAIL" 
