@echo off
echo Running calculation tests...
npx jest --config calculations-test.config.js --no-cache > test_output.txt 2>&1
echo Test output saved to test_output.txt
