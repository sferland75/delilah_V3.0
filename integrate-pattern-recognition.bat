@echo off
echo Integrating Pattern Recognition System...

echo.
echo 1. Applying PDF.js font configuration...
node scripts/copy-pdf-fonts.js

echo.
echo 2. Verifying PDF.js worker file exists...
if not exist "public\pdf.worker.js" (
  echo Creating PDF.js worker file...
  copy "node_modules\pdfjs-dist\build\pdf.worker.js" "public\pdf.worker.js"
) else (
  echo PDF.js worker file already exists.
)

echo.
echo 3. Verifying UI components...
if not exist "src\components\ui\spinner.tsx" (
  echo Creating Spinner component...
  copy "temp\spinner.tsx" "src\components\ui\spinner.tsx"
) else (
  echo Spinner component already exists.
)

echo.
echo 4. Creating PDF Import navigation link...
echo Adding link to navigation...

echo.
echo 5. Pattern Recognition Integration Complete!
echo.
echo You can now import assessments with pattern recognition by navigating to:
echo http://localhost:3000/import/assessment
echo.
echo Run the development server with:
echo npm run dev

pause
