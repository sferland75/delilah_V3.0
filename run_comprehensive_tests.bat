@echo off
echo Running comprehensive tests for the Attendant Care section...

REM First, run the calculation tests
echo.
echo ===== Running Calculation Tests =====
npx jest src/sections/9-AttendantCare/__tests__/calculations.flexible.test.ts --no-cache

REM Run schema validation tests
echo.
echo ===== Running Schema Validation Tests =====
npx jest src/sections/9-AttendantCare/__tests__/schema.test.ts src/sections/9-AttendantCare/__tests__/schema.partial.test.ts --no-cache

REM Run component tests
echo.
echo ===== Running Component Tests =====
npx jest --config component-tests.config.js --no-cache

REM Generate combined coverage report
echo.
echo ===== Generating Coverage Report =====
npx jest src/sections/9-AttendantCare/__tests__ --coverage --no-cache > test_output.txt 2>&1

echo.
echo Test output saved to test_output.txt
