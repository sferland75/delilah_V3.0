// Delilah V3.0 Pattern Recognition - Confidence Calibration Script
// This script calibrates confidence scores based on validation results

const fs = require('fs');
const path = require('path');

// Paths
const VALIDATION_RESULT_PATH = path.join(__dirname, '../pattern_repository/validation_results/validation_summary.json');
const PATTERN_MATCHER_PATH = path.join(__dirname, '../src/utils/pdf-import/PatternMatcher.js');
const CALIBRATED_MATCHER_PATH = path.join(__dirname, '../src/utils/pdf-import/PatternMatcher.js');

/**
 * Calibrate confidence scores based on validation results
 */
function calibrateConfidence() {
  console.log('Calibrating confidence scores based on validation results...');
  
  try {
    // Check if validation results exist
    if (!fs.existsSync(VALIDATION_RESULT_PATH)) {
      console.error(`Validation results not found at ${VALIDATION_RESULT_PATH}`);
      console.error('Please run validate-patterns.js first.');
      process.exit(1);
    }
    
    // Read validation results
    const validationData = JSON.parse(fs.readFileSync(VALIDATION_RESULT_PATH, 'utf8'));
    
    // Read current PatternMatcher.js file
    if (!fs.existsSync(PATTERN_MATCHER_PATH)) {
      console.error(`PatternMatcher.js not found at ${PATTERN_MATCHER_PATH}`);
      console.error('Please run generate-matchers.js first.');
      process.exit(1);
    }
    
    const patternMatcherContent = fs.readFileSync(PATTERN_MATCHER_PATH, 'utf8');
    
    // Extract pattern sections from the file
    const sectionPatternsMatch = patternMatcherContent.match(/const SECTION_PATTERNS = ([\s\S]+?);/);
    const contextualPatternsMatch = patternMatcherContent.match(/const CONTEXTUAL_PATTERNS = ([\s\S]+?);/);
    
    if (!sectionPatternsMatch || !contextualPatternsMatch) {
      console.error('Could not parse PatternMatcher.js correctly.');
      process.exit(1);
    }
    
    // Parse the pattern objects
    let sectionPatterns;
    let contextualPatterns;
    
    try {
      sectionPatterns = eval(`(${sectionPatternsMatch[1]})`);
      contextualPatterns = eval(`(${contextualPatternsMatch[1]})`);
    } catch (error) {
      console.error('Error parsing patterns from PatternMatcher.js:', error);
      process.exit(1);
    }
    
    console.log('Adjusting confidence scores based on validation results...');
    
    // Calculate adjustment factors based on validation results
    const adjustmentFactors = {};
    
    Object.entries(validationData.sections).forEach(([section, data]) => {
      // Skip sections with no detection
      if (data.detectionRate === 0) {
        adjustmentFactors[section] = 1.0; // No change
        return;
      }
      
      // Calculate adjustment factor:
      // - If detection rate is high but confidence is low, boost confidence
      // - If detection rate is low but confidence is high, reduce confidence
      const detectionRateScore = data.detectionRate;
      const avgConfidenceScore = data.avgConfidence || 0;
      
      // Determine if confidence needs adjustment
      if (detectionRateScore > avgConfidenceScore + 0.2) {
        // Detection rate is much higher than confidence - boost confidence
        adjustmentFactors[section] = 1.2;
      } else if (avgConfidenceScore > detectionRateScore + 0.2) {
        // Confidence is much higher than detection rate - reduce confidence
        adjustmentFactors[section] = 0.8;
      } else {
        // Confidence is reasonably aligned with detection rate - minor adjustment
        adjustmentFactors[section] = 1.0 + (detectionRateScore - avgConfidenceScore) / 2;
      }
      
      // Ensure adjustment factor is within reasonable bounds
      adjustmentFactors[section] = Math.max(0.5, Math.min(1.5, adjustmentFactors[section]));
      
      console.log(`${section}: Adjustment factor ${adjustmentFactors[section].toFixed(2)} (detection rate: ${detectionRateScore.toFixed(2)}, avg confidence: ${avgConfidenceScore.toFixed(2)})`);
    });
    
    // Apply adjustments to section patterns
    Object.entries(sectionPatterns).forEach(([section, patterns]) => {
      const factor = adjustmentFactors[section] || 1.0;
      
      patterns.forEach(pattern => {
        // Apply adjustment factor
        pattern.confidence = Math.min(0.95, Math.max(0.1, pattern.confidence * factor));
      });
    });
    
    // Apply adjustments to contextual patterns
    Object.entries(contextualPatterns).forEach(([section, contexts]) => {
      const factor = adjustmentFactors[section] || 1.0;
      
      // Apply to 'before' patterns
      contexts.before.forEach(pattern => {
        pattern.confidence = Math.min(0.9, Math.max(0.1, pattern.confidence * factor));
      });
      
      // Apply to 'after' patterns
      contexts.after.forEach(pattern => {
        pattern.confidence = Math.min(0.9, Math.max(0.1, pattern.confidence * factor));
      });
    });
    
    // Create calibrated pattern matcher content
    const calibratedContent = patternMatcherContent
      .replace(
        /const SECTION_PATTERNS = [\s\S]+?;/,
        `const SECTION_PATTERNS = ${JSON.stringify(sectionPatterns, null, 2)};`
      )
      .replace(
        /const CONTEXTUAL_PATTERNS = [\s\S]+?;/,
        `const CONTEXTUAL_PATTERNS = ${JSON.stringify(contextualPatterns, null, 2)};`
      );
    
    // Write calibrated pattern matcher
    fs.writeFileSync(CALIBRATED_MATCHER_PATH, calibratedContent);
    
    console.log(`Calibrated PatternMatcher.js written to ${CALIBRATED_MATCHER_PATH}`);
    
    // Create a backup in validation_results
    const backupPath = path.join(
      path.dirname(VALIDATION_RESULT_PATH),
      `PatternMatcher_calibrated_${new Date().toISOString().replace(/[:.]/g, '-')}.js`
    );
    fs.writeFileSync(backupPath, calibratedContent);
    console.log(`Backup saved at ${backupPath}`);
    
  } catch (error) {
    console.error('Error calibrating confidence scores:', error);
    process.exit(1);
  }
}

// Run the calibration
calibrateConfidence();
