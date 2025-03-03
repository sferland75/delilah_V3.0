@echo off
cd /d d:\delilah_V3.0

echo Running Symptoms Section Tests...
echo ------------------------------------

:: Clear previous output
if exist test_output.txt del test_output.txt

:: Run tests with more verbose output
echo Running jest tests... > test_output.txt
npm test src/sections/3-SymptomsAssessment/tests -- --verbose >> test_output.txt 2>&1

:: Display results
echo.
echo Test Results:
echo ------------------------------------
type test_output.txt

echo.
echo Full output saved to test_output.txt