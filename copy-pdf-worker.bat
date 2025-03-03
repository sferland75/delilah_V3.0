@echo off
echo Copying PDF.js worker file to public directory...

if not exist "public" mkdir "public"

if exist "node_modules\pdfjs-dist\build\pdf.worker.js" (
  echo Found PDF.js worker file. Copying to public directory...
  copy /Y "node_modules\pdfjs-dist\build\pdf.worker.js" "public\pdf.worker.js"
  echo Worker file copied successfully!
) else (
  echo PDF.js worker file not found in node_modules.
  echo Creating a placeholder file instead...
  echo // PDF.js worker placeholder - replace with actual worker file > "public\pdf.worker.js"
  echo Please run 'npm install pdfjs-dist@2.16.105 --save' to install PDF.js.
)

echo Done!
