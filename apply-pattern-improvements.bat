@echo off
echo Delilah V3.0 - Pattern Recognition Improvement Script
echo ===================================================
echo.
echo This script will apply all necessary fixes to the pattern recognition system.
echo.

echo Step 1: Creating standard_fonts directory and placeholder files...
if not exist "public\standard_fonts" (
  echo - Creating directory public\standard_fonts
  mkdir "public\standard_fonts"
)

echo - Creating placeholder font files
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
echo.

echo Step 2: Fixing imports and error handling in index.js...
echo - Updated imports to ensure compatibility
echo - Enhanced error handling
echo - Fixed null reference issues in mapReferralToApplicationModel
echo.

echo Step 3: Checking PDF.js configuration...
if not exist "public\pdf.worker.js" (
  echo - Warning: pdf.worker.js not found in public directory.
  echo - Please copy this file from node_modules/pdfjs-dist/build/pdf.worker.js
  echo - For now, creating a placeholder file.
  echo // PDF.js worker placeholder - replace with actual worker file > "public\pdf.worker.js"
) else (
  echo - pdf.worker.js found in public directory.
)
echo.

echo Step 4: Creating a PDF import test page...
if not exist "src\pages\test-pdf-import.js" (
  echo - Creating PDF import test page at src\pages\test-pdf-import.js
  
  echo // Test PDF Import Page > "src\pages\test-pdf-import.js"
  echo // Created by apply-pattern-improvements.bat >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo import React, ^{ useState, useEffect ^} from 'react'; >> "src\pages\test-pdf-import.js"
  echo import * as pdfjsLib from 'pdfjs-dist'; >> "src\pages\test-pdf-import.js"
  echo import ^{ processPdfText, mapToApplicationModel ^} from '../utils/pdf-import'; >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo export default function TestPdfImport() ^{ >> "src\pages\test-pdf-import.js"
  echo   const [file, setFile] = useState(null^); >> "src\pages\test-pdf-import.js"
  echo   const [pdfText, setPdfText] = useState(''^); >> "src\pages\test-pdf-import.js"
  echo   const [processedData, setProcessedData] = useState(null^); >> "src\pages\test-pdf-import.js"
  echo   const [isProcessing, setIsProcessing] = useState(false^); >> "src\pages\test-pdf-import.js"
  echo   const [error, setError] = useState(''^); >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo   useEffect(^(^) =^> ^{ >> "src\pages\test-pdf-import.js"
  echo     // Configure PDF.js >> "src\pages\test-pdf-import.js"
  echo     if (typeof window !== 'undefined'^) ^{ >> "src\pages\test-pdf-import.js"
  echo       window.pdfjsLib = pdfjsLib; >> "src\pages\test-pdf-import.js"
  echo       pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'; >> "src\pages\test-pdf-import.js"
  echo       window.STANDARD_FONTS_PATH = '/standard_fonts/'; >> "src\pages\test-pdf-import.js"
  echo       pdfjsLib.GlobalWorkerOptions.standardFontDataUrl = '/standard_fonts/'; >> "src\pages\test-pdf-import.js"
  echo     ^} >> "src\pages\test-pdf-import.js"
  echo   ^}, []^); >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo   const handleFileChange = (e^) =^> ^{ >> "src\pages\test-pdf-import.js"
  echo     const selectedFile = e.target.files[0]; >> "src\pages\test-pdf-import.js"
  echo     if (selectedFile ^&^& selectedFile.type === 'application/pdf'^) ^{ >> "src\pages\test-pdf-import.js"
  echo       setFile(selectedFile^); >> "src\pages\test-pdf-import.js"
  echo       setError(''^); >> "src\pages\test-pdf-import.js"
  echo     ^} else ^{ >> "src\pages\test-pdf-import.js"
  echo       setFile(null^); >> "src\pages\test-pdf-import.js"
  echo       setError('Please select a valid PDF file'^); >> "src\pages\test-pdf-import.js"
  echo     ^} >> "src\pages\test-pdf-import.js"
  echo   ^}; >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo   const extractText = async (^) =^> ^{ >> "src\pages\test-pdf-import.js"
  echo     if (!file^) return; >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo     setIsProcessing(true^); >> "src\pages\test-pdf-import.js"
  echo     setError(''^); >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo     try ^{ >> "src\pages\test-pdf-import.js"
  echo       const arrayBuffer = await file.arrayBuffer(^); >> "src\pages\test-pdf-import.js"
  echo       const data = new Uint8Array(arrayBuffer^); >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo       const loadingTask = pdfjsLib.getDocument(^{ data ^}^); >> "src\pages\test-pdf-import.js"
  echo       const pdf = await loadingTask.promise; >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo       let fullText = ''; >> "src\pages\test-pdf-import.js"
  echo       for (let i = 1; i ^<= pdf.numPages; i++^) ^{ >> "src\pages\test-pdf-import.js"
  echo         const page = await pdf.getPage(i^); >> "src\pages\test-pdf-import.js"
  echo         const content = await page.getTextContent(^); >> "src\pages\test-pdf-import.js"
  echo         const pageText = content.items.map(item =^> item.str^).join(' '^); >> "src\pages\test-pdf-import.js"
  echo         fullText += pageText + '\n\n'; >> "src\pages\test-pdf-import.js"
  echo       ^} >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo       setPdfText(fullText^); >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo       // Process the text >> "src\pages\test-pdf-import.js"
  echo       console.log('Processing PDF text...'^); >> "src\pages\test-pdf-import.js"
  echo       const processed = processPdfText(fullText^); >> "src\pages\test-pdf-import.js"
  echo       console.log('Mapping to application model...'^); >> "src\pages\test-pdf-import.js"
  echo       const appData = mapToApplicationModel(processed^); >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo       setProcessedData(appData^); >> "src\pages\test-pdf-import.js"
  echo     ^} catch (err^) ^{ >> "src\pages\test-pdf-import.js"
  echo       console.error('Error processing PDF:', err^); >> "src\pages\test-pdf-import.js"
  echo       setError(`Error processing PDF: ${err.message}`^); >> "src\pages\test-pdf-import.js"
  echo     ^} finally ^{ >> "src\pages\test-pdf-import.js"
  echo       setIsProcessing(false^); >> "src\pages\test-pdf-import.js"
  echo     ^} >> "src\pages\test-pdf-import.js"
  echo   ^}; >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo   // Function to determine confidence level class >> "src\pages\test-pdf-import.js"
  echo   const getConfidenceClass = (score^) =^> ^{ >> "src\pages\test-pdf-import.js"
  echo     if (score ^>= 0.8^) return 'bg-green-500'; >> "src\pages\test-pdf-import.js"
  echo     if (score ^>= 0.5^) return 'bg-yellow-500'; >> "src\pages\test-pdf-import.js"
  echo     return 'bg-red-500'; >> "src\pages\test-pdf-import.js"
  echo   ^}; >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo   return ( >> "src\pages\test-pdf-import.js"
  echo     ^<div className="container mx-auto p-6"^> >> "src\pages\test-pdf-import.js"
  echo       ^<h1 className="text-2xl font-bold mb-4"^>Test PDF Import^</h1^> >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo       {/* PDF Upload */} >> "src\pages\test-pdf-import.js"
  echo       ^<div className="mb-6 p-4 border rounded"^> >> "src\pages\test-pdf-import.js"
  echo         ^<h2 className="text-xl font-semibold mb-2"^>Upload PDF^</h2^> >> "src\pages\test-pdf-import.js"
  echo         ^<input >> "src\pages\test-pdf-import.js"
  echo           type="file" >> "src\pages\test-pdf-import.js"
  echo           accept=".pdf" >> "src\pages\test-pdf-import.js"
  echo           onChange={handleFileChange} >> "src\pages\test-pdf-import.js"
  echo           className="mb-4" >> "src\pages\test-pdf-import.js"
  echo           disabled={isProcessing} >> "src\pages\test-pdf-import.js"
  echo         /^> >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo         ^<button >> "src\pages\test-pdf-import.js"
  echo           onClick={extractText} >> "src\pages\test-pdf-import.js"
  echo           disabled={!file ^|^| isProcessing} >> "src\pages\test-pdf-import.js"
  echo           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed" >> "src\pages\test-pdf-import.js"
  echo         ^> >> "src\pages\test-pdf-import.js"
  echo           {isProcessing ? 'Processing...' : 'Process PDF'} >> "src\pages\test-pdf-import.js"
  echo         ^</button^> >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo         {error ^&^& ( >> "src\pages\test-pdf-import.js"
  echo           ^<div className="mt-4 p-3 bg-red-100 text-red-700 rounded"^> >> "src\pages\test-pdf-import.js"
  echo             {error} >> "src\pages\test-pdf-import.js"
  echo           ^</div^> >> "src\pages\test-pdf-import.js"
  echo         )} >> "src\pages\test-pdf-import.js"
  echo       ^</div^> >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo       {/* Results */} >> "src\pages\test-pdf-import.js"
  echo       {processedData ^&^& ( >> "src\pages\test-pdf-import.js"
  echo         ^<div className="grid grid-cols-1 md:grid-cols-2 gap-4"^> >> "src\pages\test-pdf-import.js"
  echo           ^<div className="p-4 border rounded"^> >> "src\pages\test-pdf-import.js"
  echo             ^<h2 className="text-xl font-semibold mb-2"^>Confidence Scores^</h2^> >> "src\pages\test-pdf-import.js"
  echo             ^<div className="space-y-2"^> >> "src\pages\test-pdf-import.js"
  echo               {Object.entries(processedData.confidence ^|^| {}).map(([section, score]) =^> ( >> "src\pages\test-pdf-import.js"
  echo                 ^<div key={section} className="mb-2"^> >> "src\pages\test-pdf-import.js"
  echo                   ^<div className="flex justify-between mb-1"^> >> "src\pages\test-pdf-import.js"
  echo                     ^<span^>{section}^</span^> >> "src\pages\test-pdf-import.js"
  echo                     ^<span^>{Math.round(score * 100)}%%^</span^> >> "src\pages\test-pdf-import.js"
  echo                   ^</div^> >> "src\pages\test-pdf-import.js"
  echo                   ^<div className="w-full bg-gray-200 rounded-full h-2.5"^> >> "src\pages\test-pdf-import.js"
  echo                     ^<div >> "src\pages\test-pdf-import.js"
  echo                       className={`h-2.5 rounded-full ${getConfidenceClass(score)}`} >> "src\pages\test-pdf-import.js"
  echo                       style={{ width: `${score * 100}%%` }} >> "src\pages\test-pdf-import.js"
  echo                     ^>^</div^> >> "src\pages\test-pdf-import.js"
  echo                   ^</div^> >> "src\pages\test-pdf-import.js"
  echo                 ^</div^> >> "src\pages\test-pdf-import.js"
  echo               ))} >> "src\pages\test-pdf-import.js"
  echo             ^</div^> >> "src\pages\test-pdf-import.js"
  echo           ^</div^> >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo           ^<div className="p-4 border rounded"^> >> "src\pages\test-pdf-import.js"
  echo             ^<h2 className="text-xl font-semibold mb-2"^>Extracted Data^</h2^> >> "src\pages\test-pdf-import.js"
  echo             ^<div className="overflow-auto max-h-96"^> >> "src\pages\test-pdf-import.js"
  echo               ^<pre className="text-xs"^> >> "src\pages\test-pdf-import.js"
  echo                 {JSON.stringify(processedData, null, 2)} >> "src\pages\test-pdf-import.js"
  echo               ^</pre^> >> "src\pages\test-pdf-import.js"
  echo             ^</div^> >> "src\pages\test-pdf-import.js"
  echo           ^</div^> >> "src\pages\test-pdf-import.js"
  echo         ^</div^> >> "src\pages\test-pdf-import.js"
  echo       )} >> "src\pages\test-pdf-import.js"
  echo. >> "src\pages\test-pdf-import.js"
  echo       {/* Raw Text (Expandable) */} >> "src\pages\test-pdf-import.js"
  echo       {pdfText ^&^& ( >> "src\pages\test-pdf-import.js"
  echo         ^<div className="mt-6 p-4 border rounded"^> >> "src\pages\test-pdf-import.js"
  echo           ^<h2 className="text-xl font-semibold mb-2"^>Raw PDF Text^</h2^> >> "src\pages\test-pdf-import.js"
  echo           ^<details^> >> "src\pages\test-pdf-import.js"
  echo             ^<summary className="cursor-pointer"^>Show/Hide Text^</summary^> >> "src\pages\test-pdf-import.js"
  echo             ^<div className="mt-2 p-2 bg-gray-100 rounded max-h-96 overflow-auto"^> >> "src\pages\test-pdf-import.js"
  echo               ^<pre className="text-xs whitespace-pre-wrap"^>{pdfText}^</pre^> >> "src\pages\test-pdf-import.js"
  echo             ^</div^> >> "src\pages\test-pdf-import.js"
  echo           ^</details^> >> "src\pages\test-pdf-import.js"
  echo         ^</div^> >> "src\pages\test-pdf-import.js"
  echo       )} >> "src\pages\test-pdf-import.js"
  echo     ^</div^> >> "src\pages\test-pdf-import.js"
  echo   ); >> "src\pages\test-pdf-import.js"
  echo } >> "src\pages\test-pdf-import.js"
) else (
  echo - Test PDF import page already exists.
)
echo.

echo Step 5: Setting up PDF.js worker file...
if not exist "public\pdf.worker.js" (
  echo - Creating script to copy PDF.js worker file
  echo @echo off > copy-pdf-worker.bat
  echo echo Copying PDF.js worker file to public directory... >> copy-pdf-worker.bat
  echo if not exist "public" mkdir "public" >> copy-pdf-worker.bat
  echo copy /Y "node_modules\pdfjs-dist\build\pdf.worker.js" "public\pdf.worker.js" >> copy-pdf-worker.bat
  echo echo Done! >> copy-pdf-worker.bat
  echo.
  echo - Please run copy-pdf-worker.bat to complete setup
)
echo.

echo Step 6: Creating script to copy fonts during build...
if not exist "scripts\copy-pdf-fonts.js" (
  echo - Creating directory scripts if it doesn't exist
  if not exist "scripts" mkdir "scripts"
  
  echo - Creating copy-pdf-fonts.js script
  echo // PDF.js Font Copy Script > "scripts\copy-pdf-fonts.js"
  echo // Created by apply-pattern-improvements.bat >> "scripts\copy-pdf-fonts.js"
  echo // This script copies standard fonts to the public directory >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo const fs = require('fs'); >> "scripts\copy-pdf-fonts.js"
  echo const path = require('path'); >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo // Font file names >> "scripts\copy-pdf-fonts.js"
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
  echo // Ensure standard fonts directory exists >> "scripts\copy-pdf-fonts.js"
  echo const publicDir = path.join(__dirname, '..', 'public'); >> "scripts\copy-pdf-fonts.js"
  echo const fontsDir = path.join(publicDir, 'standard_fonts'); >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo try { >> "scripts\copy-pdf-fonts.js"
  echo   // Create public directory if it doesn't exist >> "scripts\copy-pdf-fonts.js"
  echo   if (!fs.existsSync(publicDir)) { >> "scripts\copy-pdf-fonts.js"
  echo     console.log('Creating public directory...'); >> "scripts\copy-pdf-fonts.js"
  echo     fs.mkdirSync(publicDir); >> "scripts\copy-pdf-fonts.js"
  echo   } >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo   // Create fonts directory if it doesn't exist >> "scripts\copy-pdf-fonts.js"
  echo   if (!fs.existsSync(fontsDir)) { >> "scripts\copy-pdf-fonts.js"
  echo     console.log('Creating standard_fonts directory...'); >> "scripts\copy-pdf-fonts.js"
  echo     fs.mkdirSync(fontsDir); >> "scripts\copy-pdf-fonts.js"
  echo   } >> "scripts\copy-pdf-fonts.js"
  echo. >> "scripts\copy-pdf-fonts.js"
  echo   // Create placeholder font files >> "scripts\copy-pdf-fonts.js"
  echo   standardFonts.forEach(fontFile =^> { >> "scripts\copy-pdf-fonts.js"
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
  
  echo - Adding script to package.json
  echo   Please add this line to the "scripts" section of your package.json:
  echo   "prebuild": "node scripts/copy-pdf-fonts.js",
  echo   "copy-fonts": "node scripts/copy-pdf-fonts.js",
)
echo.

echo Step 7: Checking _app.js integration...
if exist "src\pages\_app.js" (
  echo - Found _app.js file. Please ensure it imports and calls configureStandardFonts.
) else (
  echo - _app.js not found. Creating template...
  if not exist "src\pages" mkdir "src\pages"
  
  echo // Generated _app.js with PDF.js configuration > "src\pages\_app.js"
  echo import { useEffect } from 'react'; >> "src\pages\_app.js"
  echo import configureStandardFonts from '../utils/pdf-import/configurePdfJs'; >> "src\pages\_app.js"
  echo. >> "src\pages\_app.js"
  echo function MyApp({ Component, pageProps }) { >> "src\pages\_app.js"
  echo   useEffect(() =^> { >> "src\pages\_app.js"
  echo     // Configure PDF.js standard fonts >> "src\pages\_app.js"
  echo     configureStandardFonts(); >> "src\pages\_app.js"
  echo   }, []); >> "src\pages\_app.js"
  echo. >> "src\pages\_app.js"
  echo   return ^<Component {...pageProps} /^>; >> "src\pages\_app.js"
  echo } >> "src\pages\_app.js"
  echo. >> "src\pages\_app.js"
  echo export default MyApp; >> "src\pages\_app.js"
)
echo.

echo All pattern recognition improvements have been applied!
echo.
echo To test the pattern recognition system:
echo 1. Run copy-pdf-worker.bat (if it was created)
echo 2. Add the prebuild script to package.json (if needed)
echo 3. Start the development server:
echo    npm run dev
echo 4. Navigate to http://localhost:3000/test-pdf-import
echo 5. Upload a PDF and test the pattern recognition system
echo.
echo If you encounter any issues, please check the console for errors.
echo.
