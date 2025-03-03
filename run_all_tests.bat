@echo off
echo Running all Attendant Care tests...

REM First run the calculations tests
echo Running calculation tests...
npx jest src/sections/9-AttendantCare/__tests__/calculations.flexible.test.ts --config calculations-test.config.js --no-cache

REM Then run the component tests
echo Running component tests...
npx jest src/sections/9-AttendantCare/__tests__/*.test.tsx --config component-tests.config.js --no-cache

REM Save the results
npx jest --config component-tests.config.js --no-cache --coverage > test_output.txt 2>&1

echo Test output saved to test_output.txt
