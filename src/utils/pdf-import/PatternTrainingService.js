// PatternTrainingService.js
// A service for training pattern recognition based on user corrections
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

const fs = require('fs').promises;
const path = require('path');
const { nanoid } = require('nanoid');

/**
 * Service for training and improving pattern recognition capabilities
 */
class PatternTrainingService {
  constructor(options = {}) {
    this.trainingDataPath = options.trainingDataPath || path.join(__dirname, 'training-data');
    this.patternRepositoryPath = options.patternRepositoryPath || path.join(__dirname, 'patterns');
    this.confidenceThreshold = options.confidenceThreshold || 0.7;
    this.initialized = false;
    this.trainingData = {};
  }

  /**
   * Initialize the training service
   */
  async initialize() {
    try {
      // Ensure training data directory exists
      try {
        await fs.mkdir(this.trainingDataPath, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }

      // Load existing training data
      this.trainingData = await this.loadTrainingData();
      this.initialized = true;
      console.log(`[PatternTrainingService] Initialized with ${Object.keys(this.trainingData).length} training records`);
    } catch (error) {
      console.error('[PatternTrainingService] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load all training data from the filesystem
   */
  async loadTrainingData() {
    try {
      const files = await fs.readdir(this.trainingDataPath);
      const trainingData = {};
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.readFile(path.join(this.trainingDataPath, file), 'utf8');
          const record = JSON.parse(content);
          trainingData[record.id] = record;
        }
      }
      
      return trainingData;
    } catch (error) {
      console.error('[PatternTrainingService] Failed to load training data:', error);
      return {};
    }
  }

  /**
   * Record a correction to improve pattern recognition
   * @param {Object} originalExtraction - The original extraction result
   * @param {Object} correctedData - The user-corrected data
   * @param {String} documentType - Type of document
   * @returns {Promise<Object>} - The saved training record
   */
  async recordCorrection(originalExtraction, correctedData, documentType) {
    if (!this.initialized) await this.initialize();
    
    // Create a training record
    const trainingRecord = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      documentType,
      originalExtraction,
      correctedData,
      differences: this.calculateDifferences(originalExtraction, correctedData),
      patternImprovements: this.generatePatternImprovements(originalExtraction, correctedData)
    };
    
    // Save the training record
    await this.saveTrainingRecord(trainingRecord);
    
    // Update pattern weights
    await this.updatePatternWeights(trainingRecord);
    
    return trainingRecord;
  }
  
  /**
   * Save a training record to the filesystem
   * @param {Object} record - The training record to save
   */
  async saveTrainingRecord(record) {
    try {
      const filePath = path.join(this.trainingDataPath, `${record.id}.json`);
      await fs.writeFile(filePath, JSON.stringify(record, null, 2), 'utf8');
      this.trainingData[record.id] = record;
      console.log(`[PatternTrainingService] Saved training record: ${record.id}`);
    } catch (error) {
      console.error('[PatternTrainingService] Failed to save training record:', error);
      throw error;
    }
  }
  
  /**
   * Calculate differences between original extraction and corrected data
   * @param {Object} originalExtraction - The original extraction result
   * @param {Object} correctedData - The user-corrected data
   * @returns {Object} - Differences between the two
   */
  calculateDifferences(originalExtraction, correctedData) {
    const differences = {};
    
    // Process each section
    Object.keys(correctedData).forEach(section => {
      // Skip confidence and metadata
      if (section === 'confidence' || section.startsWith('_')) return;
      
      // If this section doesn't exist in original, it's all new
      if (!originalExtraction[section]) {
        differences[section] = {
          added: true,
          fields: Object.keys(correctedData[section]).reduce((acc, field) => {
            // Skip confidence and metadata
            if (field === 'confidence' || field.startsWith('_')) return acc;
            acc[field] = { 
              type: 'added', 
              original: null, 
              corrected: correctedData[section][field] 
            };
            return acc;
          }, {})
        };
        return;
      }
      
      // Compare fields within the section
      differences[section] = {
        fields: {}
      };
      
      // Check fields in corrected data
      Object.keys(correctedData[section]).forEach(field => {
        // Skip confidence and metadata
        if (field === 'confidence' || field.startsWith('_')) return;
        
        const originalValue = originalExtraction[section][field];
        const correctedValue = correctedData[section][field];
        
        // Compare values
        if (originalValue === undefined) {
          differences[section].fields[field] = { 
            type: 'added', 
            original: null, 
            corrected: correctedValue 
          };
        } else if (originalValue !== correctedValue) {
          differences[section].fields[field] = { 
            type: 'modified', 
            original: originalValue, 
            corrected: correctedValue 
          };
        }
      });
      
      // Check for removed fields (in original but not in corrected)
      Object.keys(originalExtraction[section]).forEach(field => {
        // Skip confidence and metadata
        if (field === 'confidence' || field.startsWith('_')) return;
        
        if (correctedData[section][field] === undefined) {
          differences[section].fields[field] = { 
            type: 'removed', 
            original: originalExtraction[section][field], 
            corrected: null 
          };
        }
      });
    });
    
    return differences;
  }
  
  /**
   * Generate pattern improvements based on differences
   * @param {Object} originalExtraction - The original extraction result
   * @param {Object} correctedData - The user-corrected data
   * @returns {Object} - Pattern improvements
   */
  generatePatternImprovements(originalExtraction, correctedData) {
    const improvements = {};
    const differences = this.calculateDifferences(originalExtraction, correctedData);
    
    // Process each section with differences
    Object.keys(differences).forEach(section => {
      const sectionDiffs = differences[section];
      
      // Skip if no field differences
      if (!sectionDiffs.fields || Object.keys(sectionDiffs.fields).length === 0) {
        return;
      }
      
      improvements[section] = {
        patternWeightAdjustments: {},
        newPatterns: {}
      };
      
      // Process each field difference
      Object.keys(sectionDiffs.fields).forEach(field => {
        const diff = sectionDiffs.fields[field];
        
        // Handle added or modified fields
        if (diff.type === 'added' || diff.type === 'modified') {
          // Generate potential new patterns based on corrected value
          if (typeof diff.corrected === 'string' && diff.corrected.trim().length > 0) {
            const context = this.getFieldContext(correctedData, section, field);
            const newPatterns = this.generatePatternsForValue(diff.corrected, context);
            
            improvements[section].newPatterns[field] = newPatterns;
          }
        }
        
        // If field was missing or incorrect, adjust weights
        if (diff.type === 'added' || (diff.type === 'modified' && originalExtraction[section]?.confidence?.[field] < this.confidenceThreshold)) {
          improvements[section].patternWeightAdjustments[field] = {
            decreaseWeight: originalExtraction[section]?.confidence?.[field] > 0.5 ? 0.1 : 0.05
          };
        }
      });
    });
    
    return improvements;
  }
  
  /**
   * Get context surrounding a field to help with pattern generation
   * @param {Object} data - The document data
   * @param {String} section - Section name
   * @param {String} field - Field name
   * @returns {Object} - Context information
   */
  getFieldContext(data, section, field) {
    // Default context
    const context = {
      nearbyFields: {},
      sectionText: ''
    };
    
    // If we have the original text, extract it
    if (data._originalText && data._originalText[section]) {
      context.sectionText = data._originalText[section];
    }
    
    // Get nearby fields (potential context indicators)
    if (data[section]) {
      Object.keys(data[section]).forEach(otherField => {
        if (otherField !== field && !otherField.startsWith('_') && otherField !== 'confidence') {
          const value = data[section][otherField];
          if (value !== undefined && value !== null && value !== '') {
            context.nearbyFields[otherField] = value;
          }
        }
      });
    }
    
    return context;
  }
  
  /**
   * Generate potential patterns that would match a value
   * @param {String} value - The value to generate patterns for
   * @param {Object} context - Context information
   * @returns {Array} - Array of potential patterns
   */
  generatePatternsForValue(value, context) {
    const patterns = [];
    
    if (!value || typeof value !== 'string') return patterns;
    
    // Clean and escape the value for regex
    const cleanValue = value.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Simple exact match pattern
    patterns.push({
      pattern: `\\b${cleanValue}\\b`,
      confidence: 0.9,
      description: 'Exact match'
    });
    
    // If we have section text, try to find context before/after the value
    if (context.sectionText) {
      const escapedValue = cleanValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const valueRegex = new RegExp(`(\\w+[\\s:,-]*)?${escapedValue}([\\s:,-]*\\w+)?`, 'i');
      const match = context.sectionText.match(valueRegex);
      
      if (match) {
        // If we found context before the value
        if (match[1] && match[1].trim().length > 0) {
          const before = match[1].trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          patterns.push({
            pattern: `${before}\\s*${cleanValue}`,
            confidence: 0.85,
            description: 'With preceding context'
          });
        }
        
        // If we found context after the value
        if (match[2] && match[2].trim().length > 0) {
          const after = match[2].trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          patterns.push({
            pattern: `${cleanValue}\\s*${after}`,
            confidence: 0.8,
            description: 'With following context'
          });
        }
      }
    }
    
    // Generate variations for common field patterns
    const fieldPatterns = {
      // Date patterns
      datePatterns: [
        // MM/DD/YYYY
        /\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\b/,
        // YYYY/MM/DD
        /\b(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})\b/,
        // Month D, YYYY
        /\b([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,\s+(\d{4})\b/,
        // D Month YYYY
        /\b(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})\b/
      ],
      
      // Name patterns
      namePatterns: [
        // Title Last
        /\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Miss)\s+([A-Za-z\-']+)\b/i,
        // First Last
        /\b([A-Za-z\-']+)\s+([A-Za-z\-']+)\b/
      ],
      
      // Phone patterns
      phonePatterns: [
        // (XXX) XXX-XXXX
        /\(\d{3}\)\s*\d{3}[-\.]\d{4}/,
        // XXX-XXX-XXXX
        /\d{3}[-\.]\d{3}[-\.]\d{4}/,
        // XXXXXXXXXX (10 digits)
        /\b\d{10}\b/
      ],
      
      // Address patterns
      addressPatterns: [
        // Number Street 
        /\b\d+\s+[A-Za-z0-9\s\-\.]+(?:Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Drive|Dr\.?|Lane|Ln\.?|Boulevard|Blvd\.?|Way)\b/i,
        // City, State ZIP
        /\b[A-Za-z\s\-\.]+,\s*[A-Za-z]{2}\s*\d{5}(?:-\d{4})?\b/i
      ]
    };
    
    // Check if value matches any of the common patterns
    for (const [patternType, patternList] of Object.entries(fieldPatterns)) {
      for (const pattern of patternList) {
        if (pattern.test(value)) {
          // Add general pattern for this type
          patterns.push({
            pattern: pattern.toString().slice(1, -1), // Convert RegExp to string pattern
            confidence: 0.75,
            description: `Generated from ${patternType}`
          });
          break;
        }
      }
    }
    
    return patterns;
  }
  
  /**
   * Update pattern weights based on training record
   * @param {Object} trainingRecord - The training record to apply
   */
  async updatePatternWeights(trainingRecord) {
    try {
      const { patternImprovements } = trainingRecord;
      
      // Process each section
      for (const section in patternImprovements) {
        const improvements = patternImprovements[section];
        
        // Load existing patterns for this section
        const sectionPatternFile = path.join(this.patternRepositoryPath, `${section}Extractor.js`);
        let fileExists = true;
        
        try {
          await fs.access(sectionPatternFile);
        } catch (error) {
          fileExists = false;
        }
        
        if (!fileExists) {
          console.warn(`[PatternTrainingService] No pattern file found for section: ${section}`);
          continue;
        }
        
        // Read the pattern file
        let content = await fs.readFile(sectionPatternFile, 'utf8');
        
        // Update pattern weights
        if (improvements.patternWeightAdjustments) {
          for (const field in improvements.patternWeightAdjustments) {
            const { decreaseWeight } = improvements.patternWeightAdjustments[field];
            
            // Adjust pattern weights in the file
            // This is a simplistic approach - in a real implementation, you would parse the file properly
            const weightPattern = new RegExp(`confidence\\s*:\\s*(\\d+\\.\\d+)\\s*,?\\s*// ${field} pattern`, 'g');
            content = content.replace(weightPattern, (match, weight) => {
              const newWeight = Math.max(0.1, parseFloat(weight) - decreaseWeight);
              return `confidence: ${newWeight.toFixed(2)}, // ${field} pattern`;
            });
          }
        }
        
        // Add new patterns
        if (improvements.newPatterns) {
          for (const field in improvements.newPatterns) {
            const newPatterns = improvements.newPatterns[field];
            
            if (newPatterns.length === 0) continue;
            
            // Find the field extraction function in the file
            const fieldExtractorPattern = new RegExp(`extract${field.charAt(0).toUpperCase() + field.slice(1)}\\s*\\(`, 'i');
            
            if (fieldExtractorPattern.test(content)) {
              // If we found the extractor function, add new patterns
              const patternArrayPattern = new RegExp(`const\\s+patterns\\s*=\\s*\\[([^\\]]+)\\]`, 'i');
              content = content.replace(patternArrayPattern, (match, existingPatterns) => {
                // Add new patterns to the existing array
                const newPatternsStr = newPatterns.map(p => `\n  // Added by training service\n  { pattern: /${p.pattern}/i, confidence: ${p.confidence} }`).join(',');
                return `const patterns = [${existingPatterns},${newPatternsStr}]`;
              });
            } else {
              // If we didn't find an extractor for this field, we might need to add one
              // This is a more complex task that would require analyzing the file structure
              console.warn(`[PatternTrainingService] Could not find extractor for field: ${field} in section: ${section}`);
            }
          }
        }
        
        // Write updated file back
        await fs.writeFile(sectionPatternFile, content, 'utf8');
        console.log(`[PatternTrainingService] Updated pattern file for section: ${section}`);
      }
    } catch (error) {
      console.error('[PatternTrainingService] Failed to update pattern weights:', error);
      throw error;
    }
  }
  
  /**
   * Apply training data to a set of patterns
   * @param {Object} patterns - Original patterns
   * @param {Object} trainingData - Training data to apply
   * @returns {Object} - Enhanced patterns
   */
  applyTrainingToPatterns(patterns, trainingData) {
    // Deep clone the patterns to avoid modifying the original
    const enhancedPatterns = JSON.parse(JSON.stringify(patterns));
    
    // Group training records by section and field
    const trainingBySection = {};
    
    // Process each training record
    Object.values(trainingData).forEach(record => {
      const { patternImprovements } = record;
      
      // Skip if no improvements
      if (!patternImprovements) return;
      
      // Process each section
      Object.keys(patternImprovements).forEach(section => {
        if (!trainingBySection[section]) {
          trainingBySection[section] = {
            weightAdjustments: {},
            newPatterns: {}
          };
        }
        
        const improvements = patternImprovements[section];
        
        // Process weight adjustments
        if (improvements.patternWeightAdjustments) {
          Object.keys(improvements.patternWeightAdjustments).forEach(field => {
            if (!trainingBySection[section].weightAdjustments[field]) {
              trainingBySection[section].weightAdjustments[field] = 0;
            }
            
            trainingBySection[section].weightAdjustments[field] += 
              improvements.patternWeightAdjustments[field].decreaseWeight;
          });
        }
        
        // Process new patterns
        if (improvements.newPatterns) {
          Object.keys(improvements.newPatterns).forEach(field => {
            if (!trainingBySection[section].newPatterns[field]) {
              trainingBySection[section].newPatterns[field] = [];
            }
            
            trainingBySection[section].newPatterns[field] = 
              trainingBySection[section].newPatterns[field].concat(improvements.newPatterns[field]);
          });
        }
      });
    });
    
    // Apply training to patterns
    Object.keys(trainingBySection).forEach(section => {
      if (!enhancedPatterns[section]) return;
      
      const training = trainingBySection[section];
      
      // Apply weight adjustments
      if (training.weightAdjustments) {
        Object.keys(training.weightAdjustments).forEach(field => {
          // Find relevant patterns for this field and adjust weights
          if (enhancedPatterns[section][field]) {
            // Adjust weight by a maximum of 0.3
            const adjustment = Math.min(0.3, training.weightAdjustments[field]);
            enhancedPatterns[section][field].forEach(pattern => {
              pattern.confidence = Math.max(0.1, pattern.confidence - adjustment);
            });
          }
        });
      }
      
      // Add new patterns
      if (training.newPatterns) {
        Object.keys(training.newPatterns).forEach(field => {
          if (!enhancedPatterns[section][field]) {
            enhancedPatterns[section][field] = [];
          }
          
          // Add unique new patterns
          training.newPatterns[field].forEach(newPattern => {
            // Check if we already have a similar pattern
            const exists = enhancedPatterns[section][field].some(p => 
              p.pattern === newPattern.pattern);
            
            if (!exists) {
              enhancedPatterns[section][field].push(newPattern);
            }
          });
        });
      }
    });
    
    return enhancedPatterns;
  }
  
  /**
   * Analyze training corpus to identify recurring patterns
   * @param {Object} trainingCorpus - The training corpus to analyze
   * @returns {Object} - Generated patterns
   */
  generateNewPatterns(trainingCorpus) {
    const generatedPatterns = {};
    
    // Process each document in the corpus
    trainingCorpus.forEach(document => {
      // Process each section
      Object.keys(document).forEach(section => {
        if (!generatedPatterns[section]) {
          generatedPatterns[section] = {};
        }
        
        // Process each field
        Object.keys(document[section]).forEach(field => {
          if (field === 'confidence' || field.startsWith('_')) return;
          
          if (!generatedPatterns[section][field]) {
            generatedPatterns[section][field] = [];
          }
          
          const value = document[section][field];
          if (!value || typeof value !== 'string') return;
          
          // Generate patterns for this value
          const context = this.getFieldContext(document, section, field);
          const patterns = this.generatePatternsForValue(value, context);
          
          // Add unique patterns
          patterns.forEach(pattern => {
            // Check if we already have a similar pattern
            const exists = generatedPatterns[section][field].some(p => 
              p.pattern === pattern.pattern);
            
            if (!exists) {
              generatedPatterns[section][field].push(pattern);
            }
          });
        });
      });
    });
    
    return generatedPatterns;
  }
}

module.exports = PatternTrainingService;
