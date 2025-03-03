// Delilah V3.0 - Pattern Recognition Integration
// Updated on 2025-03-02 - Enhanced Pattern Recognition
// FIXED VERSION - Includes all extractors and font handling fixes

import PatternMatcher from './PatternMatcher';
import EnhancedExtractor from './enhancedPdfExtractor';
import {
  DEMOGRAPHICSExtractor,
  MEDICAL_HISTORYExtractor,
  ENVIRONMENTALExtractor,
  ADLSExtractor,
  PURPOSEExtractor,
  SYMPTOMSExtractor,
  FUNCTIONAL_STATUSExtractor,
  TYPICAL_DAYExtractor,
  ATTENDANT_CAREExtractor
} from './extractors';

// Fix for the PDF.js standard font data issue
const configurePdfJs = () => {
  if (typeof window !== 'undefined' && window.pdfjsLib) {
    // Set the worker source
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
    // Configure font paths if available
    if (window.STANDARD_FONTS_PATH) {
      window.pdfjsLib.GlobalWorkerOptions.StandardFontDataUrl = window.STANDARD_FONTS_PATH;
    }
  }
};

/**
 * Process PDF text into structured data for Delilah V3.0
 * @param {string} pdfText - Text extracted from a PDF
 * @returns {Object} Structured data and confidence scores
 */
export const processPdfText = (pdfText) => {
  try {
    // Initialize PDF.js configuration
    configurePdfJs();

    // Log PDF text length for debugging
    console.log(`[PDF Import] Processing PDF text (${pdfText?.length || 0} characters)`);
    
    // Log a sample of the text for debugging
    if (pdfText && pdfText.length > 0) {
      const sampleText = pdfText.substring(0, 500).replace(/\n/g, ' ');
      console.log(`[PDF Import] Text sample: "${sampleText}..."`);
    } else {
      console.warn('[PDF Import] Warning: PDF text is empty or undefined');
      throw new Error('PDF text is empty or could not be extracted properly');
    }

    // Create pattern matcher
    const matcher = new PatternMatcher();
    console.log('[PDF Import] Pattern matcher created');

    // Detect sections in the PDF
    console.log('[PDF Import] Starting section detection');
    const sections = matcher.detectSections(pdfText);
    console.log(`[PDF Import] Detected ${sections.length} sections`);
    
    // Log detected sections for debugging
    sections.forEach(section => {
      console.log(`[PDF Import] Detected section: ${section.section} (${section.content.length} chars) - Confidence: ${section.confidence}`);
    });

    // Extract data from each section
    const result = {
      sectionConfidence: {},
      data: {}
    };

    // Map sections to extractors
    const baseExtractors = {
      'DEMOGRAPHICS': DEMOGRAPHICSExtractor,
      'MEDICAL_HISTORY': MEDICAL_HISTORYExtractor,
      'ENVIRONMENTAL': ENVIRONMENTALExtractor,
      'ADLS': ADLSExtractor,
      'PURPOSE': PURPOSEExtractor,
      'SYMPTOMS': SYMPTOMSExtractor,
      'FUNCTIONAL_STATUS': FUNCTIONAL_STATUSExtractor,
      'TYPICAL_DAY': TYPICAL_DAYExtractor,
      'ATTENDANT_CARE': ATTENDANT_CAREExtractor
    };
    
    // Enhance all extractors with better logging and fallback handling
    const extractors = EnhancedExtractor.enhanceAll(baseExtractors);
    console.log('[PDF Import] Enhanced extractors initialized');

    // Process each section
    sections.forEach(section => {
      const sectionName = section.section;
      result.sectionConfidence[sectionName] = section.confidence;

      console.log(`[PDF Import] Processing section: ${sectionName}`);
      
      // Check if we have an extractor for this section
      if (extractors[sectionName]) {
        const extractor = extractors[sectionName];
        try {
          console.log(`[PDF Import] Extracting data from ${sectionName}`);
          const extractedData = extractor.extract(section.content);
          
          // Check if extraction failed
          if (extractedData._extractionFailed) {
            console.warn(`[PDF Import] Extraction failed for ${sectionName}: ${extractedData._reason}`);
            // Include the raw content but mark it as failed extraction
            result.data[sectionName.toLowerCase()] = {
              raw: section.content,
              extractionFailed: true,
              reason: extractedData._reason,
              confidence: { overall: 0.1 }
            };
          } else {
            console.log(`[PDF Import] Data extracted from ${sectionName}`);
            // Save the extracted data
            result.data[sectionName.toLowerCase()] = extractedData;
            
            // Log extraction quality
            if (extractedData._partialExtraction) {
              console.warn(`[PDF Import] Partial extraction for ${sectionName}: ${extractedData._extractionQuality} quality`);
            }
          }
        } catch (error) {
          console.error(`[PDF Import] Error extracting data from ${sectionName} section:`, error);
          result.data[sectionName.toLowerCase()] = { 
            raw: section.content,
            error: error.message, 
            confidence: { overall: 0.1 }
          };
        }
      } else {
        // Store raw content
        console.log(`[PDF Import] No extractor available for ${sectionName}`);
        result.data[sectionName.toLowerCase()] = { 
          raw: section.content,
          notes: `No extractor implemented for ${sectionName}`,
          confidence: { overall: 0.3 }
        };
      }
    });

    console.log(`[PDF Import] PDF processing complete. Extracted data for ${Object.keys(result.data).length} sections`);
    
    // Check if we extracted meaningful data or only failed extractions
    const hasValidData = Object.values(result.data).some(data => 
      !data.extractionFailed && !data.error && 
      Object.keys(data).filter(k => k !== 'confidence' && k !== 'raw').length > 0
    );
    
    if (!hasValidData) {
      console.warn('[PDF Import] Warning: No valid data was extracted from the PDF');
      // Don't throw an error, but mark the result as potentially problematic
      result._noValidDataExtracted = true;
    }
    
    return result;
  } catch (error) {
    console.error('[PDF Import] Critical error processing PDF:', error);
    throw error;
  }
};

/**
 * Map raw section data to Delilah application model
 * @param {Object} extractedData - Data from processPdfText
 * @returns {Object} Application-ready data model
 */
export const mapToApplicationModel = (extractedData) => {
  console.log('[PDF Import] Mapping extracted data to application model');
  
  const { data, sectionConfidence } = extractedData;
  
  // Check if we have any valid data to map
  if (extractedData._noValidDataExtracted) {
    console.warn('[PDF Import] Attempting to map data, but no valid data was extracted');
  }
  
  // Initialize the model with default structure
  const model = {
    demographics: {
      name: data.demographics?.name || '',
      age: data.demographics?.age || '',
      gender: data.demographics?.gender || '',
      address: data.demographics?.address || '',
      phone: data.demographics?.phone || '',
      email: data.demographics?.email || '',
      dob: data.demographics?.dob || ''
    },
    medicalHistory: {
      conditions: data.medical_history?.conditions || [],
      medications: data.medical_history?.medications || [],
      surgeries: data.medical_history?.surgeries || [],
      allergies: data.medical_history?.allergies || [],
      primaryDiagnosis: data.medical_history?.primaryCondition || data.medical_history?.diagnosis || ''
    },
    symptoms: {
      reportedSymptoms: data.symptoms?.reportedSymptoms || [],
      painLocation: data.symptoms?.painLocation || [],
      painSeverity: data.symptoms?.painSeverity || '',
      functionalImpact: data.symptoms?.functionalImpact || []
    },
    functionalStatus: {
      mobilityStatus: data.functional_status?.mobilityStatus || '',
      transferAbility: data.functional_status?.transferAbility || '',
      balanceStatus: data.functional_status?.balanceStatus || '',
      limitations: data.functional_status?.limitations || [],
      functionalLimitations: data.functional_status?.functionalLimitations || []
    },
    environment: {
      homeType: data.environmental?.homeType || '',
      barriers: data.environmental?.barriers || [],
      recommendations: data.environmental?.recommendations || [],
      safetyRisks: data.environmental?.safetyRisks || []
    },
    adls: {
      selfCare: data.adls?.selfCare || {},
      mobility: data.adls?.mobility || {},
      instrumental: data.adls?.instrumental || {}
    },
    attendantCare: {
      caregiverInfo: data.attendant_care?.caregiverInfo || {},
      careNeeds: data.attendant_care?.careNeeds || {},
      recommendedHours: data.attendant_care?.recommendedHours || '',
      recommendations: data.attendant_care?.recommendations || []
    },
    typicalDay: {
      morningRoutine: data.typical_day?.morningRoutine || [],
      afternoonRoutine: data.typical_day?.afternoonRoutine || [],
      eveningRoutine: data.typical_day?.eveningRoutine || [],
      leisureActivities: data.typical_day?.leisureActivities || []
    },
    purpose: {
      assessmentPurpose: data.purpose?.assessmentPurpose || '',
      referralSource: data.purpose?.referralSource || '',
      methodologies: data.purpose?.methodologies || []
    },
    // Add confidence scores
    confidence: sectionConfidence
  };

  console.log('[PDF Import] Application model mapping complete');
  
  // Check if we ended up with an empty model despite having extracted data
  const hasModelData = Object.entries(model).some(([key, value]) => {
    if (key === 'confidence') return true; // Skip confidence in this check
    
    if (typeof value === 'object') {
      return Object.values(value).some(fieldValue => {
        if (Array.isArray(fieldValue)) return fieldValue.length > 0;
        if (typeof fieldValue === 'object' && fieldValue !== null) return Object.keys(fieldValue).length > 0;
        return !!fieldValue;
      });
    }
    
    return !!value;
  });
  
  if (!hasModelData) {
    console.warn('[PDF Import] Warning: Mapped application model contains no meaningful data');
  }

  return model;
};

export default {
  processPdfText,
  mapToApplicationModel,
  configurePdfJs
};
