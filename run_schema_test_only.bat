@echo off
echo Running schema test only...
npx jest src/sections/9-AttendantCare/__tests__/schema.test.ts --no-cache > test_output.txt 2>&1
echo Test output saved to test_output.txt
