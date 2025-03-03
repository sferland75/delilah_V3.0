@echo off
echo Running Load Assessment Tests...
echo.

jest --config load-assessment-test.config.js --coverage

echo.
echo Load Assessment tests completed.
