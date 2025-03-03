@echo off
echo Running standalone tests (no mocks)...
npx jest --config standalone-tests.config.js --no-cache > test_output.txt 2>&1
echo Test output saved to test_output.txt
