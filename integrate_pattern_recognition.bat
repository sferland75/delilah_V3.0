@echo off
echo Delilah V3.0 - Integrating Pattern Recognition System

:: Create directories if they don't exist
if not exist src\utils\pdf-import (
  echo Creating PDF import directory...
  mkdir src\utils\pdf-import
)

:: Copy the pattern matcher files
echo Copying pattern recognition files to Delilah V3.0...
xcopy /S /Y d:\delilah\pattern_recognition\matchers\*.js src\utils\pdf-import\

:: Create integration file
echo Creating integration file...
echo // Delilah V3.0 - Pattern Recognition Integration> src\utils\pdf-import\index.js
echo // Auto-generated on %DATE% %TIME%>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo import PatternMatcher from './PatternMatcher';>> src\utils\pdf-import\index.js
echo import { DEMOGRAPHICSExtractor, MEDICAL_HISTORYExtractor, ENVIRONMENTALExtractor, ADLSExtractor, PURPOSEExtractor } from './extractors';>> src\utils\pdf-import\index.js
echo.>> src\utils\pdf-import\index.js
echo /**>> src\utils\pdf-import\index.js
echo  * Process PDF text into structured data for Delilah V3.0>> src\utils\pdf-import\index.js
echo  * @param {string} pdfText - Text extracted from a PDF>> src\utils\pdf-import\index.js
echo  * @returns {Object} Structured data and confidence scores>> src\utils\pdf-import\index.js
echo  */>> src\utils\pdf-import\index.js
echo export const processPdfText = (pdfText) => {>> src\utils\pdf-import\index.js
echo   try {>> src\utils\pdf-import\index.js
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
echo       'PURPOSE': PURPOSEExtractor>> src\utils\pdf-import\index.js
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
echo export default {>> src\utils\pdf-import\index.js
echo   processPdfText>> src\utils\pdf-import\index.js
echo };>> src\utils\pdf-import\index.js

echo Integration complete!
echo.
echo Next steps:
echo 1. Run 'npm install' to ensure dependencies are installed
echo 2. Update your PDF import components to use the new pattern recognition system
echo 3. Add appropriate UI feedback for low-confidence sections
echo.
echo Example usage in your React components:
echo.
echo   import { processPdfText } from '../utils/pdf-import';
echo.
echo   // Inside your component function
echo   const handlePdfUpload = async (file) => {
echo     const text = await extractTextFromPdf(file);
echo     const result = processPdfText(text);
echo.
echo     // Use the extracted data
echo     setDemographics(result.data.demographics);
echo     setMedicalHistory(result.data.medical_history);
echo.
echo     // Show confidence indicators
echo     setConfidenceScores(result.sectionConfidence);
echo   };
