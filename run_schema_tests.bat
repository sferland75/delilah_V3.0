@echo off
echo Running schema validation tests...
npx jest --config schema-test.config.js --no-cache > test_output.txt 2>&1
echo Test output saved to test_output.txt
