/**
 * Pattern Matcher Generator
 * 
 * This script analyzes the meta_analysis.json and individual analysis files
 * to create an optimized PatternMatcher.js file with data-driven patterns.
 * 
 * Usage: node generatePatternMatcher.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const META_ANALYSIS_PATH = path.resolve(__dirname, '../../../../pattern_repository/expanded_dataset/meta_analysis.json');
const SUMMARY_REPORT_PATH = path.resolve(__dirname, '../../../../pattern_repository/expanded_dataset/summary_report.md');
const ANALYSIS_DIR = path.resolve(__dirname, '../../../../pattern_repository/expanded_dataset');
const TEMPLATE_PATH = path.resolve(__dirname, '../../../../templates/PatternMatcher.template.js');
const OUTPUT_PATH = path.resolve(__dirname, '../PatternMatcher.js');

console.log('Starting pattern matcher generation...');

// Load meta analysis data
const metaAnalysis = require(META_ANALYSIS_PATH);
console.log(`Meta analysis loaded: ${metaAnalysis.totalFiles} files processed`);

// Extract confidence score statistics
const confidenceStats = metaAnalysis.confidenceScores;
console.log('Confidence statistics extracted');

// Prepare storage for pattern extraction
const patternEffectiveness = {
  DEMOGRAPHICS: {},
  SYMPTOMS: {},
  ENVIRONMENTAL: {},
  MEDICAL_HISTORY: {},
  ATTENDANT_CARE: {},
  FUNCTIONAL_STATUS: {},
  TYPICAL_DAY: {},
  ADLS: {}
};

// Define contextual patterns
const contextualPatterns = {
  DEMOGRAPHICS: {
    before: [],
    after: []
  },
  MEDICAL_HISTORY: {
    before: [],
    after: []
  },
  SYMPTOMS: {
    before: [],
    after: []
  },
  FUNCTIONAL_STATUS: {
    before: [],
    after: []
  },
  ENVIRONMENTAL: {
    before: [],
    after: []
  },
  TYPICAL_DAY: {
    before: [],
    after: []
  },
  ADLS: {
    before: [],
    after: []
  },
  ATTENDANT_CARE: {
    before: [],
    after: []
  }
};

// Process each individual analysis file
console.log('Processing individual analysis files...');
const analysisFiles = fs.readdirSync(ANALYSIS_DIR)
  .filter(file => file.endsWith('_analysis.json') && file !== 'meta_analysis.json');

let processedFiles = 0;
analysisFiles.forEach(filename => {
  try {
    const analysisPath = path.join(ANALYSIS_DIR, filename);
    const fileData = require(analysisPath);
    
    // Process section patterns from this file
    if (fileData.sections) {
      Object.keys(fileData.sections).forEach(sectionType => {
        // Extract potential pattern texts from section headers
        const sectionText = fileData.sections[sectionType];
        const lines = sectionText.split('\n');
        
        // Consider first few lines as potential section identifiers
        const potentialHeaders = lines.slice(0, Math.min(5, lines.length));
        
        potentialHeaders.forEach(line => {
          const cleanLine = line.toLowerCase().trim();
          
          // Skip empty lines or very long lines
          if (!cleanLine || cleanLine.length > 100) return;
          
          // Skip lines that are likely not headers
          if (cleanLine.match(/^\d+$/) || cleanLine.match(/^page \d+$/i)) return;
          
          // Extract potential pattern chunks
          const words = cleanLine.split(/\s+/).filter(w => w.length > 3);
          
          // Track single words and word pairs as potential patterns
          words.forEach(word => {
            if (word.length < 4) return; // Skip very short words
            
            if (!patternEffectiveness[sectionType][word]) {
              patternEffectiveness[sectionType][word] = 0;
            }
            patternEffectiveness[sectionType][word]++;
          });
          
          // Track word pairs (bigrams)
          for (let i = 0; i < words.length - 1; i++) {
            const bigram = words[i] + ' ' + words[i + 1];
            if (!patternEffectiveness[sectionType][bigram]) {
              patternEffectiveness[sectionType][bigram] = 0;
            }
            patternEffectiveness[sectionType][bigram]++;
          }
          
          // Track trigrams
          for (let i = 0; i < words.length - 2; i++) {
            const trigram = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
            if (!patternEffectiveness[sectionType][trigram]) {
              patternEffectiveness[sectionType][trigram] = 0;
            }
            patternEffectiveness[sectionType][trigram]++;
          }
        });
        
        // Extract contextual patterns
        if (lines.length > 5) {
          // Check for patterns after section headers
          const afterLines = lines.slice(5, Math.min(15, lines.length));
          afterLines.forEach(line => {
            const cleanLine = line.toLowerCase().trim();
            if (!cleanLine || cleanLine.length > 50) return;
            
            const words = cleanLine.split(/\s+/).filter(w => w.length > 3);
            words.forEach(word => {
              if (word.length < 4) return;
              
              // Add to contextual patterns
              const existingAfter = contextualPatterns[sectionType].after.find(p => p.text === word);
              if (existingAfter) {
                existingAfter.frequency = (existingAfter.frequency || 0) + 1;
              } else {
                contextualPatterns[sectionType].after.push({
                  text: word,
                  confidence: confidenceStats[sectionType].average * 0.9, // Slightly lower confidence for context
                  frequency: 1
                });
              }
            });
          });
        }
      });
    }
    
    processedFiles++;
    if (processedFiles % 10 === 0) {
      console.log(`Processed ${processedFiles}/${analysisFiles.length} files`);
    }
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
  }
});

console.log(`Completed processing ${processedFiles} individual analysis files`);

// Generate optimized patterns
console.log('Generating optimized pattern data...');
const optimizedPatterns = {};
const minPatternCount = 3; // Minimum frequency to include a pattern

Object.keys(patternEffectiveness).forEach(sectionType => {
  // Skip sections with no patterns
  if (!patternEffectiveness[sectionType] || Object.keys(patternEffectiveness[sectionType]).length === 0) {
    optimizedPatterns[sectionType] = [];
    return;
  }
  
  // Sort patterns by frequency
  const patterns = patternEffectiveness[sectionType];
  const sortedPatterns = Object.entries(patterns)
    .filter(([pattern, frequency]) => {
      // Filter out patterns with low frequency
      return frequency >= minPatternCount;
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // Take top 20 patterns
  
  // Add to optimized patterns with proper confidence scores
  optimizedPatterns[sectionType] = sortedPatterns.map(([pattern, frequency]) => ({
    text: pattern,
    confidence: confidenceStats[sectionType].average,
    frequency: frequency
  }));
  
  // Add some manual patterns with high confidence if section has few patterns
  if (optimizedPatterns[sectionType].length < 5) {
    const manualPatterns = getManualPatterns(sectionType);
    optimizedPatterns[sectionType] = [
      ...optimizedPatterns[sectionType],
      ...manualPatterns
    ];
  }
});

// Function to get manual patterns for fallback
function getManualPatterns(sectionType) {
  const patterns = {
    DEMOGRAPHICS: [
      { text: 'demographics', confidence: 0.9, frequency: 5 },
      { text: 'personal information', confidence: 0.8, frequency: 5 },
      { text: 'client information', confidence: 0.8, frequency: 5 },
      { text: 'patient information', confidence: 0.8, frequency: 5 }
    ],
    MEDICAL_HISTORY: [
      { text: 'medical history', confidence: 0.9, frequency: 5 },
      { text: 'health history', confidence: 0.8, frequency: 5 },
      { text: 'past medical', confidence: 0.8, frequency: 5 },
      { text: 'diagnoses', confidence: 0.7, frequency: 5 }
    ],
    SYMPTOMS: [
      { text: 'symptoms', confidence: 0.9, frequency: 5 },
      { text: 'complaints', confidence: 0.8, frequency: 5 },
      { text: 'chief complaint', confidence: 0.8, frequency: 5 },
      { text: 'pain', confidence: 0.7, frequency: 5 }
    ],
    FUNCTIONAL_STATUS: [
      { text: 'functional status', confidence: 0.9, frequency: 5 },
      { text: 'functional abilities', confidence: 0.8, frequency: 5 },
      { text: 'mobility', confidence: 0.7, frequency: 5 },
      { text: 'transfers', confidence: 0.7, frequency: 5 }
    ],
    TYPICAL_DAY: [
      { text: 'typical day', confidence: 0.9, frequency: 5 },
      { text: 'daily routine', confidence: 0.8, frequency: 5 },
      { text: 'daily activities', confidence: 0.8, frequency: 5 },
      { text: 'routine', confidence: 0.7, frequency: 5 }
    ],
    ENVIRONMENTAL: [
      { text: 'environmental', confidence: 0.8, frequency: 5 },
      { text: 'home environment', confidence: 0.9, frequency: 5 },
      { text: 'housing', confidence: 0.7, frequency: 5 },
      { text: 'living situation', confidence: 0.8, frequency: 5 }
    ],
    ADLS: [
      { text: 'activities of daily living', confidence: 0.9, frequency: 5 },
      { text: 'adls', confidence: 0.9, frequency: 5 },
      { text: 'self-care', confidence: 0.8, frequency: 5 },
      { text: 'personal care', confidence: 0.8, frequency: 5 }
    ],
    ATTENDANT_CARE: [
      { text: 'attendant care', confidence: 0.9, frequency: 5 },
      { text: 'caregiver', confidence: 0.8, frequency: 5 },
      { text: 'care needs', confidence: 0.8, frequency: 5 },
      { text: 'care requirements', confidence: 0.8, frequency: 5 }
    ]
  };
  
  return patterns[sectionType] || [];
}

// Clean up contextual patterns
Object.keys(contextualPatterns).forEach(section => {
  // Filter and sort before patterns
  contextualPatterns[section].before = contextualPatterns[section].before
    .filter(pattern => pattern.frequency >= 2)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);
  
  // Filter and sort after patterns
  contextualPatterns[section].after = contextualPatterns[section].after
    .filter(pattern => pattern.frequency >= 2)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);
  
  // Add manual contextual patterns if needed
  if (contextualPatterns[section].before.length < 2) {
    // Add some fallback patterns based on section
    switch (section) {
      case 'DEMOGRAPHICS':
        contextualPatterns[section].before.push(
          { text: 'assessment information', confidence: 0.7, frequency: 2 },
          { text: 'client profile', confidence: 0.7, frequency: 2 }
        );
        break;
      case 'MEDICAL_HISTORY':
        contextualPatterns[section].before.push(
          { text: 'demographics', confidence: 0.7, frequency: 2 },
          { text: 'client information', confidence: 0.7, frequency: 2 }
        );
        break;
      // Add cases for other sections as needed
    }
  }
  
  if (contextualPatterns[section].after.length < 2) {
    // Add some fallback patterns based on section
    switch (section) {
      case 'DEMOGRAPHICS':
        contextualPatterns[section].after.push(
          { text: 'date of birth', confidence: 0.7, frequency: 2 },
          { text: 'address', confidence: 0.7, frequency: 2 },
          { text: 'phone', confidence: 0.7, frequency: 2 }
        );
        break;
      case 'MEDICAL_HISTORY':
        contextualPatterns[section].after.push(
          { text: 'diagnosis', confidence: 0.7, frequency: 2 },
          { text: 'medication', confidence: 0.7, frequency: 2 },
          { text: 'surgery', confidence: 0.7, frequency: 2 }
        );
        break;
      // Add cases for other sections as needed
    }
  }
});

// Generate the final PatternMatcher.js
console.log('Generating final PatternMatcher.js...');
try {
  // Read template
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  
  // Replace placeholders
  const output = template
    .replace('PATTERNS_PLACEHOLDER', JSON.stringify(optimizedPatterns, null, 2))
    .replace('STATS_PLACEHOLDER', JSON.stringify(confidenceStats, null, 2))
    .replace('CONTEXTUAL_PATTERNS_PLACEHOLDER', JSON.stringify(contextualPatterns, null, 2));
  
  // Write output
  fs.writeFileSync(OUTPUT_PATH, output);
  
  console.log(`✅ Pattern matcher generated at: ${OUTPUT_PATH}`);
} catch (error) {
  console.error('Error generating PatternMatcher:', error.message);
  process.exit(1);
}
