// Delilah V3.0 Pattern Recognition - Pattern Validation Script
// This script validates the generated pattern matchers against test documents

const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');

// Import the newly generated PatternMatcher
const PatternMatcher = require('../src/utils/pdf-import/PatternMatcher');

// Configure PDF.js worker
const WORKER_SRC = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');
if (typeof window === 'undefined') {
  // In Node.js environment
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
}

// Paths
const DATASET_PATH = path.join(__dirname, '../pattern_repository/expanded_dataset');
const VALIDATION_PATH = path.join(__dirname, '../pattern_repository/validation_results');

// Ensure validation directory exists
if (!fs.existsSync(VALIDATION_PATH)) {
  fs.mkdirSync(VALIDATION_PATH, { recursive: true });
}

// The sections we expect to find in a typical assessment document
const EXPECTED_SECTIONS = [
  'DEMOGRAPHICS',
  'MEDICAL_HISTORY',
  'PURPOSE',
  'SYMPTOMS',
  'FUNCTIONAL_STATUS',
  'TYPICAL_DAY',
  'ENVIRONMENTAL',
  'ADLS',
  'ATTENDANT_CARE'
];

// Track validation results
const validationResults = {
  totalDocuments: 0,
  passedDocuments: 0,
  failedDocuments: 0,
  sectionDetection: {
    total: 0,
    found: 0,
    notFound: 0
  },
  sections: {}
};

// Initialize section stats
EXPECTED_SECTIONS.forEach(section => {
  validationResults.sections[section] = {
    expected: 0,
    found: 0,
    missed: 0,
    avgConfidence: 0,
    confidenceScores: []
  };
});

/**
 * Extract text from a PDF file
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<string>} - The extracted text
 */
async function extractTextFromPDF(pdfPath) {
  try {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error(`Error extracting text from ${pdfPath}:`, error);
    throw error;
  }
}

/**
 * Validate pattern matcher against a PDF
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Object} - Validation results for this document
 */
async function validateDocument(pdfPath) {
  try {
    const text = await extractTextFromPDF(pdfPath);
    
    // Create a new pattern matcher instance
    const matcher = new PatternMatcher();
    
    // Detect sections
    const detectedSections = matcher.detectSections(text);
    
    // Track results
    const result = {
      documentName: path.basename(pdfPath),
      expectedSections: EXPECTED_SECTIONS.length,
      foundSections: 0,
      missedSections: 0,
      unexpectedSections: 0,
      sections: {}
    };
    
    // Map detected sections by type
    const detectedSectionMap = {};
    detectedSections.forEach(section => {
      detectedSectionMap[section.section] = section;
    });
    
    // Check for expected sections
    EXPECTED_SECTIONS.forEach(sectionType => {
      const detected = detectedSectionMap[sectionType];
      
      result.sections[sectionType] = {
        expected: true,
        found: !!detected,
        confidence: detected ? detected.confidence : 0
      };
      
      if (detected) {
        result.foundSections++;
        
        // Track overall statistics
        validationResults.sections[sectionType].found++;
        validationResults.sections[sectionType].confidenceScores.push(detected.confidence);
      } else {
        result.missedSections++;
        
        // Track overall statistics
        validationResults.sections[sectionType].missed++;
      }
      
      // Track overall expected
      validationResults.sections[sectionType].expected++;
    });
    
    // Check for unexpected sections
    Object.keys(detectedSectionMap).forEach(sectionType => {
      if (!EXPECTED_SECTIONS.includes(sectionType)) {
        result.unexpectedSections++;
        
        result.sections[sectionType] = {
          expected: false,
          found: true,
          confidence: detectedSectionMap[sectionType].confidence
        };
      }
    });
    
    // Determine if validation passed
    // We consider it passed if at least 60% of expected sections are found
    const passThreshold = 0.6;
    const detectionRate = result.foundSections / result.expectedSections;
    result.passed = detectionRate >= passThreshold;
    
    return result;
  } catch (error) {
    console.error(`Error validating ${pdfPath}:`, error);
    return {
      documentName: path.basename(pdfPath),
      error: error.message,
      passed: false
    };
  }
}

/**
 * Run validation on all PDFs in the dataset
 */
async function validatePatterns() {
  console.log('Starting pattern validation...');
  
  // Get all PDF files in the dataset directory
  const files = fs.readdirSync(DATASET_PATH)
    .filter(file => file.toLowerCase().endsWith('.pdf'))
    .map(file => path.join(DATASET_PATH, file));
  
  validationResults.totalDocuments = files.length;
  console.log(`Found ${files.length} PDF files to validate.`);
  
  // Use a subset for validation if there are too many files
  const maxValidationFiles = 10;
  const filesToValidate = files.length > maxValidationFiles 
    ? files.slice(0, maxValidationFiles) 
    : files;
  
  if (filesToValidate.length < files.length) {
    console.log(`Using a subset of ${filesToValidate.length} files for validation.`);
  }
  
  // Process each file
  const documentResults = [];
  
  for (let i = 0; i < filesToValidate.length; i++) {
    const file = filesToValidate[i];
    const filename = path.basename(file);
    
    console.log(`Validating file ${i + 1} of ${filesToValidate.length}: ${filename}`);
    
    const result = await validateDocument(file);
    documentResults.push(result);
    
    if (result.passed) {
      validationResults.passedDocuments++;
    } else {
      validationResults.failedDocuments++;
    }
    
    // Calculate progress
    const progress = Math.round(((i + 1) / filesToValidate.length) * 100);
    console.log(`Progress: ${progress}% complete`);
  }
  
  // Calculate section detection rates and average confidence
  Object.keys(validationResults.sections).forEach(section => {
    const sectionData = validationResults.sections[section];
    
    // Detection rate
    sectionData.detectionRate = sectionData.expected > 0 
      ? sectionData.found / sectionData.expected 
      : 0;
    
    // Average confidence
    sectionData.avgConfidence = sectionData.confidenceScores.length > 0
      ? sectionData.confidenceScores.reduce((sum, score) => sum + score, 0) / sectionData.confidenceScores.length
      : 0;
    
    // Overall section detection stats
    validationResults.sectionDetection.total += sectionData.expected;
    validationResults.sectionDetection.found += sectionData.found;
    validationResults.sectionDetection.notFound += sectionData.missed;
  });
  
  // Calculate overall detection rate
  validationResults.sectionDetection.detectionRate = validationResults.sectionDetection.total > 0
    ? validationResults.sectionDetection.found / validationResults.sectionDetection.total
    : 0;
  
  // Save detailed results for each document
  fs.writeFileSync(
    path.join(VALIDATION_PATH, 'document_validation_results.json'),
    JSON.stringify(documentResults, null, 2)
  );
  
  // Save summary results
  fs.writeFileSync(
    path.join(VALIDATION_PATH, 'validation_summary.json'),
    JSON.stringify(validationResults, null, 2)
  );
  
  // Display summary
  console.log('\nValidation summary:');
  console.log(`Documents: ${validationResults.passedDocuments} passed, ${validationResults.failedDocuments} failed (${filesToValidate.length} total)`);
  console.log(`Overall section detection rate: ${Math.round(validationResults.sectionDetection.detectionRate * 100)}%`);
  
  console.log('\nSection detection results:');
  Object.entries(validationResults.sections)
    .sort((a, b) => a[0].localeCompare(b[0])) // Sort alphabetically
    .forEach(([section, data]) => {
      console.log(`${section}: ${Math.round(data.detectionRate * 100)}% detection, ${Math.round(data.avgConfidence * 100)}% avg confidence`);
    });
  
  // Return success/failure
  const successThreshold = 0.7; // 70% of documents should pass
  const success = validationResults.passedDocuments / filesToValidate.length >= successThreshold;
  
  console.log(`\nOverall validation ${success ? 'PASSED' : 'FAILED'}`);
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run validation
validatePatterns().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
});
