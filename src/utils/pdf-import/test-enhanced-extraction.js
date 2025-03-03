// Test script for enhanced pattern recognition system
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

const fs = require('fs').promises;
const path = require('path');
const { initializeEnhancedSystem } = require('./index-enhanced');

/**
 * Test the enhanced pattern recognition system on a sample document
 */
async function testEnhancedExtraction() {
  console.log('Starting enhanced pattern recognition test...');
  
  try {
    // Initialize the enhanced system
    console.log('Initializing enhanced system...');
    const enhancedSystem = await initializeEnhancedSystem();
    console.log('Enhanced system initialized successfully.');
    
    // Read test document (using the first argument as the file path, or a default)
    const testFilePath = process.argv[2] || path.join(__dirname, '..', '..', '..', 'test-documents', 'sample-ot-assessment.txt');
    console.log(`Reading test document from: ${testFilePath}`);
    
    const documentText = await fs.readFile(testFilePath, 'utf8');
    console.log(`Document loaded, length: ${documentText.length} characters`);
    
    // Process the document
    console.log('Processing document with enhanced pattern recognition...');
    console.time('ProcessingTime');
    const result = enhancedSystem.processDocument(documentText);
    console.timeEnd('ProcessingTime');
    
    // Enhance with NLP
    console.log('Enhancing extraction with NLP...');
    console.time('NLPEnhancementTime');
    const enhancedResult = enhancedSystem.enhanceWithNLP(result);
    console.timeEnd('NLPEnhancementTime');
    
    // Print summary of results
    console.log('\n----- EXTRACTION RESULTS SUMMARY -----');
    console.log(`Document Type: ${enhancedResult._documentType}`);
    console.log(`Document Type Confidence: ${enhancedResult._documentConfidence ? enhancedResult._documentConfidence.toFixed(2) : 'N/A'}`);
    console.log(`Detected Sections: ${Object.keys(enhancedResult._sections).length}`);
    
    // List sections with confidence
    console.log('\nDetected Sections:');
    Object.entries(enhancedResult._sections).forEach(([section, info]) => {
      console.log(`  - ${section}: ${info.confidence ? (info.confidence * 100).toFixed(0) + '%' : 'N/A'} confidence${info._skipped ? ' (skipped)' : ''}`);
    });
    
    // Print extracted data summary
    console.log('\nExtracted Data:');
    Object.keys(enhancedResult).forEach(section => {
      if (section.startsWith('_')) return; // Skip metadata
      
      const sectionData = enhancedResult[section];
      if (!sectionData || typeof sectionData !== 'object') return;
      
      // Count fields with values
      const fieldCount = Object.keys(sectionData).filter(f => 
        !f.startsWith('_') && f !== 'confidence' && sectionData[f] !== null && sectionData[f] !== undefined && sectionData[f] !== ''
      ).length;
      
      console.log(`  - ${section}: ${fieldCount} fields extracted`);
    });
    
    // Print NLP analysis summary
    if (enhancedResult._nlpAnalysis) {
      console.log('\nNLP Analysis:');
      
      // Entity relationships
      const entityRelationships = enhancedResult._nlpAnalysis.entityRelationships;
      let totalEntities = 0;
      let totalRelationships = 0;
      
      Object.values(entityRelationships).forEach(section => {
        totalEntities += section.entities?.length || 0;
        totalRelationships += section.relationships?.length || 0;
      });
      
      console.log(`  - Entity Relationships: ${totalEntities} entities, ${totalRelationships} relationships`);
      
      // Severity classifications
      const severityAnalysis = enhancedResult._nlpAnalysis.severity;
      const sectionsWithSeverity = Object.keys(severityAnalysis).length;
      console.log(`  - Severity Analysis: ${sectionsWithSeverity} sections with severity classifications`);
      
      // Temporal information
      const temporalAnalysis = enhancedResult._nlpAnalysis.temporal;
      let totalDates = 0;
      let totalDurations = 0;
      let totalFrequencies = 0;
      
      Object.values(temporalAnalysis).forEach(section => {
        totalDates += section.dates?.length || 0;
        totalDurations += section.durations?.length || 0;
        totalFrequencies += section.frequencies?.length || 0;
      });
      
      console.log(`  - Temporal Analysis: ${totalDates} dates, ${totalDurations} durations, ${totalFrequencies} frequencies`);
    }
    
    // Save the results to a file
    const outputPath = path.join(__dirname, '..', '..', '..', 'test-results', 'enhanced-extraction-result.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(enhancedResult, null, 2), 'utf8');
    console.log(`\nResults saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('Error during enhanced extraction test:', error);
  }
}

// Run the test
testEnhancedExtraction();
