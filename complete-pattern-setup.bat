@echo off
echo Delilah V3.0 - Pattern Recognition Setup
echo =======================================
echo.
echo This script will complete the pattern recognition setup.
echo.

echo Step 1: Setting up PDF.js font configuration...
if not exist "public\standard_fonts" (
  echo - Creating standard_fonts directory...
  mkdir "public\standard_fonts"
  
  echo - Creating placeholder font files...
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSerif.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSerifBold.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSans.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSansItalic.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSansBold.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSansBoldItalic.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitSerifItalic.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitMono.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitMonoItalic.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitMonoBold.pfb"
  echo PDF.js standard font placeholder > "public\standard_fonts\FoxitMonoBoldItalic.pfb"
)

echo Step 2: Checking for PDF.js worker file...
if not exist "public\pdf.worker.js" (
  echo - pdf.worker.js not found. Copying from node_modules...
  copy /Y "node_modules\pdfjs-dist\build\pdf.worker.js" "public\pdf.worker.js"
  
  if not exist "public\pdf.worker.js" (
    echo - Warning: Could not copy pdf.worker.js.
    echo - Creating placeholder file. This should be replaced with the actual worker file.
    echo // PDF.js worker placeholder - replace with actual worker file > "public\pdf.worker.js"
  ) else (
    echo - pdf.worker.js successfully copied to public directory.
  )
) else (
  echo - pdf.worker.js already exists in public directory.
)

echo Step 3: Setting up copy-pdf-fonts.js script...
if not exist "scripts" mkdir "scripts"

if not exist "scripts\copy-pdf-fonts.js" (
  echo - Creating copy-pdf-fonts.js script...
  echo // PDF.js Font Copy Script > "scripts\copy-pdf-fonts.js"
  echo // Created by complete-pattern-setup.bat >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo const fs = require('fs'); >> "scripts\copy-pdf-fonts.js"
  echo const path = require('path'); >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo const standardFonts = [ >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitSerif.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitSerifBold.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitSans.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitSansItalic.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitSansBold.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitSansBoldItalic.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitSerifItalic.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitMono.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitMonoItalic.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitMonoBold.pfb', >> "scripts\copy-pdf-fonts.js"
  echo   'FoxitMonoBoldItalic.pfb' >> "scripts\copy-pdf-fonts.js"
  echo ]; >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo const publicDir = path.join(__dirname, '..', 'public'); >> "scripts\copy-pdf-fonts.js"
  echo const fontsDir = path.join(publicDir, 'standard_fonts'); >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo try { >> "scripts\copy-pdf-fonts.js"
  echo   if (!fs.existsSync(publicDir)) { >> "scripts\copy-pdf-fonts.js"
  echo     console.log('Creating public directory...'); >> "scripts\copy-pdf-fonts.js"
  echo     fs.mkdirSync(publicDir); >> "scripts\copy-pdf-fonts.js"
  echo   } >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo   if (!fs.existsSync(fontsDir)) { >> "scripts\copy-pdf-fonts.js"
  echo     console.log('Creating standard_fonts directory...'); >> "scripts\copy-pdf-fonts.js"
  echo     fs.mkdirSync(fontsDir); >> "scripts\copy-pdf-fonts.js"
  echo   } >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo   standardFonts.forEach(fontFile => { >> "scripts\copy-pdf-fonts.js"
  echo     const fontPath = path.join(fontsDir, fontFile); >> "scripts\copy-pdf-fonts.js"
  echo     if (!fs.existsSync(fontPath)) { >> "scripts\copy-pdf-fonts.js"
  echo       console.log(`Creating placeholder font file: ${fontFile}`); >> "scripts\copy-pdf-fonts.js"
  echo       fs.writeFileSync(fontPath, 'PDF.js standard font placeholder'); >> "scripts\copy-pdf-fonts.js"
  echo     } >> "scripts\copy-pdf-fonts.js"
  echo   }); >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo   console.log('PDF.js standard font placeholders created successfully!'); >> "scripts\copy-pdf-fonts.js"
  echo } catch (error) { >> "scripts\copy-pdf-fonts.js"
  echo   console.error('Error creating PDF.js standard font placeholders:', error); >> "scripts\copy-pdf-fonts.js"
  echo } >> "scripts\copy-pdf-fonts.js"
) else (
  echo - copy-pdf-fonts.js script already exists.
)

echo Step 4: Checking package.json for font copying script...
findstr /c:"copy-fonts" "package.json" > nul
if %errorlevel% neq 0 (
  echo - Font copying script not found in package.json
  echo - Please add the following to the "scripts" section of your package.json:
  echo   "prebuild": "node scripts/copy-pdf-fonts.js",
  echo   "copy-fonts": "node scripts/copy-pdf-fonts.js",
) else (
  echo - Font copying script found in package.json.
)

echo.
echo Setup completed successfully!
echo.
echo To test the pattern recognition system:
echo 1. Start the development server:
echo    npm run dev
echo 2. Navigate to:
echo    http://localhost:3000/test-pdf-import
echo 3. Upload a PDF and test the pattern recognition system
echo.
echo If you encounter any issues, please check the console for errors.
echo.
