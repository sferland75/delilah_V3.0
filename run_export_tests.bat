@echo off
echo Running Export Functionality Tests...
echo.

npx jest --config jest.config.js src/services/export/__tests__/export-service.test.ts src/services/export/__tests__/email-sharing.test.ts src/services/export/__tests__/print-functionality.test.ts src/services/export/__tests__/word-export.test.ts src/components/ui/__tests__/tabs.test.tsx

echo.
echo Export Tests Complete
pause
