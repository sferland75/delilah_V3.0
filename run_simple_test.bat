@echo off
echo Running simple test to verify Jest setup...
npx jest src/services/__tests__/simple.test.ts --no-cache --verbose
echo Simple test completed.
