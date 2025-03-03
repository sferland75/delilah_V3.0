// Enhanced Pattern Recognition System Index
// Main entry point for the enhanced pattern recognition system
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

const PatternMatcher = require('./PatternMatcher');
const EnhancedPatternMatcher = require('./EnhancedPatternMatcher');
const PatternTrainingService = require('./PatternTrainingService');
const DocumentClassifier = require('./DocumentClassifier');
const NLPExtractor = require('./NLPExtractor');
const EnhancedExtractor = require('./enhancedPdfExtractor');

// Original extractors
const DEMOGRAPHICSExtractor = require('./DEMOGRAPHICSExtractor');
const MEDICAL_HISTORYExtractor = require('./MEDICAL_HISTORYExtractor');
const SYMPTOMSExtractor = require('./SYMPTOMSExtractor');
const FUNCTIONAL_STATUSExtractor = require('./FUNCTIONAL_STATUSExtractor');
const ENVIRONMENTALExtractor = require('./ENVIRONMENTALExtractor');
const TYPICAL_DAYExtractor = require('./TYPICAL_DAYExtractor');
const ADLSExtractor = require('./ADLSExtractor');
const ATTENDANT_CAREExtractor = require('./ATTENDANT_CAREExtractor');

/**
 * Initialize the enhanced pattern recognition system
 * @param {Object} options - Initialization options
 * @returns {Object} - Enhanced pattern recognition system
 */
const initializeEnhancedSystem = async (options = {}) => {
  console.log('[Enhanced Pattern Recognition] Initializing enhanced system...');
  
  // Initialize training service
  const trainingService = new PatternTrainingService(options.trainingOptions || {});
  await trainingService.initialize();
  
  // Initialize document classifier
  const documentClassifier = new DocumentClassifier();
  
  // Initialize enhanced extractors
  const extractors = {
    DEMOGRAPHICS: EnhancedExtractor.enhance(DEMOGRAPHICSExtractor, 'DEMOGRAPHICS'),
    MEDICAL_HISTORY: EnhancedExtractor.enhance(MEDICAL_HISTORYExtractor, 'MEDICAL_HISTORY'),
    SYMPTOMS: EnhancedExtractor.enhance(SYMPTOMSExtractor, 'SYMPTOMS'),
    FUNCTIONAL_STATUS: EnhancedExtractor.enhance(FUNCTIONAL_STATUSExtractor, 'FUNCTIONAL_STATUS'),
    ENVIRONMENTAL: EnhancedExtractor.enhance(ENVIRONMENTALExtractor, 'ENVIRONMENTAL'),
    TYPICAL_DAY: EnhancedExtractor.enhance(TYPICAL_DAYExtractor, 'TYPICAL_DAY'),
    ADLS: EnhancedExtractor.enhance(ADLSExtractor, 'ADLS'),
    ATTENDANT_CARE: EnhancedExtractor.enhance(ATTENDANT_CAREExtractor, 'ATTENDANT_CARE')
  };
  
  // Initialize enhanced pattern matcher
  const enhancedMatcher = new EnhancedPatternMatcher(
    PatternMatcher.patterns,
    trainingService.trainingData
  );
  enhancedMatcher.setDocumentClassifier(documentClassifier);
  
  // Initialize NLP extractor
  const nlpExtractor = new NLPExtractor();
  
  console.log('[Enhanced Pattern Recognition] Enhanced system initialized successfully');
  
  return {
    // Core components
    enhancedMatcher,
    trainingService,
    documentClassifier,
    extractors,
    nlpExtractor,
    
    // Main processing functions
    /**
     * Process a document with enhanced pattern recognition
     * @param {String} text - Document text content
     * @returns {Object} - Processing results
     */
    processDocument: (text) => {
      return enhancedMatcher.processDocument(text);
    },
    
    /**
     * Train the system with a correction
     * @param {Object} originalExtraction - Original extraction result
     * @param {Object} correctedData - User-corrected data
     * @param {String} documentType - Document type
     * @returns {Promise<Object>} - Training record
     */
    trainWithCorrection: async (originalExtraction, correctedData, documentType) => {
      return await trainingService.recordCorrection(
        originalExtraction, 
        correctedData, 
        documentType
      );
    },
    
    /**
     * Enhance extraction with NLP capabilities
     * @param {Object} extractionResult - Basic extraction result
     * @returns {Object} - Enhanced extraction with NLP analysis
     */
    enhanceWithNLP: (extractionResult) => {
      const enhanced = { ...extractionResult };
      
      // Add NLP analysis
      enhanced._nlpAnalysis = {
        entityRelationships: {},
        severity: {},
        temporal: {}
      };
      
      // Process each section with NLP
      Object.keys(enhanced).forEach(section => {
        if (section.startsWith('_') || !enhanced[section]) return;
        
        // Get section text from original text if available
        const sectionText = enhanced._originalText && enhanced._originalText[section] ?
          enhanced._originalText[section] : '';
        
        if (!sectionText) return;
        
        // Extract entity relationships
        const entityRelationships = nlpExtractor.extractEntityRelationships(sectionText);
        if (entityRelationships.entities.length > 0 || entityRelationships.relationships.length > 0) {
          enhanced._nlpAnalysis.entityRelationships[section] = entityRelationships;
        }
        
        // Classify severity
        const severity = nlpExtractor.classifyTextualSeverity(sectionText);
        if (severity.overall || Object.keys(severity.specific).length > 0) {
          enhanced._nlpAnalysis.severity[section] = severity;
        }
        
        // Extract temporal information
        const temporal = nlpExtractor.extractTemporalInformation(sectionText);
        if (temporal.dates.length > 0 || temporal.durations.length > 0 || temporal.frequencies.length > 0) {
          enhanced._nlpAnalysis.temporal[section] = temporal;
        }
      });
      
      return enhanced;
    }
  };
};

module.exports = {
  initializeEnhancedSystem,
  PatternMatcher,
  EnhancedPatternMatcher,
  PatternTrainingService,
  DocumentClassifier,
  NLPExtractor,
  EnhancedExtractor
};
