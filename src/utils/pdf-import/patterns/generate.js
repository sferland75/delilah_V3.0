/**
 * Script to generate the optimized PatternMatcher based on analysis data
 * 
 * This is the main entry point for creating the data-driven pattern matcher
 * from the statistical analysis performed on the 91 documents.
 * 
 * Run with: node generate.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '../../../../');
const PATTERN_MATCHER_PATH = path.resolve(PROJECT_ROOT, 'src/utils/pdf-import/PatternMatcher.js');
const PATTERN_MATCHER_BACKUP_PATH = path.resolve(PROJECT_ROOT, 'src/utils/pdf-import/PatternMatcher.js.bak');

// Main execution function
async function main() {
  console.log('=== PatternMatcher Generator ===');
  console.log('Starting pattern matcher generation process...');
  
  // 1. Backup existing PatternMatcher.js
  console.log('Backing up existing PatternMatcher.js...');
  if (fs.existsSync(PATTERN_MATCHER_PATH)) {
    try {
      fs.copyFileSync(PATTERN_MATCHER_PATH, PATTERN_MATCHER_BACKUP_PATH);
      console.log(`✅ Backup created at: ${PATTERN_MATCHER_BACKUP_PATH}`);
    } catch (error) {
      console.error(`❌ Error creating backup: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.log('No existing PatternMatcher.js found to backup.');
  }
  
  // 2. Generate PatternMatcher.js from analysis data
  console.log('\nGenerating new PatternMatcher.js from analysis data...');
  try {
    process.chdir(SCRIPT_DIR);
    execSync('node generatePatternMatcher.js', { stdio: 'inherit' });
    console.log('✅ PatternMatcher.js generated successfully.');
  } catch (error) {
    console.error(`❌ Error generating PatternMatcher.js: ${error.message}`);
    
    // Restore from backup if generation failed
    if (fs.existsSync(PATTERN_MATCHER_BACKUP_PATH)) {
      console.log('Restoring from backup...');
      fs.copyFileSync(PATTERN_MATCHER_BACKUP_PATH, PATTERN_MATCHER_PATH);
      console.log('✅ Restored from backup.');
    }
    
    process.exit(1);
  }
  
  // 3. Verify the new PatternMatcher.js
  console.log('\nVerifying new PatternMatcher.js...');
  try {
    // Import the new PatternMatcher to test it
    const newPatternMatcherPath = path.resolve(PROJECT_ROOT, 'src/utils/pdf-import/PatternMatcher.js');
    delete require.cache[require.resolve(newPatternMatcherPath)];
    const PatternMatcher = require(newPatternMatcherPath);
    
    // Create an instance to verify it loads correctly
    const matcher = new PatternMatcher();
    console.log(`✅ Verification successful. Found ${Object.keys(matcher.sectionPatterns).length} section types.`);
    
    // Show pattern counts for each section
    Object.entries(matcher.sectionPatterns).forEach(([section, patterns]) => {
      console.log(`  - ${section}: ${patterns.length} patterns`);
    });
  } catch (error) {
    console.error(`❌ Verification failed: ${error.message}`);
    
    // Restore from backup if verification failed
    if (fs.existsSync(PATTERN_MATCHER_BACKUP_PATH)) {
      console.log('Restoring from backup...');
      fs.copyFileSync(PATTERN_MATCHER_BACKUP_PATH, PATTERN_MATCHER_PATH);
      console.log('✅ Restored from backup.');
    }
    
    process.exit(1);
  }
  
  console.log('\n=== Implementation Status ===');
  console.log('✅ PatternMatcher generation: COMPLETE');
  console.log('✅ SYMPTOMS extractor: COMPLETE');
  console.log('❌ Field extraction prioritization system: IN PROGRESS');
  console.log('❌ Additional section extractors: PENDING');
  console.log('❌ Confidence scoring calibration: PENDING');
  console.log('❌ Adaptive pattern selection: PENDING');
  
  console.log('\n=== Next Steps ===');
  console.log('1. Complete remaining section-specific extractors');
  console.log('2. Implement confidence scoring updates');
  console.log('3. Create visualization dashboard');
  console.log('4. Optimize for large document processing');
  
  console.log('\nGenerator execution completed successfully.');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error during execution:', error);
  process.exit(1);
});
