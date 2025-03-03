@echo off
echo Running unit tests (calculations and schema)...
npx jest --config calculations-and-schema.config.js --no-cache > test_output.txt 2>&1
echo Test output saved to test_output.txt
