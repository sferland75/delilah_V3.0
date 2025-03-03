/**
 * Pattern Recognition Improvement Script
 * 
 * This script takes the insights from the training analysis
 * and applies improvements to the pattern recognition system.
 * 
 * It reads the meta-analysis results and enhances the pattern matchers
 * and extractors based on the findings.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);

// Set up paths
const RESULTS_DIR = path.join('d:', 'delilah', 'pattern_recognition', 'training_results');
const PATTERNS_DIR = path.join('d:', 'delilah', 'pattern_recognition', 'matchers');
const UTILS_DIR = path.join('d:', 'delilah_V3.0', 'src', 'utils', 'pdf-import');

// Track improvements
const improvements = {
  patterns: { added: 0, modified: 0 },
  extractors: { added: 0, modified: 0 }
};

/**
 * Load the meta-analysis results
 */
async function loadMetaAnalysis() {
  try {
    const metaFilePath = path.join(RESULTS_DIR, 'meta_analysis.json');
    const metaData = JSON.parse(await readFile(metaFilePath, 'utf8'));
    return metaData;
  } catch (error) {
    console.error('Error loading meta-analysis:', error.message);
    throw error;
  }
}

/**
 * Improve pattern matchers based on analysis
 */
async function improvePatternMatchers(metaAnalysis) {
  try {
    console.log('Improving pattern matchers...');
    
    // Load the current pattern matcher file
    const patternMatcherPath = path.join(UTILS_DIR, 'PatternMatcher.js');
    let patternMatcherContent = await readFile(patternMatcherPath, 'utf8');
    
    // Extract the pattern matchers object
    const matcherRegex = /this\.sectionMatchers\s*=\s*(\{[\s\S]*?\n\s*\})\s*;/;
    const matcherMatch = patternMatcherContent.match(matcherRegex);
    
    if (!matcherMatch || !matcherMatch[1]) {
      console.warn('Could not extract pattern matchers from file. Skip improvement.');
      return;
    }
    
    let matchersStr = matcherMatch[1];
    let matchers;
    
    try {
      // Using eval is not ideal but works for this specific case
      matchers = eval(`(${matchersStr})`);
    } catch (evalError) {
      console.error('Error parsing pattern matchers:', evalError);
      return;
    }
    
    // Find most effective patterns from analysis
    if (metaAnalysis.patternMatches) {
      Object.entries(metaAnalysis.patternMatches).forEach(([key, patterns]) => {
        const [section, type] = key.split('.');
        
        // Only focus on strong and contextual matches
        if (type !== 'strong' && type !== 'context') return;
        
        // Check if this section exists in our matchers
        if (!matchers[section]) return;
        
        // Get the top patterns that are not already included
        const patternField = type === 'strong' ? 'strongMatchers' : 'contextMatchers';
        const existingPatterns = new Set(matchers[section][patternField]);
        
        const newPatterns = Object.entries(patterns)
          .sort((a, b) => b[1] - a[1])  // Sort by frequency
          .filter(([pattern, count]) => 
            count > 2 &&                 // Only add patterns that appear multiple times
            !existingPatterns.has(pattern) &&
            pattern.length > 5 &&        // Avoid very short patterns
            pattern.length < 200         // Avoid extremely long patterns
          )
          .slice(0, 5)                   // Take top 5 new patterns
          .map(([pattern, _]) => pattern);
        
        // Add new patterns
        if (newPatterns.length > 0) {
          console.log(`Adding ${newPatterns.length} new ${type} patterns for ${section}`);
          matchers[section][patternField] = [
            ...matchers[section][patternField],
            ...newPatterns
          ];
          improvements.patterns.added += newPatterns.length;
        }
      });
    }
    
    // Improve regex patterns for sections with low confidence
    if (metaAnalysis.confidenceScores) {
      Object.entries(metaAnalysis.confidenceScores)
        .filter(([_, conf]) => conf.average < 0.6)  // Focus on low confidence sections
        .forEach(([section, _]) => {
          // Check if this section exists in our matchers
          if (!matchers[section]) return;
          
          // Add more flexible regex patterns based on section type
          switch(section) {
            case 'DEMOGRAPHICS':
              matchers[section].regexPatterns.push(
                /(?:about|regarding)\s+(?:the\s+)?(?:client|patient|individual)/i.source,
                /(?:name|dob|gender|address)(?:\s*[\:\-\.]\s*|\s+is\s+)/i.source
              );
              break;
              
            case 'MEDICAL_HISTORY':
              matchers[section].regexPatterns.push(
                /(?:past|previous|prior)\s+(?:medical|health)/i.source,
                /(?:sustained|suffered|experienced|underwent|has a|reports)/i.source
              );
              break;
              
            case 'PURPOSE':
              matchers[section].regexPatterns.push(
                /(?:was|is)\s+(?:referred|requested|asked)/i.source,
                /(?:assessment|evaluation|report)\s+(?:was|is)\s+(?:requested|completed)/i.source
              );
              break;
              
            case 'SYMPTOMS':
              matchers[section].regexPatterns.push(
                /(?:reports?|complains?|describes?)\s+(?:of|having|experiencing)/i.source,
                /(?:pain|discomfort|difficulty|limitation|restriction)/i.source
              );
              break;
              
            case 'FUNCTIONAL_STATUS':
              matchers[section].regexPatterns.push(
                /(?:able|unable|can|cannot|difficulty|able)\s+to\s+(?:walk|move|transfer|stand)/i.source,
                /(?:independence|dependence|assistance|requires|needs)\s+(?:with|for)/i.source
              );
              break;
              
            case 'TYPICAL_DAY':
              matchers[section].regexPatterns.push(
                /(?:during|throughout|in)\s+(?:the|a)\s+(?:typical|normal|average|usual)/i.source,
                /(?:morning|afternoon|evening|night|day)(?:\s*[:,.]\s*|\s+routine)/i.source
              );
              break;
              
            case 'ENVIRONMENTAL':
              matchers[section].regexPatterns.push(
                /(?:lives|resides|residing|residence|dwelling|accommodation)/i.source,
                /(?:stairs|steps|floor|level|bathroom|kitchen|bedroom)/i.source
              );
              break;
              
            case 'ADLS':
              matchers[section].regexPatterns.push(
                /(?:independent|dependent|requires assistance|needs help)\s+(?:with|for)/i.source,
                /(?:bathing|dressing|toileting|eating|grooming|mobility)/i.source
              );
              break;
              
            case 'ATTENDANT_CARE':
              matchers[section].regexPatterns.push(
                /(?:caregiver|aide|helper|assistant|family member)\s+(?:assists|helps|provides)/i.source,
                /(?:hours|minutes|times|frequency)\s+(?:of|per)\s+(?:care|assistance|help)/i.source
              );
              break;
          }
          
          improvements.patterns.modified++;
        });
    }
    
    // Replace the pattern matchers in the file
    const updatedMatchersStr = JSON.stringify(matchers, null, 2);
    const updatedContent = patternMatcherContent.replace(matcherRegex, `this.sectionMatchers = ${updatedMatchersStr};`);
    
    // Save updated pattern matcher
    const patternMatcherBackupPath = path.join(UTILS_DIR, 'PatternMatcher.js.bak');
    await copyFile(patternMatcherPath, patternMatcherBackupPath);
    await writeFile(patternMatcherPath, updatedContent);
    
    console.log(`Pattern matchers improved and saved to ${patternMatcherPath}`);
    console.log(`Original backed up to ${patternMatcherBackupPath}`);
  } catch (error) {
    console.error('Error improving pattern matchers:', error.message);
  }
}

/**
 * Improve field extractors based on analysis
 */
async function improveFieldExtractors(metaAnalysis) {
  try {
    console.log('Improving field extractors...');
    
    // Get low extraction success fields
    const lowExtractionFields = Object.entries(metaAnalysis.fieldExtraction)
      .filter(([_, count]) => count / metaAnalysis.totalFiles < 0.5)
      .map(([field, _]) => field);
    
    // Group by section
    const sectionImprovements = {};
    lowExtractionFields.forEach(field => {
      const [section, fieldName] = field.split('.');
      if (!sectionImprovements[section]) {
        sectionImprovements[section] = [];
      }
      sectionImprovements[section].push(fieldName);
    });
    
    // Process each section with low extraction fields
    for (const [section, fields] of Object.entries(sectionImprovements)) {
      // Skip if too many fields (might indicate a structural issue)
      if (fields.length > 10) continue;
      
      const extractorName = `${section}Extractor`;
      const extractorPath = path.join(UTILS_DIR, `${extractorName}.js`);
      
      // Check if the extractor file exists
      if (!fs.existsSync(extractorPath)) continue;
      
      let extractorContent = await readFile(extractorPath, 'utf8');
      let modified = false;
      
      // Improve extraction for each low-success field
      for (const field of fields) {
        // Find the extraction method for this field
        const fieldMatch = extractorContent.match(new RegExp(`\\b${field}\\b[^=]*=([^;]+);`));
        if (!fieldMatch) continue;
        
        // Add more flexible extraction patterns
        const fieldImprovement = generateFieldExtractor(section, field);
        if (!fieldImprovement) continue;
        
        // Make sure the improvement isn't already in the file
        if (!extractorContent.includes(fieldImprovement)) {
          // Find a suitable insertion point
          const methodMatch = extractorContent.match(/static\s+extract\s*\([^)]*\)\s*{/);
          if (methodMatch) {
            const insertPos = extractorContent.indexOf(methodMatch[0]) + methodMatch[0].length;
            extractorContent = 
              extractorContent.substring(0, insertPos) + 
              '\n    // Improved extraction for ' + field + '\n' + 
              '    ' + fieldImprovement + '\n' +
              extractorContent.substring(insertPos);
            
            modified = true;
            improvements.extractors.modified++;
          }
        }
      }
      
      // Save the updated extractor if modified
      if (modified) {
        const extractorBackupPath = path.join(UTILS_DIR, `${extractorName}.js.bak`);
        await copyFile(extractorPath, extractorBackupPath);
        await writeFile(extractorPath, extractorContent);
        
        console.log(`Improved extractor for ${section} and saved to ${extractorPath}`);
        console.log(`Original backed up to ${extractorBackupPath}`);
      }
    }
  } catch (error) {
    console.error('Error improving field extractors:', error.message);
  }
}

/**
 * Generate field extractor improvement code
 */
function generateFieldExtractor(section, field) {
  // Customize based on section and field
  switch (`${section}.${field}`) {
    case 'DEMOGRAPHICS.name':
      return `const improvedNamePatterns = [
      /(?:client|patient|resident)(?:'s)?\\s+name\\s*(?:is|:)\\s*([^,\\n.]+)/i,
      /(?:name|client|patient)\\s*:\\s*([^,\\n.]+)/i,
      /([A-Z][a-z]+\\s+[A-Z][a-z]+)\\s+(?:is a|was|is|has been)/i,
      /^\\s*([A-Z][a-z]+\\s+[A-Z][a-z]+)\\s*$/m
    ];
    
    for (const pattern of improvedNamePatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].trim().length > 3) {
        data.name = match[1].trim();
        data.confidence.name = 0.8;
        break;
      }
    }`;
      
    case 'DEMOGRAPHICS.dob':
      return `const datePatterns = [
      /(?:date of birth|dob|born|birth date)\\s*(?:is|:|on|-|–|\\*)\\s*([^,\\n.]+)/i,
      /(?:born)\\s+(?:on|in)\\s+([^,\\n.]+)/i,
      /([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})/i,
      /([A-Z][a-z]+ [0-9]{1,2},? [0-9]{4})/i
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        data.dob = match[1].trim();
        data.confidence.dob = 0.8;
        break;
      }
    }`;
      
    case 'MEDICAL_HISTORY.primaryDiagnosis':
      return `const diagnosisPatterns = [
      /(?:primary|main|principal|initial|chief)\\s+(?:diagnosis|condition|injury|problem)\\s*(?:is|:|includes|consists of)\\s*([^.]+)/i,
      /(?:diagnosed with|suffers from|experienced|presenting with)\\s+([^.]+)/i,
      /(?:diagnosis|condition)\\s*:\\s*([^.]+)/i
    ];
    
    for (const pattern of diagnosisPatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].trim().length > 3) {
        data.primaryDiagnosis = match[1].trim();
        data.confidence.primaryDiagnosis = 0.8;
        break;
      }
    }`;
      
    case 'SYMPTOMS.painDescription':
      return `const painDescriptionPatterns = [
      /(?:pain|discomfort)\\s+(?:is|was)\\s+(?:described as|reported as|characterized as)\\s+([^.]+)/i,
      /(?:describes|reports|characterizes)\\s+(?:the|their|his|her)?\\s*(?:pain|discomfort)\\s+as\\s+([^.]+)/i,
      /(?:pain|discomfort)\\s+(?:quality|character|characteristics|type)\\s*(?:is|:|includes|consists of)\\s*([^.]+)/i
    ];
    
    for (const pattern of painDescriptionPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        data.painDescription = match[1].trim();
        data.confidence.painDescription = 0.8;
        break;
      }
    }`;
      
    case 'FUNCTIONAL_STATUS.mobilityStatus':
      return `const mobilityPatterns = [
      /(?:mobility status|mobility|ambulation|gait)\\s*(?:is|:|includes|consists of)\\s*([^.]+)/i,
      /(?:client|patient|individual)\\s+(?:is able to|can|is capable of|demonstrates ability to)\\s+([^.]*?walk[^.]+)/i,
      /(?:ability to|can|is able to)\\s+(?:ambulate|walk|move)\\s+([^.]+)/i
    ];
    
    for (const pattern of mobilityPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        data.mobilityStatus = match[1].trim();
        data.confidence.mobilityStatus = 0.8;
        break;
      }
    }`;
      
    case 'TYPICAL_DAY.morningRoutine':
      return `const morningPatterns = [
      /(?:morning routine|morning|AM routine|morning activities|typical morning)\\s*(?:includes|consists of|involves|:)\\s*([^.]+(?:\\.[^.]+){0,3})/i,
      /(?:In the morning,|Upon awakening,|After waking,|Client's morning includes)\\s+([^.]+(?:\\.[^.]+){0,3})/i
    ];
    
    for (const pattern of morningPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const morningText = match[1].trim();
        const activities = morningText.split(/(?:,|;|and|then)\\s+/).filter(item => item.trim().length > 0);
        
        if (activities.length > 0) {
          data.morningRoutine = data.morningRoutine.concat(activities);
          data.confidence.morningRoutine = 0.7;
        }
      }
    }`;
      
    case 'ENVIRONMENTAL.homeType':
      return `const homeTypePatterns = [
      /(?:home type|residence type|housing type|dwelling type|accommodation type|residence|lives in a|resides in a|dwelling|house type)\\s*(?:is|:|includes|consists of)\\s*([^.,;\\n]+)/i,
      /(?:lives|resides)\\s+in\\s+(?:a|an)\\s+([^.,;\\n]+(?:house|apartment|condo|bungalow|townhouse|residence|unit))/i,
      /(?:the|a)\\s+([^.,;\\n]{3,20}\\s+(?:house|apartment|condo|bungalow|townhouse|residence|unit))/i
    ];
    
    for (const pattern of homeTypePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        data.homeType = match[1].trim();
        data.confidence.homeType = 0.8;
        break;
      }
    }`;
      
    case 'ADLS.selfCare':
      return `const selfCarePatterns = [
      /(?:bathing|showering)\\s+(?:is|was|requires|needs)\\s+([^.]+)/i,
      /(?:dressing|grooming)\\s+(?:is|was|requires|needs)\\s+([^.]+)/i,
      /(?:requires|needs)\\s+(?:assistance|help|aid|support)\\s+with\\s+([^.]*?\\b(?:bath|shower|dress|groom|hygiene)\\b[^.]*)/i
    ];
    
    for (const pattern of selfCarePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const careText = match[1].trim().toLowerCase();
        
        // Determine level from text
        let level = 'unknown';
        if (careText.includes('independent') || careText.includes('independence')) {
          level = 'independent';
        } else if (careText.includes('supervision') || careText.includes('minimal')) {
          level = careText.includes('supervision') ? 'supervision' : 'minimalAssist';
        } else if (careText.includes('moderate')) {
          level = 'moderateAssist';
        } else if (careText.includes('maximum') || careText.includes('maximal')) {
          level = 'maximalAssist';
        } else if (careText.includes('dependent') || careText.includes('unable')) {
          level = 'dependent';
        }
        
        // Determine which ADL this refers to
        if (careText.includes('bath') || careText.includes('shower') || careText.includes('hygiene')) {
          data.selfCare.bathing = { level, notes: match[0] };
        } else if (careText.includes('dress')) {
          data.selfCare.dressing = { level, notes: match[0] };
        } else if (careText.includes('groom')) {
          data.selfCare.grooming = { level, notes: match[0] };
        }
      }
    }`;
      
    case 'ATTENDANT_CARE.careNeeds':
      return `const careNeedPatterns = [
      /(?:requires|needs|requires assistance with|assistance required for)\\s+([^.]+)/i,
      /(?:assist with|assistance with|help with)\\s+([^.]+)/i,
      /(?:care needs|attendant care needs|personal care needs)\\s*(?:include|:)\\s*([^.]+)/i
    ];
    
    for (const pattern of careNeedPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const needsText = match[1].trim();
        const needs = needsText.split(/(?:,|;|and)\\s+/).filter(item => item.trim().length > 0);
        
        needs.forEach(need => {
          need = need.trim();
          if (need.length > 0) {
            // Categorize the need
            if (need.match(/bath|shower|dress|groom|toilet|hygiene|self[\\s-]care/i)) {
              if (!data.careNeeds.personalCare.includes(need)) {
                data.careNeeds.personalCare.push(need);
              }
            } else if (need.match(/clean|laundry|dust|vacuum|dishes|chore|house/i)) {
              if (!data.careNeeds.housekeeping.includes(need)) {
                data.careNeeds.housekeeping.push(need);
              }
            } else if (need.match(/meal|cook|food|prepar|kitchen/i)) {
              if (!data.careNeeds.mealPrep.includes(need)) {
                data.careNeeds.mealPrep.push(need);
              }
            } else if (need.match(/medicine|medication|pill|prescription/i)) {
              if (!data.careNeeds.medication.includes(need)) {
                data.careNeeds.medication.push(need);
              }
            } else if (need.match(/walk|ambulate|transfer|move|mobility/i)) {
              if (!data.careNeeds.mobility.includes(need)) {
                data.careNeeds.mobility.push(need);
              }
            }
          }
        });
      }
    }`;
      
    case 'PURPOSE.assessmentPurpose':
      return `const purposePatterns = [
      /(?:purpose|reason|objective|goal)\\s+(?:of|for)\\s+(?:this|the)\\s+(?:assessment|evaluation|report|visit)\\s*(?:is|was|:|to)\\s+([^.]+)/i,
      /(?:assessment|evaluation|report)\\s+(?:is|was)\\s+(?:conducted|completed|carried out|performed|requested)\\s+(?:to|in order to)\\s+([^.]+)/i,
      /(?:client|patient)\\s+(?:was|is)\\s+(?:referred|assessed|evaluated)\\s+(?:to|for)\\s+([^.]+)/i
    ];
    
    for (const pattern of purposePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        data.assessmentPurpose = match[1].trim();
        data.confidence.assessmentPurpose = 0.8;
        break;
      }
    }`;
      
    default:
      return null;
  }
}

/**
 * Create a summary report of improvements
 */
async function createSummaryReport() {
  try {
    const summary = `# Pattern Recognition Improvements Summary

## Pattern Improvements
- Added ${improvements.patterns.added} new patterns
- Modified ${improvements.patterns.modified} section pattern sets

## Extractor Improvements
- Improved ${improvements.extractors.modified} field extractors

## Files Modified
- PatternMatcher.js (pattern matches and regex expressions)
${Object.keys(improvements.extractors).length > 0 ? '- Various extractor files\n' : ''}

## Next Steps
1. Test the enhanced pattern recognition system with new PDFs
2. Monitor extraction results for the improved fields
3. Run the training analysis again to measure improvement
4. Continue refining patterns based on results
`;

    const summaryPath = path.join(RESULTS_DIR, 'improvements_summary.md');
    await writeFile(summaryPath, summary);
    console.log(`Improvements summary saved to ${summaryPath}`);
  } catch (error) {
    console.error('Error creating summary report:', error.message);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Loading meta-analysis data...');
    const metaAnalysis = await loadMetaAnalysis();
    
    // Apply improvements
    await improvePatternMatchers(metaAnalysis);
    await improveFieldExtractors(metaAnalysis);
    
    // Create summary report
    await createSummaryReport();
    
    console.log('Pattern recognition improvements complete!');
  } catch (error) {
    console.error('Error applying improvements:', error.message);
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
