/**
 * IHA Pattern Recognition Training Script
 * 
 * This script processes all IHA files (PDF and DOCX) in the specified directory,
 * uses the enhanced pattern recognition system to extract structured data,
 * and saves the results for analysis.
 * 
 * The goal is to build a comprehensive pattern recognition model
 * from all available IHA documents.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const mkdir = util.promisify(fs.mkdir);
const pdfjsLib = require('pdfjs-dist');
const mammoth = require('mammoth');

// Fix for the PDF.js standard font data warnings
// Configure standard fonts path for PDF.js
const standardFontsPath = path.resolve('./public/standard_fonts/');
pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve('./node_modules/pdfjs-dist/build/pdf.worker.js');
// Make sure standardFontsPath ends with a path separator
const formattedStandardFontsPath = standardFontsPath.endsWith(path.sep) ? 
                                  standardFontsPath : 
                                  standardFontsPath + path.sep;
pdfjsLib.GlobalWorkerOptions.standardFontDataUrl = formattedStandardFontsPath;

console.log('PDF.js configured with standard fonts at:', formattedStandardFontsPath);

// Set up paths - UPDATED TO CORRECT DIRECTORY
const IHA_DIR = path.join('d:', 'delilah-agentic', 'IHAs');
const RESULTS_DIR = path.join('d:', 'delilah', 'pattern_recognition', 'training_results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Import pattern recognition modules
const PatternMatcher = require('./src/utils/pdf-import/PatternMatcher');
const extractors = require('./src/utils/pdf-import/extractors');

// Initialize pattern matcher
const patternMatcher = new PatternMatcher();

// Create a meta-analysis file to track patterns and confidence
const metaAnalysis = {
  processedFiles: 0,
  sectionOccurrences: {},
  confidenceScores: {},
  fieldExtraction: {},
  patternMatches: {},
  startTime: new Date().toISOString()
};

/**
 * Process a single PDF file
 */
async function processPdfFile(filePath) {
  console.log(`Processing PDF: ${path.basename(filePath)}`);
  
  try {
    // Read the PDF file
    const data = await readFile(filePath);
    const pdfBuffer = new Uint8Array(data);
    
    // Load the PDF document with standard fonts configuration
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBuffer,
      standardFontDataUrl: formattedStandardFontsPath
    });
    
    const pdf = await loadingTask.promise;
    
    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    // Process the text with pattern matcher
    return processText(fullText, path.basename(filePath));
  } catch (error) {
    console.error(`Error processing PDF ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Process a single DOCX file
 */
async function processDocxFile(filePath) {
  console.log(`Processing DOCX: ${path.basename(filePath)}`);
  
  try {
    // Extract text from DOCX
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;
    
    // Process the text with pattern matcher
    return processText(text, path.basename(filePath));
  } catch (error) {
    console.error(`Error processing DOCX ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Process text with pattern recognition
 */
async function processText(text, fileName) {
  try {
    // Detect sections using pattern matcher
    const sections = patternMatcher.detectSections(text);
    console.log(`Detected ${sections.length} sections in ${fileName}`);
    
    // Process each section with its specialized extractor
    const extractedData = {
      fileName,
      originalText: text,
      sections: {},
      sectionConfidence: {},
      data: {}
    };
    
    // Track which sections are found
    sections.forEach(section => {
      const sectionName = section.section;
      
      // Track section occurrence
      if (!metaAnalysis.sectionOccurrences[sectionName]) {
        metaAnalysis.sectionOccurrences[sectionName] = 0;
      }
      metaAnalysis.sectionOccurrences[sectionName]++;
      
      // Track confidence scores
      if (!metaAnalysis.confidenceScores[sectionName]) {
        metaAnalysis.confidenceScores[sectionName] = {
          sum: 0,
          count: 0,
          min: 1,
          max: 0
        };
      }
      metaAnalysis.confidenceScores[sectionName].sum += section.confidence;
      metaAnalysis.confidenceScores[sectionName].count++;
      metaAnalysis.confidenceScores[sectionName].min = Math.min(
        metaAnalysis.confidenceScores[sectionName].min, 
        section.confidence
      );
      metaAnalysis.confidenceScores[sectionName].max = Math.max(
        metaAnalysis.confidenceScores[sectionName].max, 
        section.confidence
      );
      
      // Store section data
      extractedData.sections[sectionName] = section.content;
      extractedData.sectionConfidence[sectionName] = section.confidence;
      
      // Try to extract detailed data if we have an extractor
      const extractorKey = `${sectionName}Extractor`;
      if (extractors[extractorKey]) {
        try {
          const extractor = extractors[extractorKey];
          const extractedSectionData = extractor.extract(section.content);
          
          // Store extracted data
          extractedData.data[sectionName] = extractedSectionData;
          
          // Track field extraction success
          Object.keys(extractedSectionData).forEach(field => {
            if (field !== 'confidence') {
              const key = `${sectionName}.${field}`;
              if (!metaAnalysis.fieldExtraction[key]) {
                metaAnalysis.fieldExtraction[key] = 0;
              }
              
              // Only count non-empty values
              const value = extractedSectionData[field];
              if (value !== null && value !== undefined && 
                  ((typeof value === 'string' && value.trim() !== '') ||
                   (Array.isArray(value) && value.length > 0) ||
                   (typeof value === 'object' && Object.keys(value).length > 0))) {
                metaAnalysis.fieldExtraction[key]++;
              }
            }
          });
          
          // Track pattern matches
          if (section.matchDetails) {
            section.matchDetails.forEach(match => {
              const key = `${sectionName}.${match.type}`;
              if (!metaAnalysis.patternMatches[key]) {
                metaAnalysis.patternMatches[key] = {};
              }
              if (!metaAnalysis.patternMatches[key][match.pattern]) {
                metaAnalysis.patternMatches[key][match.pattern] = 0;
              }
              metaAnalysis.patternMatches[key][match.pattern]++;
            });
          }
        } catch (error) {
          console.error(`Error extracting data from ${sectionName} in ${fileName}:`, error.message);
          extractedData.data[sectionName] = { error: error.message };
        }
      } else {
        console.warn(`No extractor available for "${sectionName}" section`);
      }
    });
    
    return extractedData;
  } catch (error) {
    console.error(`Error processing text from ${fileName}:`, error.message);
    return null;
  }
}

/**
 * Save results to file
 */
async function saveResults(results) {
  try {
    // Save individual file results
    for (const result of results) {
      if (result) {
        const outputPath = path.join(RESULTS_DIR, `${result.fileName.replace(/\.[^/.]+$/, '')}_analysis.json`);
        await writeFile(outputPath, JSON.stringify(result, null, 2));
      }
    }
    
    // Calculate averages for meta-analysis
    Object.keys(metaAnalysis.confidenceScores).forEach(section => {
      const data = metaAnalysis.confidenceScores[section];
      data.average = data.sum / data.count;
    });
    
    // Save meta-analysis
    metaAnalysis.endTime = new Date().toISOString();
    metaAnalysis.processingTime = new Date() - new Date(metaAnalysis.startTime);
    metaAnalysis.totalFiles = results.filter(r => r).length;
    
    const metaOutputPath = path.join(RESULTS_DIR, 'meta_analysis.json');
    await writeFile(metaOutputPath, JSON.stringify(metaAnalysis, null, 2));
    
    // Generate a summary report
    const summary = generateSummaryReport(results, metaAnalysis);
    const summaryPath = path.join(RESULTS_DIR, 'summary_report.md');
    await writeFile(summaryPath, summary);
    
    console.log(`Results saved to ${RESULTS_DIR}`);
  } catch (error) {
    console.error('Error saving results:', error.message);
  }
}

/**
 * Generate a human-readable summary report
 */
function generateSummaryReport(results, metaAnalysis) {
  const validResults = results.filter(r => r);
  
  // Create markdown report
  let report = `# Pattern Recognition Analysis Report\n\n`;
  report += `**Generated on:** ${new Date().toISOString()}\n`;
  report += `**Files Analyzed:** ${validResults.length}\n`;
  report += `**Processing Time:** ${Math.round(metaAnalysis.processingTime / 1000)} seconds\n\n`;
  
  // Section occurrences
  report += `## Section Detection\n\n`;
  report += `| Section | Occurrences | Avg. Confidence | Min | Max |\n`;
  report += `|---------|-------------|----------------|-----|-----|\n`;
  
  Object.keys(metaAnalysis.sectionOccurrences)
    .sort((a, b) => metaAnalysis.sectionOccurrences[b] - metaAnalysis.sectionOccurrences[a])
    .forEach(section => {
      const occurrences = metaAnalysis.sectionOccurrences[section];
      const confidence = metaAnalysis.confidenceScores[section];
      report += `| ${section} | ${occurrences} | ${(confidence.average * 100).toFixed(1)}% | ${(confidence.min * 100).toFixed(1)}% | ${(confidence.max * 100).toFixed(1)}% |\n`;
    });
    
  // Field extraction success
  report += `\n## Field Extraction Success\n\n`;
  report += `| Field | Successful Extractions | Success Rate |\n`;
  report += `|-------|------------------------|-------------|\n`;
  
  Object.keys(metaAnalysis.fieldExtraction)
    .sort((a, b) => metaAnalysis.fieldExtraction[b] - metaAnalysis.fieldExtraction[a])
    .forEach(field => {
      const extractions = metaAnalysis.fieldExtraction[field];
      const successRate = (extractions / validResults.length * 100).toFixed(1);
      report += `| ${field} | ${extractions} | ${successRate}% |\n`;
    });
  
  // Top pattern matches
  report += `\n## Most Effective Patterns\n\n`;
  
  Object.keys(metaAnalysis.patternMatches).forEach(patternType => {
    const patterns = metaAnalysis.patternMatches[patternType];
    if (Object.keys(patterns).length > 0) {
      report += `\n### ${patternType}\n\n`;
      report += `| Pattern | Matches |\n`;
      report += `|---------|--------|\n`;
      
      Object.entries(patterns)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10) // Top 10 patterns
        .forEach(([pattern, count]) => {
          // Truncate very long patterns
          const displayPattern = pattern.length > 50 ? pattern.substring(0, 47) + '...' : pattern;
          report += `| \`${displayPattern}\` | ${count} |\n`;
        });
    }
  });
  
  // Recommendations
  report += `\n## Recommendations\n\n`;
  
  // Low confidence sections
  const lowConfidenceSections = Object.entries(metaAnalysis.confidenceScores)
    .filter(([_, conf]) => conf.average < 0.6)
    .map(([section, _]) => section);
    
  if (lowConfidenceSections.length > 0) {
    report += `### Improve Pattern Recognition For:\n\n`;
    lowConfidenceSections.forEach(section => {
      report += `- ${section}\n`;
    });
  }
  
  // Low extraction success fields
  const lowExtractionFields = Object.entries(metaAnalysis.fieldExtraction)
    .filter(([_, count]) => count / validResults.length < 0.5)
    .map(([field, _]) => field);
    
  if (lowExtractionFields.length > 0) {
    report += `\n### Improve Data Extraction For:\n\n`;
    lowExtractionFields.slice(0, 10).forEach(field => {
      report += `- ${field}\n`;
    });
    
    if (lowExtractionFields.length > 10) {
      report += `- ...and ${lowExtractionFields.length - 10} more fields\n`;
    }
  }
  
  return report;
}

/**
 * Main function to process all IHA files
 */
async function processAllFiles() {
  try {
    // Get all files in the IHA directory
    const files = await readdir(IHA_DIR);
    
    // Filter PDF and DOCX files
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'))
                         .map(file => path.join(IHA_DIR, file));
    
    const docxFiles = files.filter(file => file.toLowerCase().endsWith('.docx'))
                          .map(file => path.join(IHA_DIR, file));
    
    console.log(`Found ${pdfFiles.length} PDF files and ${docxFiles.length} DOCX files to process`);
    
    // Process all PDF files
    const pdfResults = [];
    for (const file of pdfFiles) {
      const result = await processPdfFile(file);
      if (result) pdfResults.push(result);
    }
    
    // Process all DOCX files
    const docxResults = [];
    for (const file of docxFiles) {
      const result = await processDocxFile(file);
      if (result) docxResults.push(result);
    }
    
    // Combine results
    const allResults = [...pdfResults, ...docxResults];
    
    // Save results
    await saveResults(allResults);
    
    console.log(`Processing complete! Analyzed ${allResults.length} files.`);
    console.log(`Results saved to ${RESULTS_DIR}`);
  } catch (error) {
    console.error('Error processing files:', error.message);
  }
}

// Run the main function
processAllFiles().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
