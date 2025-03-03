@echo off
echo Running fixed calculations test...
npx jest src/sections/9-AttendantCare/__tests__/calculations.fixed.test.ts --config calculations-test.config.js --no-cache > test_output.txt 2>&1
echo Test output saved to test_output.txt
