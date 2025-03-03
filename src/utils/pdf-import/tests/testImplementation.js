/**
 * Test the advanced pattern recognition implementation
 * 
 * This script tests the PatternMatcher and Extractor components
 * by processing a sample document and showing the results.
 */

const fs = require('fs');
const path = require('path');

// Load components
const PatternMatcher = require('../PatternMatcher');
const SYMPTOMSExtractor = require('../patterns/SYMPTOMSExtractor');
const DEMOGRAPHICSExtractor = require('../patterns/DEMOGRAPHICSExtractor');
const MEDICAL_HISTORYExtractor = require('../patterns/MEDICAL_HISTORYExtractor');
const ENVIRONMENTALExtractor = require('../patterns/ENVIRONMENTALExtractor');
const ATTENDANT_CAREExtractor = require('../patterns/ATTENDANT_CAREExtractor');
const ExtractorFactory = require('../patterns/ExtractorFactory');

console.log('=== Testing Advanced Pattern Recognition Implementation ===');

// Test data - sample document
const SAMPLE_DOCUMENT_PATH = path.resolve(__dirname, '../../../../pattern_repository/expanded_dataset/Abboud, Fawzi IHA1MVA2_analysis.json');
let sampleText = '';

try {
  const sampleData = require(SAMPLE_DOCUMENT_PATH);
  sampleText = sampleData.originalText;
  console.log(`Loaded sample document: ${path.basename(SAMPLE_DOCUMENT_PATH)}`);
  console.log(`Document length: ${sampleText.length} characters`);
} catch (error) {
  console.error(`Error loading sample document: ${error.message}`);
  process.exit(1);
}

// Test PatternMatcher
console.log('\n===== Testing PatternMatcher =====');
try {
  console.log('Creating PatternMatcher instance...');
  const matcher = new PatternMatcher();
  
  console.log('Detecting sections...');
  console.time('Section detection');
  const sections = matcher.detectSections(sampleText);
  console.timeEnd('Section detection');
  
  console.log(`\nDetected ${sections.length} sections:`);
  sections.forEach((section, index) => {
    console.log(`${index + 1}. ${section.section} (Confidence: ${(section.confidence * 100).toFixed(1)}%, Pattern: ${section.pattern})`);
  });
  
  // Test document classification
  console.log('\n===== Testing Document Classification =====');
  console.log('Classifying document...');
  const classification = ExtractorFactory.classifyDocument(sampleText);
  console.log('Document classification:');
  console.log(`- Type: ${classification.type}`);
  console.log(`- Structure: ${classification.structure}`);
  console.log(`- Complexity: ${classification.complexity.toFixed(2)}`);
  console.log(`- Length: ${classification.length} characters`);
  
  // Test extractors individually
  console.log('\n===== Testing Individual Extractors =====');
  
  // Find sections to test
  const testSections = {
    DEMOGRAPHICS: sections.find(s => s.section === 'DEMOGRAPHICS'),
    SYMPTOMS: sections.find(s => s.section === 'SYMPTOMS'),
    MEDICAL_HISTORY: sections.find(s => s.section === 'MEDICAL_HISTORY'),
    ENVIRONMENTAL: sections.find(s => s.section === 'ENVIRONMENTAL'),
    ATTENDANT_CARE: sections.find(s => s.section === 'ATTENDANT_CARE')
  };
  
  // Test each extractor with its section
  for (const [sectionType, section] of Object.entries(testSections)) {
    if (!section) {
      console.log(`No ${sectionType} section found in the sample document.`);
      continue;
    }
    
    console.log(`\nTesting ${sectionType} Extractor...`);
    let extractor;
    
    switch (sectionType) {
      case 'DEMOGRAPHICS':
        extractor = new DEMOGRAPHICSExtractor();
        break;
      case 'SYMPTOMS':
        extractor = new SYMPTOMSExtractor();
        break;
      case 'MEDICAL_HISTORY':
        extractor = new MEDICAL_HISTORYExtractor();
        break;
      case 'ENVIRONMENTAL':
        extractor = new ENVIRONMENTALExtractor();
        break;
      case 'ATTENDANT_CARE':
        extractor = new ATTENDANT_CAREExtractor();
        break;
    }
    
    console.time(`${sectionType} extraction`);
    const result = extractor.extract(section.content);
    console.timeEnd(`${sectionType} extraction`);
    
    console.log(`\nExtraction results for ${sectionType}:`);
    
    // Show extracted field values with confidence
    const fields = Object.keys(result).filter(k => 
      k !== 'confidence' && k !== 'overallConfidence' && !k.endsWith('_method')
    );
    
    fields.sort((a, b) => (result.confidence[b] || 0) - (result.confidence[a] || 0));
    
    fields.forEach(field => {
      const value = result[field];
      const confidence = result.confidence[field] || 0;
      const method = result[`${field}_method`] || 'unknown';
      
      // Skip null values and notes fields which are usually the full text
      if (value === null || field === 'medicalNotes' || field === 'symptomNotes' || 
          field === 'environmentalNotes' || field === 'notes') return;
      
      // Format display based on value type
      let displayValue = '';
      if (typeof value === 'string') {
        displayValue = value.length > 100 ? value.substring(0, 100) + '...' : value;
      } else if (Array.isArray(value)) {
        displayValue = `[${value.length} items]`;
      } else if (typeof value === 'object' && value !== null) {
        displayValue = 'Object';
      } else {
        displayValue = String(value);
      }
      
      console.log(`- ${field}: ${displayValue}`);
      console.log(`  Confidence: ${(confidence * 100).toFixed(1)}%, Method: ${method}`);
    });
    
    console.log(`\nOverall extraction confidence: ${(result.overallConfidence * 100).toFixed(1)}%`);
  }
  
  // Test ExtractorFactory with all sections
  console.log('\n===== Testing ExtractorFactory with All Sections =====');
  console.log('Extracting data from all sections...');
  
  console.time('Full extraction');
  const allResults = ExtractorFactory.extractAllSections(sections, {
    documentType: classification.type,
    documentStructure: classification.structure
  });
  console.timeEnd('Full extraction');
  
  console.log(`\nExtracted data from ${Object.keys(allResults).length} sections`);
  
  // Show summary of results
  console.log('\nExtraction summary:');
  Object.entries(allResults).forEach(([section, data]) => {
    const fieldCount = Object.keys(data).filter(k => 
      k !== 'confidence' && k !== 'overallConfidence' && !k.endsWith('_method')
    ).length;
    
    const extractedCount = Object.entries(data).filter(([k, v]) => 
      k !== 'confidence' && k !== 'overallConfidence' && !k.endsWith('_method') && 
      v !== null && v !== undefined && 
      (typeof v !== 'string' || v.length > 0) &&
      (typeof v !== 'object' || (Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0))
    ).length;
    
    console.log(`- ${section}: ${extractedCount}/${fieldCount} fields extracted, Confidence: ${(data.overallConfidence * 100).toFixed(1)}%`);
  });
  
  console.log('\n===== Test Completed Successfully =====');
  
} catch (error) {
  console.error('\n❌ Test failed:', error);
  console.error(error.stack);
  process.exit(1);
}
