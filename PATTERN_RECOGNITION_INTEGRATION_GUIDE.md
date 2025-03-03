# Pattern Recognition Integration Guide

This guide provides instructions for integrating the improved pattern recognition system into the Delilah V3.0 application.

## Setup Instructions

### 1. Apply the Pattern Recognition Fixes

Run the following batch file to apply all the fixes and improvements:

```bash
apply_pattern_recognition_fixes.bat
```

This script will:
- Copy all pattern matcher files to your application
- Create the integration files
- Set up the font configuration utilities

### 2. Update Package.json

Add the following scripts to your package.json file:

```json
"scripts": {
  "prebuild": "node scripts/copy-pdf-fonts.js",
  "copy-fonts": "node scripts/copy-pdf-fonts.js",
  // ... other existing scripts
}
```

This ensures that the PDF.js standard fonts are copied to your public folder during the build process.

### 3. Update _app.js

Add the PDF.js font configuration to your _app.js file:

```javascript
import { useEffect } from 'react';
import configureStandardFonts from '../utils/pdf-import/configurePdfJs';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Configure PDF.js standard fonts
    configureStandardFonts();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

### 4. Install Dependencies

Make sure you have the required dependencies:

```bash
npm install pdfjs-dist@2.16.105 --save
```

## Using the Pattern Recognition System

### Basic Usage

Import the pattern recognition functions where needed:

```javascript
import { processPdfText, mapToApplicationModel } from '../utils/pdf-import';
```

Process PDF text:

```javascript
const handlePdfText = (pdfText) => {
  // Process PDF text to extract sections and data
  const processedData = processPdfText(pdfText);
  
  // Map to application data model
  const appData = mapToApplicationModel(processedData);
  
  // Use the extracted data
  setAssessmentData(appData);
};
```

### Extracting PDF Text

Use PDF.js to extract text from uploaded PDFs:

```javascript
import * as pdfjsLib from 'pdfjs-dist';

async function extractTextFromPdf(file) {
  // Read the file
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  
  // Create PDF document
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  
  // Extract text from all pages
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
  }
  
  return fullText;
}
```

### Complete PDF Import Flow

Put it all together in a component:

```javascript
import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { processPdfText, mapToApplicationModel } from '../utils/pdf-import';

function PdfImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [assessmentData, setAssessmentData] = useState(null);
  const [confidenceScores, setConfidenceScores] = useState({});

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      // Extract text from PDF
      const text = await extractTextFromPdf(file);
      
      // Process the text
      const processedData = processPdfText(text);
      
      // Map to application model
      const appData = mapToApplicationModel(processedData);
      
      // Update state
      setAssessmentData(appData);
      setConfidenceScores(processedData.sectionConfidence);
    } catch (error) {
      console.error('Error processing PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  async function extractTextFromPdf(file) {
    // PDF text extraction code (as shown above)
  }

  return (
    <div>
      <h1>Import Assessment PDF</h1>
      
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileUpload} 
        disabled={isProcessing} 
      />
      
      {isProcessing && <p>Processing PDF...</p>}
      
      {assessmentData && (
        <div>
          <h2>Extracted Data</h2>
          
          {/* Display confidence indicators */}
          <div className="confidence-indicators">
            {Object.entries(confidenceScores).map(([section, score]) => (
              <div key={section} className="confidence-indicator">
                <span>{section}</span>
                <div 
                  className={`confidence-bar ${getConfidenceClass(score)}`}
                  style={{ width: `${score * 100}%` }}
                />
              </div>
            ))}
          </div>
          
          {/* Display extracted data */}
          <div className="extracted-data">
            {/* Demographics */}
            <section>
              <h3>Demographics</h3>
              <p>Name: {assessmentData.demographics.name}</p>
              {/* Other demographic fields */}
            </section>
            
            {/* Medical History */}
            <section>
              <h3>Medical History</h3>
              <ul>
                {assessmentData.medicalHistory.conditions.map((condition, i) => (
                  <li key={i}>{condition}</li>
                ))}
              </ul>
            </section>
            
            {/* Other sections */}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to get confidence class
function getConfidenceClass(score) {
  if (score >= 0.8) return 'high-confidence';
  if (score >= 0.5) return 'medium-confidence';
  return 'low-confidence';
}

export default PdfImport;
```

## Understanding Confidence Scores

The pattern recognition system provides confidence scores for:

1. **Section Detection**: How confident the system is about identifying each section
2. **Data Extraction**: How confident the system is about extracted data points

Use these scores to:

- Highlight sections that may need manual review
- Provide visual indicators for uncertain data
- Guide the user to areas that need attention

Example CSS for confidence indicators:

```css
.confidence-bar {
  height: 8px;
  border-radius: 4px;
}

.high-confidence {
  background-color: #4caf50; /* Green */
}

.medium-confidence {
  background-color: #ff9800; /* Orange */
}

.low-confidence {
  background-color: #f44336; /* Red */
}
```

## Available Extractors

The system includes extractors for all major sections:

| Section | Extractor | Data Extracted |
|---------|-----------|----------------|
| DEMOGRAPHICS | DEMOGRAPHICSExtractor | Name, DOB, age, gender, address, phone, etc. |
| MEDICAL_HISTORY | MEDICAL_HISTORYExtractor | Diagnoses, conditions, medications, surgeries, etc. |
| PURPOSE | PURPOSEExtractor | Assessment purpose, referral info, methodologies, etc. |
| SYMPTOMS | SYMPTOMSExtractor | Reported symptoms, pain locations, aggravating factors, etc. |
| FUNCTIONAL_STATUS | FUNCTIONAL_STATUSExtractor | Mobility status, transfer ability, balance, limitations, etc. |
| TYPICAL_DAY | TYPICAL_DAYExtractor | Daily routines, activities, leisure activities, etc. |
| ENVIRONMENTAL | ENVIRONMENTALExtractor | Home type, barriers, recommendations, safety, etc. |
| ADLS | ADLSExtractor | Self-care abilities, mobility capabilities, instrumental ADLs, etc. |
| ATTENDANT_CARE | ATTENDANT_CAREExtractor | Caregiver info, care needs, hours, recommendations, etc. |

## Advanced Usage

### Customizing Extractors

You can customize extractors to match your specific document structure:

1. Copy the extractor file from `src/utils/pdf-import/` to a custom location
2. Modify the extraction rules as needed
3. Import your custom extractor instead of the default one

```javascript
import CustomDemographicsExtractor from './CustomDemographicsExtractor';

// Override the default extractor
const extractors = {
  'DEMOGRAPHICS': CustomDemographicsExtractor,
  // other extractors...
};
```

### Adding User Verification

For a better user experience, add verification steps for low-confidence sections:

```javascript
function VerifiableSection({ sectionName, data, confidence, onUpdate }) {
  const needsVerification = confidence < 0.7;
  
  return (
    <div className={`section ${needsVerification ? 'needs-verification' : ''}`}>
      <h3>
        {sectionName}
        {needsVerification && (
          <span className="verification-badge">Needs Review</span>
        )}
      </h3>
      
      <div className="section-content">
        {/* Display section data */}
      </div>
      
      {needsVerification && (
        <button onClick={() => toggleEditMode()}>
          Review & Edit
        </button>
      )}
    </div>
  );
}
```

### Training the System

The pattern recognition system can be improved over time by analyzing more documents:

1. Collect a diverse set of IHA documents
2. Run the analysis scripts on these documents
3. Update the pattern matchers based on the results

```bash
# From the pattern_recognition directory
node analyze_pdfs.js
node analyze_docx.js
node generate_matchers.js
```

## Troubleshooting

### PDF.js Font Warnings

If you still see font warnings:

1. Make sure the font copy script ran successfully
2. Check that the fonts are in the public folder
3. Verify that configurePdfJs is called on application startup

### Extraction Quality Issues

If extraction quality is poor:

1. Check the confidence scores to identify problematic sections
2. Review the document format against the patterns
3. Add more training documents if the format is significantly different
4. Adjust the extractors to handle the specific variations

### Performance Concerns

If processing is slow:

1. Consider implementing a worker thread for PDF processing
2. Add a loading indicator for better user experience
3. Process PDFs in smaller chunks if they are very large

## Conclusion

This pattern recognition system provides a robust solution for extracting structured data from In-Home Assessment documents. By leveraging confidence scores and specialized extractors, it offers a significant improvement in accuracy and user experience over simple keyword matching approaches.

For additional support or to report issues, please refer to the documentation or contact the development team.
