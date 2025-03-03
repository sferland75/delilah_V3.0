@echo off
echo ================================================
echo RUNNING SIMPLE TEST FIRST TO VERIFY JEST SETUP
echo ================================================
echo.
npx jest src/services/__tests__/simple.test.ts --no-cache --verbose
echo.
echo ================================================
echo SIMPLE TEST COMPLETED
echo ================================================
echo.

echo ================================================
echo RUNNING PDF PROCESSING SERVICE TESTS
echo ================================================
echo.
npx jest src/services/__tests__/pdfProcessingService.test.ts --no-cache --verbose
echo.
echo ================================================
echo PDF PROCESSING SERVICE TESTS COMPLETED
echo ================================================
echo.

echo ================================================
echo RUNNING PATTERN MATCHER TESTS
echo ================================================
echo.
npx jest src/services/__tests__/patternMatcher.test.ts --no-cache --verbose
echo.
echo ================================================
echo PATTERN MATCHER TESTS COMPLETED
echo ================================================
echo.

echo ================================================
echo RUNNING PDF IMPORT COMPONENT TESTS
echo ================================================
echo.
npx jest src/components/__tests__/PdfImportComponent.test.tsx --no-cache --verbose
echo.
echo ================================================
echo PDF IMPORT COMPONENT TESTS COMPLETED
echo ================================================
echo.

echo ================================================
echo RUNNING PDF INTEGRATION TESTS
echo ================================================
echo.
npx jest src/test/pdf-integration/PdfImportIntegration.test.tsx --no-cache --verbose
echo.
echo ================================================
echo PDF INTEGRATION TESTS COMPLETED
echo ================================================
echo.

echo ALL PDF TESTS COMPLETED
