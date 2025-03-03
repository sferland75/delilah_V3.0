@echo off
npm test -- --testPathPattern=ActivitiesOfDailyLiving --coverage --coverageReporters="text" --coverageReporters="text-summary" > test_output.txt 2>&1
type test_output.txt