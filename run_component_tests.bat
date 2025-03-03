@echo off
echo Running component tests...
npx jest --config component-tests.config.js --no-cache --coverage > test_output.txt 2>&1
echo Test output saved to test_output.txt
