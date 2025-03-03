// Delilah V3.0 Pattern Recognition - Pattern Analysis Script
// This script analyzes PDFs in the expanded dataset to identify common patterns for section detection

const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');

// Configure PDF.js worker
const WORKER_SRC = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');
if (typeof window === 'undefined') {
  // In Node.js environment
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
}

// Paths
const DATASET_PATH = path.join(__dirname, '../pattern_repository/expanded_dataset');
const OUTPUT_PATH = path.join(__dirname, '../pattern_repository/analysis_results');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_PATH)) {
  fs.mkdirSync(OUTPUT_PATH, { recursive: true });
}

// Section keywords to look for
const SECTION_PATTERNS = {
  'DEMOGRAPHICS': [
    'demographics', 'personal information', 'client information', 'patient information',
    'client details', 'patient details', 'personal details'
  ],
  'MEDICAL_HISTORY': [
    'medical history', 'medical conditions', 'health history', 'past medical history',
    'diagnoses', 'conditions', 'medications'
  ],
  'SYMPTOMS': [
    'symptoms', 'complaints', 'chief complaint', 'presenting complaint',
    'reported symptoms', 'pain', 'discomfort'
  ],
  'FUNCTIONAL_STATUS': [
    'functional status', 'function', 'functional abilities', 'functional assessment',
    'mobility', 'transfers', 'balance'
  ],
  'TYPICAL_DAY': [
    'typical day', 'daily routine', 'daily activities', 'daily pattern',
    'routine', 'morning routine', 'evening routine'
  ],
  'ENVIRONMENTAL': [
    'environmental', 'home environment', 'housing', 'living situation',
    'accessibility', 'home assessment', 'physical environment'
  ],
  'ADLS': [
    'activities of daily living', 'adls', 'self-care', 'personal care',
    'bathing', 'dressing', 'grooming'
  ],
  'ATTENDANT_CARE': [
    'attendant care', 'caregiver', 'care needs', 'care requirements',
    'support person', 'assistance', 'help'
  ],
  'PURPOSE': [
    'purpose', 'purpose of assessment', 'reason for assessment', 'referral reason',
    'objective', 'goals', 'methodology'
  ],
  'REFERRAL': [
    'referral', 'referral information', 'referral details', 'referred by',
    'referring', 'referred', 'insurance'
  ]
};

// Structure to store found patterns
const patternData = {
  documents: {
    total: 0,
    processed: 0,
    failed: 0
  },
  sections: {},
  patternMatches: {},
  contextualClues: {}
};

// Initialize data structure for each section
Object.keys(SECTION_PATTERNS).forEach(section => {
  patternData.sections[section] = {
    found: 0,
    notFound: 0,
    confidence: 0,
    patterns: {},
    contextBefore: [],
    contextAfter: []
  };
  
  patternData.patternMatches[section] = {};
  patternData.contextualClues[section] = {
    beforeSection: {},
    afterSection: {}
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
 * Find section patterns in text
 * @param {string} text - The text to search
 * @returns {Object} - Matched sections with their positions
 */
function findSectionPatterns(text) {
  const results = {};
  const lines = text.split('\n');
  
  // For each section, look for its patterns
  Object.entries(SECTION_PATTERNS).forEach(([section, patterns]) => {
    results[section] = {
      found: false,
      positions: [],
      matches: []
    };
    
    // Check each line for section patterns
    lines.forEach((line, lineIndex) => {
      const lowerLine = line.toLowerCase().trim();
      
      patterns.forEach(pattern => {
        // Try different pattern matching approaches
        
        // 1. Exact match
        const exactMatch = lowerLine === pattern;
        
        // 2. Starts with pattern
        const startsWithPattern = lowerLine.startsWith(pattern);
        
        // 3. Contains pattern with separators
        const containsWithSeparator = 
          lowerLine.startsWith(`${pattern}:`) || 
          lowerLine.startsWith(`${pattern}-`) ||
          lowerLine.startsWith(`${pattern} -`) ||
          lowerLine.includes(`: ${pattern}`) ||
          lowerLine.match(new RegExp(`^\\d+\\.?\\s*${pattern}`, 'i'));
        
        // 4. Standalone pattern (surrounded by spaces, punctuation, or start/end of line)
        const standalonePattern = lowerLine.match(new RegExp(`(^|\\s)${pattern}(\\s|$|:|,|\\.|;)`, 'i'));
        
        if (exactMatch || startsWithPattern || containsWithSeparator || standalonePattern) {
          results[section].found = true;
          results[section].positions.push(lineIndex);
          results[section].matches.push({
            line: lowerLine,
            pattern,
            matchType: exactMatch ? 'exact' : 
                       startsWithPattern ? 'startsWith' : 
                       containsWithSeparator ? 'withSeparator' : 
                       'standalone'
          });
          
          // Store the pattern match data
          patternData.patternMatches[section][pattern] = (patternData.patternMatches[section][pattern] || 0) + 1;
          
          // Store contextual clues (lines before and after)
          if (lineIndex > 0) {
            const beforeLine = lines[lineIndex - 1].toLowerCase().trim();
            if (beforeLine.length > 0) {
              patternData.contextualClues[section].beforeSection[beforeLine] = 
                (patternData.contextualClues[section].beforeSection[beforeLine] || 0) + 1;
            }
          }
          
          if (lineIndex < lines.length - 1) {
            const afterLine = lines[lineIndex + 1].toLowerCase().trim();
            if (afterLine.length > 0) {
              patternData.contextualClues[section].afterSection[afterLine] = 
                (patternData.contextualClues[section].afterSection[afterLine] || 0) + 1;
            }
          }
        }
      });
    });
    
    // Update found/not found statistics
    if (results[section].found) {
      patternData.sections[section].found++;
    } else {
      patternData.sections[section].notFound++;
    }
  });
  
  return results;
}

/**
 * Analyze all PDFs in the dataset
 */
async function analyzeDataset() {
  console.log('Starting pattern analysis...');
  
  // Get all PDF files in the dataset directory
  const files = fs.readdirSync(DATASET_PATH)
    .filter(file => file.toLowerCase().endsWith('.pdf'))
    .map(file => path.join(DATASET_PATH, file));
  
  patternData.documents.total = files.length;
  console.log(`Found ${files.length} PDF files to analyze.`);
  
  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = path.basename(file);
    
    console.log(`Processing file ${i + 1} of ${files.length}: ${filename}`);
    
    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      
      // Find section patterns
      const results = findSectionPatterns(text);
      
      // Store results for this file
      fs.writeFileSync(
        path.join(OUTPUT_PATH, `${filename.replace('.pdf', '')}_patterns.json`),
        JSON.stringify(results, null, 2)
      );
      
      patternData.documents.processed++;
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
      patternData.documents.failed++;
    }
    
    // Calculate progress
    const progress = Math.round(((i + 1) / files.length) * 100);
    console.log(`Progress: ${progress}% complete`);
  }
  
  // Calculate section confidence scores
  Object.keys(patternData.sections).forEach(section => {
    const found = patternData.sections[section].found;
    const total = found + patternData.sections[section].notFound;
    patternData.sections[section].confidence = total > 0 ? found / total : 0;
  });
  
  // Save summary results
  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'analysis_summary.json'),
    JSON.stringify(patternData, null, 2)
  );
  
  console.log('Pattern analysis completed.');
  console.log(`Processed ${patternData.documents.processed} of ${patternData.documents.total} files.`);
  console.log(`Failed: ${patternData.documents.failed} files.`);
  
  // Log section detection statistics
  console.log('\nSection detection statistics:');
  Object.entries(patternData.sections).forEach(([section, data]) => {
    const total = data.found + data.notFound;
    const percentage = total > 0 ? Math.round((data.found / total) * 100) : 0;
    console.log(`${section}: Found in ${data.found}/${total} documents (${percentage}%)`);
  });
}

// Run the analysis
analyzeDataset().catch(error => {
  console.error('Analysis failed:', error);
  process.exit(1);
});
