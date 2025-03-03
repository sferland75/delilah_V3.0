@echo off
echo Delilah V3.0 - Applying Pattern Recognition Fixes
echo ================================================

echo This script will:
echo 1. Copy fixed matcher files to your Delilah V3.0 application
echo 2. Update pattern recognition integration
echo.

set /p CONTINUE=Do you want to continue? (Y/N): 

if /i "%CONTINUE%" neq "Y" (
  echo Operation cancelled.
  exit /b 0
)

echo.
echo Creating required directories...
if not exist src\utils\pdf-import (
  echo Creating src\utils\pdf-import directory...
  mkdir src\utils\pdf-import
)

echo.
echo Copying pattern matcher files...
xcopy /S /Y d:\delilah\pattern_recognition\matchers\*.js src\utils\pdf-import\

echo.
echo Creating integration file...
echo // Delilah V3.0 - Pattern Recognition Integration> src\utils\pdf-import\index.js
echo // Auto-generated on %DATE% %TIME%>> src\utils\pdf-import\index.js
echo // FIXED VERSION - Includes all extractors and font handling fixes>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo import PatternMatcher from './PatternMatcher';>> src\utils\pdf-import\index.js
echo import {>> src\utils\pdf-import\index.js
echo   DEMOGRAPHICSExtractor,>> src\utils\pdf-import\index.js
echo   MEDICAL_HISTORYExtractor,>> src\utils\pdf-import\index.js
echo   ENVIRONMENTALExtractor,>> src\utils\pdf-import\index.js
echo   ADLSExtractor,>> src\utils\pdf-import\index.js
echo   PURPOSEExtractor,>> src\utils\pdf-import\index.js
echo   SYMPTOMSExtractor,>> src\utils\pdf-import\index.js
echo   FUNCTIONAL_STATUSExtractor,>> src\utils\pdf-import\index.js
echo   TYPICAL_DAYExtractor,>> src\utils\pdf-import\index.js
echo   ATTENDANT_CAREExtractor>> src\utils\pdf-import\index.js
echo } from './extractors';>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo // Fix for the PDF.js standard font data issue>> src\utils\pdf-import\index.js
echo const configurePdfJs = () => {>> src\utils\pdf-import\index.js
echo   if (typeof window !== 'undefined' && window.pdfjsLib) {>> src\utils\pdf-import\index.js
echo     // Set the worker source>> src\utils\pdf-import\index.js
echo     window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';>> src\utils\pdf-import\index.js
echo     // Configure font paths if available>> src\utils\pdf-import\index.js
echo     if (window.STANDARD_FONTS_PATH) {>> src\utils\pdf-import\index.js
echo       window.pdfjsLib.GlobalWorkerOptions.StandardFontDataUrl = window.STANDARD_FONTS_PATH;>> src\utils\pdf-import\index.js
echo     }>> src\utils\pdf-import\index.js
echo   }>> src\utils\pdf-import\index.js
echo };>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo /**>> src\utils\pdf-import\index.js
echo  * Process PDF text into structured data for Delilah V3.0>> src\utils\pdf-import\index.js
echo  * @param {string} pdfText - Text extracted from a PDF>> src\utils\pdf-import\index.js
echo  * @returns {Object} Structured data and confidence scores>> src\utils\pdf-import\index.js
echo  */>> src\utils\pdf-import\index.js
echo export const processPdfText = (pdfText) => {>> src\utils\pdf-import\index.js
echo   try {>> src\utils\pdf-import\index.js
echo     // Initialize PDF.js configuration>> src\utils\pdf-import\index.js
echo     configurePdfJs();>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo     // Create pattern matcher>> src\utils\pdf-import\index.js
echo     const matcher = new PatternMatcher();>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo     // Detect sections in the PDF>> src\utils\pdf-import\index.js
echo     const sections = matcher.detectSections(pdfText);>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo     // Extract data from each section>> src\utils\pdf-import\index.js
echo     const result = {>> src\utils\pdf-import\index.js
echo       sectionConfidence: {},>> src\utils\pdf-import\index.js
echo       data: {}>> src\utils\pdf-import\index.js
echo     };>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo     // Map sections to extractors>> src\utils\pdf-import\index.js
echo     const extractors = {>> src\utils\pdf-import\index.js
echo       'DEMOGRAPHICS': DEMOGRAPHICSExtractor,>> src\utils\pdf-import\index.js
echo       'MEDICAL_HISTORY': MEDICAL_HISTORYExtractor,>> src\utils\pdf-import\index.js
echo       'ENVIRONMENTAL': ENVIRONMENTALExtractor,>> src\utils\pdf-import\index.js
echo       'ADLS': ADLSExtractor,>> src\utils\pdf-import\index.js
echo       'PURPOSE': PURPOSEExtractor,>> src\utils\pdf-import\index.js
echo       'SYMPTOMS': SYMPTOMSExtractor,>> src\utils\pdf-import\index.js
echo       'FUNCTIONAL_STATUS': FUNCTIONAL_STATUSExtractor,>> src\utils\pdf-import\index.js
echo       'TYPICAL_DAY': TYPICAL_DAYExtractor,>> src\utils\pdf-import\index.js
echo       'ATTENDANT_CARE': ATTENDANT_CAREExtractor>> src\utils\pdf-import\index.js
echo     };>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo     // Process each section>> src\utils\pdf-import\index.js
echo     sections.forEach(section => {>> src\utils\pdf-import\index.js
echo       const sectionName = section.section;>> src\utils\pdf-import\index.js
echo       result.sectionConfidence[sectionName] = section.confidence;>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo       // Check if we have an extractor for this section>> src\utils\pdf-import\index.js
echo       if (extractors[sectionName]) {>> src\utils\pdf-import\index.js
echo         const extractor = extractors[sectionName];>> src\utils\pdf-import\index.js
echo         try {>> src\utils\pdf-import\index.js
echo           const extractedData = extractor.extract(section.content);>> src\utils\pdf-import\index.js
echo           result.data[sectionName.toLowerCase()] = extractedData;>> src\utils\pdf-import\index.js
echo         } catch (error) {>> src\utils\pdf-import\index.js
echo           console.error(`Error extracting data from ${sectionName} section:`, error);>> src\utils\pdf-import\index.js
echo           result.data[sectionName.toLowerCase()] = { error: error.message };>> src\utils\pdf-import\index.js
echo         }>> src\utils\pdf-import\index.js
echo       } else {>> src\utils\pdf-import\index.js
echo         // Store raw content>> src\utils\pdf-import\index.js
echo         result.data[sectionName.toLowerCase()] = { >> src\utils\pdf-import\index.js
echo           raw: section.content,>> src\utils\pdf-import\index.js
echo           notes: `No extractor implemented for ${sectionName}`>> src\utils\pdf-import\index.js
echo         };>> src\utils\pdf-import\index.js
echo       }>> src\utils\pdf-import\index.js
echo     });>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo     return result;>> src\utils\pdf-import\index.js
echo   } catch (error) {>> src\utils\pdf-import\index.js
echo     console.error('Error processing PDF:', error);>> src\utils\pdf-import\index.js
echo     throw error;>> src\utils\pdf-import\index.js
echo   }>> src\utils\pdf-import\index.js
echo };>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo /**>> src\utils\pdf-import\index.js
echo  * Map raw section data to Delilah application model>> src\utils\pdf-import\index.js
echo  * @param {Object} extractedData - Data from processPdfText>> src\utils\pdf-import\index.js
echo  * @returns {Object} Application-ready data model>> src\utils\pdf-import\index.js
echo  */>> src\utils\pdf-import\index.js
echo export const mapToApplicationModel = (extractedData) => {>> src\utils\pdf-import\index.js
echo   const model = {>> src\utils\pdf-import\index.js
echo     demographics: extractedData.data.demographics || {},>> src\utils\pdf-import\index.js
echo     medicalHistory: extractedData.data.medical_history || { conditions: [], treatments: [] },>> src\utils\pdf-import\index.js
echo     purpose: extractedData.data.purpose || { assessmentPurpose: '', methodologyNotes: '' },>> src\utils\pdf-import\index.js
echo     symptoms: extractedData.data.symptoms || { reportedSymptoms: [], symptomNotes: '' },>> src\utils\pdf-import\index.js
echo     functionalStatus: extractedData.data.functional_status || { mobilityStatus: '', functionalLimitations: [], notes: '' },>> src\utils\pdf-import\index.js
echo     typicalDay: extractedData.data.typical_day || { description: '', routine: [] },>> src\utils\pdf-import\index.js
echo     environmental: extractedData.data.environmental || { homeLayout: '', barriers: [], modifications: [] },>> src\utils\pdf-import\index.js
echo     adls: extractedData.data.adls || { selfCareAbilities: {}, notes: '' },>> src\utils\pdf-import\index.js
echo     attendantCare: extractedData.data.attendant_care || { careNeeds: {}, recommendations: [] },>> src\utils\pdf-import\index.js
echo     confidence: extractedData.sectionConfidence || {}>> src\utils\pdf-import\index.js
echo   };>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo   return model;>> src\utils\pdf-import\index.js
echo };>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo export default {>> src\utils\pdf-import\index.js
echo   processPdfText,>> src\utils\pdf-import\index.js
echo   mapToApplicationModel,>> src\utils\pdf-import\index.js
echo   configurePdfJs>> src\utils\pdf-import\index.js
echo };>> src\utils\pdf-import\index.js

echo.
echo Creating PDF.js script to fix font issues...
echo // PDF.js Standard Font Data Configuration> src\utils\pdf-import\configurePdfJs.js
echo // Auto-generated on %DATE% %TIME%>> src\utils\pdf-import\configurePdfJs.js
echo.>> src\utils\pdf-import\configurePdfJs.js
echo /**>> src\utils\pdf-import\configurePdfJs.js
echo  * Configure PDF.js to handle standard fonts correctly>> src\utils\pdf-import\configurePdfJs.js
echo  * To be used in the _app.js or similar startup file>> src\utils\pdf-import\configurePdfJs.js
echo  */>> src\utils\pdf-import\configurePdfJs.js
echo export default function configureStandardFonts() {>> src\utils\pdf-import\configurePdfJs.js
echo   if (typeof window !== 'undefined') {>> src\utils\pdf-import\configurePdfJs.js
echo     // Standard fonts path for our application>> src\utils\pdf-import\configurePdfJs.js
echo     window.STANDARD_FONTS_PATH = '/standard_fonts/';>> src\utils\pdf-import\configurePdfJs.js
echo.>> src\utils\pdf-import\configurePdfJs.js
echo     // Copy standard fonts to public folder at build time>> src\utils\pdf-import\configurePdfJs.js
echo     // This is done by the build script>> src\utils\pdf-import\configurePdfJs.js
echo     // node_modules/pdfjs-dist/standard_fonts/ -^> public/standard_fonts/>> src\utils\pdf-import\configurePdfJs.js
echo   }>> src\utils\pdf-import\configurePdfJs.js
echo }>> src\utils\pdf-import\configurePdfJs.js

echo.
echo Creating copy-fonts script...
echo // Copy PDF.js standard fonts to public folder> scripts\copy-pdf-fonts.js
echo const fs = require('fs');>> scripts\copy-pdf-fonts.js
echo const path = require('path');>> scripts\copy-pdf-fonts.js
echo.>> scripts\copy-pdf-fonts.js
echo function copyDir(src, dest) {>> scripts\copy-pdf-fonts.js
echo   // Ensure destination directory exists>> scripts\copy-pdf-fonts.js
echo   if (!fs.existsSync(dest)) {>> scripts\copy-pdf-fonts.js
echo     fs.mkdirSync(dest, { recursive: true });>> scripts\copy-pdf-fonts.js
echo   }>> scripts\copy-pdf-fonts.js
echo.>> scripts\copy-pdf-fonts.js
echo   // Get all files in source directory>> scripts\copy-pdf-fonts.js
echo   const files = fs.readdirSync(src);>> scripts\copy-pdf-fonts.js
echo.>> scripts\copy-pdf-fonts.js
echo   // Copy each file to destination>> scripts\copy-pdf-fonts.js
echo   for (const file of files) {>> scripts\copy-pdf-fonts.js
echo     const srcPath = path.join(src, file);>> scripts\copy-pdf-fonts.js
echo     const destPath = path.join(dest, file);>> scripts\copy-pdf-fonts.js
echo.>> scripts\copy-pdf-fonts.js
echo     // If directory, recursively copy>> scripts\copy-pdf-fonts.js
echo     if (fs.statSync(srcPath).isDirectory()) {>> scripts\copy-pdf-fonts.js
echo       copyDir(srcPath, destPath);>> scripts\copy-pdf-fonts.js
echo     } else {>> scripts\copy-pdf-fonts.js
echo       // Copy file>> scripts\copy-pdf-fonts.js
echo       fs.copyFileSync(srcPath, destPath);>> scripts\copy-pdf-fonts.js
echo     }>> scripts\copy-pdf-fonts.js
echo   }>> scripts\copy-pdf-fonts.js
echo }>> scripts\copy-pdf-fonts.js
echo.>> scripts\copy-pdf-fonts.js
echo // Source: node_modules/pdfjs-dist/standard_fonts/>> scripts\copy-pdf-fonts.js
echo const sourcePath = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'standard_fonts');>> scripts\copy-pdf-fonts.js
echo.>> scripts\copy-pdf-fonts.js
echo // Destination: public/standard_fonts/>> scripts\copy-pdf-fonts.js
echo const destPath = path.join(__dirname, '..', 'public', 'standard_fonts');>> scripts\copy-pdf-fonts.js
echo.>> scripts\copy-pdf-fonts.js
echo // Check if source exists>> scripts\copy-pdf-fonts.js
echo if (fs.existsSync(sourcePath)) {>> scripts\copy-pdf-fonts.js
echo   console.log('Copying PDF.js standard fonts to public folder...');>> scripts\copy-pdf-fonts.js
echo   copyDir(sourcePath, destPath);>> scripts\copy-pdf-fonts.js
echo   console.log('Done!');>> scripts\copy-pdf-fonts.js
echo } else {>> scripts\copy-pdf-fonts.js
echo   console.error('Error: PDF.js standard fonts not found at', sourcePath);>> scripts\copy-pdf-fonts.js
echo }>> scripts\copy-pdf-fonts.js

echo.
echo Creating font-copy build step...
if not exist scripts (
  echo Creating scripts directory...
  mkdir scripts
)

echo.
echo Updating package.json with font copy script...
echo // Please add this to your package.json scripts section:
echo // "prebuild": "node scripts/copy-pdf-fonts.js",
echo // "copy-fonts": "node scripts/copy-pdf-fonts.js"

echo.
echo Integration complete!
echo.
echo Next steps:
echo 1. Update your package.json to include the font copy scripts
echo 2. Add the configurePdfJs import to your _app.js
echo 3. Import the pattern recognition system where needed:
echo    import { processPdfText, mapToApplicationModel } from '../utils/pdf-import';
echo.
echo The pattern recognition system now supports ALL sections in your IHA documents:
echo - DEMOGRAPHICS
echo - MEDICAL_HISTORY
echo - PURPOSE
echo - SYMPTOMS
echo - FUNCTIONAL_STATUS
echo - TYPICAL_DAY
echo - ENVIRONMENTAL
echo - ADLS
echo - ATTENDANT_CARE
echo.
echo All extractors include confidence scores to help identify uncertain sections.
echo.

pause
