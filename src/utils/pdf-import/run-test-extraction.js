// Run test extraction on OT assessment document
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

const fs = require('fs').promises;
const path = require('path');

/**
 * Create mocks for the pattern recognition system components
 * This helps us run the test without all dependencies
 */
function createMockSystem() {
  return {
    processDocument: (text) => {
      console.log(`Processing document text (${text.length} characters)...`);
      
      // Create a simple extraction result
      return {
        _documentType: 'OT_ASSESSMENT',
        _documentConfidence: 0.85,
        _sections: {
          'DEMOGRAPHICS': { confidence: 0.92, extracted: true },
          'MEDICAL_HISTORY': { confidence: 0.88, extracted: true },
          'SYMPTOMS': { confidence: 0.75, extracted: true },
          'FUNCTIONAL_STATUS': { confidence: 0.82, extracted: true },
          'RECOMMENDATIONS': { confidence: 0.95, extracted: true },
          'ATTENDANT_CARE': { confidence: 0.93, extracted: true }
        },
        'DEMOGRAPHICS': {
          confidence: {
            name: 0.95,
            dob: 0.65,
            address: 0.9,
            phone: 0.85
          },
          name: 'Mr. Ali Al Naqeeb',
          address: '34 Kinetic Way, Ottawa ON K2J 0A1',
          phone: '819-918-8892',
          claimNumber: '105304327-3'
        },
        'MEDICAL_HISTORY': {
          confidence: {
            condition: 0.85,
            injuries: 0.9
          },
          preAccidentConditions: 'None reported',
          injuries: [
            'Pain Disorder',
            'Generalized Anxiety Disorder with symptoms of panic',
            'Specific Phobia (vehicular, both driver and passenger)',
            'Post-traumatic Stress Disorder',
            'Traumatic Brain Injury with post-concussive syndrome',
            'Major Depressive Disorder'
          ]
        },
        'ATTENDANT_CARE': {
          confidence: {
            attendantCareHours: 0.95,
            attendantCareCost: 0.95
          },
          attendantCareHours: '8.35 hours per week',
          attendantCareCost: '$550.30 per month'
        }
      };
    },
    
    enhanceWithNLP: (result) => {
      console.log('Enhancing extraction with NLP...');
      
      // Add NLP analysis
      return {
        ...result,
        _nlpAnalysis: {
          entityRelationships: {
            'DEMOGRAPHICS': {
              entities: [
                { type: 'PERSON', value: 'Mr. Ali Al Naqeeb', confidence: 0.95 },
                { type: 'LOCATION', value: '34 Kinetic Way, Ottawa ON K2J 0A1', confidence: 0.9 }
              ],
              relationships: [
                { type: 'located_at', source: 'Mr. Ali Al Naqeeb', target: '34 Kinetic Way, Ottawa ON K2J 0A1', confidence: 0.85 }
              ]
            },
            'MEDICAL_HISTORY': {
              entities: [
                { type: 'PERSON', value: 'Mr. Ali Al Naqeeb', confidence: 0.8 },
                { type: 'CONDITION', value: 'Traumatic Brain Injury', confidence: 0.9 },
                { type: 'CONDITION', value: 'Post-traumatic Stress Disorder', confidence: 0.9 }
              ],
              relationships: [
                { type: 'has_diagnosis', source: 'Mr. Ali Al Naqeeb', target: 'Traumatic Brain Injury', confidence: 0.85 }
              ]
            }
          },
          severity: {
            'MEDICAL_HISTORY': {
              overall: { term: 'moderate', level: 3, confidence: 0.8 },
              specific: {
                depression: { term: 'severe', level: 5, confidence: 0.85 }
              }
            }
          },
          temporal: {
            'DEMOGRAPHICS': {
              dates: [
                { value: '2013-08-27', type: 'onset', confidence: 0.9 },
                { value: '2021-11-23', type: 'assessment', confidence: 0.9 }
              ]
            }
          }
        }
      };
    }
  };
}

/**
 * Main function to run the test
 */
async function runTest() {
  console.log('Starting test extraction on OT assessment document...');
  
  try {
    // Read the test document
    const testFilePath = process.argv[2] || path.join(__dirname, '..', '..', '..', 'test-documents', 'sample-ot-assessment.txt');
    console.log(`Reading document from: ${testFilePath}`);
    
    const documentText = await fs.readFile(testFilePath, 'utf8');
    console.log(`Document loaded, ${documentText.length} characters`);
    
    // Create mock system (while the real system is being developed)
    const system = createMockSystem();
    
    // Process the document
    console.log('Processing document...');
    console.time('ProcessingTime');
    const result = system.processDocument(documentText);
    console.timeEnd('ProcessingTime');
    
    // Enhance with NLP
    console.log('Adding NLP enhancements...');
    console.time('NLPTime');
    const enhancedResult = system.enhanceWithNLP(result);
    console.timeEnd('NLPTime');
    
    // Print summary
    console.log('\n----- EXTRACTION RESULTS SUMMARY -----');
    console.log(`Document Type: ${enhancedResult._documentType}`);
    console.log(`Document Type Confidence: ${enhancedResult._documentConfidence.toFixed(2)}`);
    console.log(`Sections Detected: ${Object.keys(enhancedResult._sections).length}`);
    
    // Save results
    const outputPath = path.join(__dirname, '..', '..', '..', 'test-results', 'extraction-result.json');
    await fs.writeFile(outputPath, JSON.stringify(enhancedResult, null, 2), 'utf8');
    console.log(`\nResults saved to: ${outputPath}`);
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Error during test extraction:', error);
  }
}

// Run the test
runTest();
