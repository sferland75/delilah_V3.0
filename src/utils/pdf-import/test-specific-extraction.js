// Test OT_ASSESSMENT specific extractor
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

const fs = require('fs').promises;
const path = require('path');
const OT_ASSESSMENTExtractor = require('./patterns/OT_ASSESSMENTExtractor');

/**
 * Test the OT Assessment extractor on a sample document
 */
async function testOTAssessmentExtraction() {
  console.log('Starting OT Assessment extractor test...');
  
  try {
    // Read test document
    const testFilePath = process.argv[2] || path.join(__dirname, '..', '..', '..', 'test-documents', 'sample-ot-assessment.txt');
    console.log(`Reading test document from: ${testFilePath}`);
    
    const documentText = await fs.readFile(testFilePath, 'utf8');
    console.log(`Document loaded, length: ${documentText.length} characters`);
    
    // Process the document with the OT Assessment extractor
    console.log('Extracting data with OT_ASSESSMENTExtractor...');
    console.time('ExtractionTime');
    const result = OT_ASSESSMENTExtractor.extract(documentText);
    console.timeEnd('ExtractionTime');
    
    // Print summary of results
    console.log('\n----- EXTRACTION RESULTS SUMMARY -----');
    console.log(`Document Type: ${result._documentType}`);
    console.log(`Document Confidence: ${result._documentConfidence.toFixed(2)}`);
    
    // Print section summaries
    console.log('\nExtracted Sections:');
    
    // Demographics
    if (result.DEMOGRAPHICS) {
      console.log('\nDEMOGRAPHICS:');
      if (result.DEMOGRAPHICS.name) console.log(`  - Name: ${result.DEMOGRAPHICS.name}`);
      if (result.DEMOGRAPHICS.dateOfLoss) console.log(`  - Date of Loss: ${result.DEMOGRAPHICS.dateOfLoss}`);
      if (result.DEMOGRAPHICS.address) console.log(`  - Address: ${result.DEMOGRAPHICS.address}`);
      if (result.DEMOGRAPHICS.telephone) console.log(`  - Telephone: ${result.DEMOGRAPHICS.telephone}`);
      if (result.DEMOGRAPHICS.claimNumber) console.log(`  - Claim Number: ${result.DEMOGRAPHICS.claimNumber}`);
    }
    
    // Medical History
    if (result.MEDICAL_HISTORY) {
      console.log('\nMEDICAL HISTORY:');
      if (result.MEDICAL_HISTORY.preAccidentConditions) {
        console.log(`  - Pre-Accident Conditions: ${result.MEDICAL_HISTORY.preAccidentConditions}`);
      }
      if (result.MEDICAL_HISTORY.injuries && result.MEDICAL_HISTORY.injuries.length > 0) {
        console.log('  - Injuries/Diagnoses:');
        result.MEDICAL_HISTORY.injuries.forEach(injury => {
          console.log(`    * ${injury}`);
        });
      }
    }
    
    // Recommendations
    if (result.RECOMMENDATIONS) {
      console.log('\nRECOMMENDATIONS:');
      if (result.RECOMMENDATIONS.recommendationItems && result.RECOMMENDATIONS.recommendationItems.length > 0) {
        console.log('  - Recommendation Items:');
        result.RECOMMENDATIONS.recommendationItems.forEach(item => {
          console.log(`    * ${item}`);
        });
      }
      if (result.RECOMMENDATIONS.therapyRecommendations && result.RECOMMENDATIONS.therapyRecommendations.length > 0) {
        console.log('  - Therapy Recommendations:');
        result.RECOMMENDATIONS.therapyRecommendations.forEach(therapy => {
          console.log(`    * ${therapy}`);
        });
      }
    }
    
    // Attendant Care
    if (result.ATTENDANT_CARE) {
      console.log('\nATTENDANT CARE:');
      if (result.ATTENDANT_CARE.hoursPerWeek) console.log(`  - Hours Per Week: ${result.ATTENDANT_CARE.hoursPerWeek}`);
      if (result.ATTENDANT_CARE.monthlyCost) console.log(`  - Monthly Cost: $${result.ATTENDANT_CARE.monthlyCost}`);
      if (result.ATTENDANT_CARE.careType) console.log(`  - Care Type: ${result.ATTENDANT_CARE.careType}`);
    }
    
    // Functional Status
    if (result.FUNCTIONAL_STATUS) {
      console.log('\nFUNCTIONAL STATUS:');
      if (result.FUNCTIONAL_STATUS.mobilityStatus) console.log(`  - Mobility Status: ${result.FUNCTIONAL_STATUS.mobilityStatus}`);
      if (result.FUNCTIONAL_STATUS.selfCareLimitations) console.log(`  - Self-Care Limitations: ${result.FUNCTIONAL_STATUS.selfCareLimitations}`);
      if (result.FUNCTIONAL_STATUS.adlLimitations) console.log(`  - ADL Limitations: ${result.FUNCTIONAL_STATUS.adlLimitations}`);
    }
    
    // Save the results to a file
    const outputPath = path.join(__dirname, '..', '..', '..', 'test-results', 'ot-assessment-extraction.json');
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`\nResults saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error during OT Assessment extraction test:', error);
  }
}

// Run the test
testOTAssessmentExtraction();
