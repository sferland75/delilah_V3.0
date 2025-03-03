/**
 * referralIntegration.ts
 * Service for integrating referral data across sections in Delilah V3.0
 */

import { syncClientToDemographics, getAssessmentRequirements, hasRequirement } from './referralMapper';

/**
 * Integrates referral data with demographics section data
 * 
 * @param referralData Referral data from context
 * @param demographicsData Current demographics data (can be empty)
 * @returns Updated demographics data with referral info integrated
 */
export function integrateWithDemographics(referralData: any, demographicsData: any = {}) {
  try {
    if (!referralData || !referralData.client) {
      return demographicsData;
    }
    
    // Get demographic data from referral
    const referralDemographics = syncClientToDemographics(referralData);
    
    if (!referralDemographics) {
      return demographicsData;
    }
    
    // Create a deep copy of existing demographics
    const updatedDemographics = { ...demographicsData };
    
    // Only update fields that are empty or missing in the current demographics
    Object.entries(referralDemographics).forEach(([key, value]) => {
      if (
        !updatedDemographics[key] || 
        updatedDemographics[key] === '' || 
        (Array.isArray(updatedDemographics[key]) && updatedDemographics[key].length === 0)
      ) {
        updatedDemographics[key] = value;
      }
    });
    
    // Add metadata to track source of data
    updatedDemographics._metadata = {
      ...(updatedDemographics._metadata || {}),
      referralIntegrated: true,
      referralIntegrationDate: new Date().toISOString()
    };
    
    return updatedDemographics;
  } catch (error) {
    console.error("ReferralIntegration - Error integrating with demographics:", error);
    return demographicsData;
  }
}

/**
 * Integrates referral data with purpose section data
 * 
 * @param referralData Referral data from context
 * @param purposeData Current purpose data (can be empty)
 * @returns Updated purpose data with referral info integrated
 */
export function integrateWithPurpose(referralData: any, purposeData: any = {}) {
  try {
    if (!referralData) {
      return purposeData;
    }
    
    // Get assessment requirements as purpose text
    const purposeText = getAssessmentRequirements(referralData);
    
    if (!purposeText) {
      return purposeData;
    }
    
    // Create a deep copy of existing purpose data
    const updatedPurposeData = { ...purposeData };
    
    // Add or update referral requirements section
    if (!updatedPurposeData.referralRequirements || updatedPurposeData.referralRequirements === '') {
      updatedPurposeData.referralRequirements = purposeText;
    }
    
    // If purpose statement is empty, suggest one based on referral
    if (!updatedPurposeData.purposeStatement || updatedPurposeData.purposeStatement === '') {
      const assessmentTypes = referralData.assessmentTypes || [];
      const assessmentString = assessmentTypes.join(', ');
      
      if (assessmentString) {
        updatedPurposeData.purposeStatement = 
          `The purpose of this assessment is to conduct ${assessmentString} as requested in the referral document.`;
      }
    }
    
    // Add metadata to track source of data
    updatedPurposeData._metadata = {
      ...(updatedPurposeData._metadata || {}),
      referralIntegrated: true,
      referralIntegrationDate: new Date().toISOString()
    };
    
    return updatedPurposeData;
  } catch (error) {
    console.error("ReferralIntegration - Error integrating with purpose:", error);
    return purposeData;
  }
}

/**
 * Integrates referral data with medical history section data
 * 
 * @param referralData Referral data from context
 * @param medicalHistoryData Current medical history data (can be empty)
 * @returns Updated medical history data with referral info integrated
 */
export function integrateWithMedicalHistory(referralData: any, medicalHistoryData: any = {}) {
  try {
    if (!referralData) {
      return medicalHistoryData;
    }
    
    // Create a deep copy of existing medical history data
    const updatedMedicalHistoryData = { ...medicalHistoryData };
    
    // Add injury details from referral if available
    if (referralData.dateOfLoss && (!updatedMedicalHistoryData.injuryDate || updatedMedicalHistoryData.injuryDate === '')) {
      updatedMedicalHistoryData.injuryDate = referralData.dateOfLoss;
    }
    
    // Check if specific medical conditions are mentioned in the referral
    const relevantDomains = [
      ...(referralData.domains || []),
      ...(referralData.specificRequirements || [])
    ];
    
    // Initialize context note if it doesn't exist
    if (!updatedMedicalHistoryData.referralContext || updatedMedicalHistoryData.referralContext === '') {
      updatedMedicalHistoryData.referralContext = '';
    }
    
    // Add notes about medical conditions mentioned in referral
    const medicalKeywords = [
      {keyword: 'pain', note: 'Pain management was mentioned in the referral and should be addressed.'},
      {keyword: 'medication', note: 'Medication management was mentioned in the referral and should be addressed.'},
      {keyword: 'cognitive', note: 'Cognitive impairments were mentioned in the referral and should be addressed.'},
      {keyword: 'mental health', note: 'Mental health concerns were mentioned in the referral and should be addressed.'},
      {keyword: 'psychiatric', note: 'Psychiatric conditions were mentioned in the referral and should be addressed.'},
      {keyword: 'neurolog', note: 'Neurological concerns were mentioned in the referral and should be addressed.'},
      {keyword: 'orthop', note: 'Orthopedic concerns were mentioned in the referral and should be addressed.'}
    ];
    
    // Check if any medical keywords are found in the relevant domains
    const relevantDomainsText = relevantDomains.join(' ').toLowerCase();
    const matchedNotes = medicalKeywords
      .filter(item => relevantDomainsText.includes(item.keyword.toLowerCase()))
      .map(item => item.note);
    
    if (matchedNotes.length > 0) {
      // Add notes to the context if not already present
      const notes = matchedNotes.join(' ');
      if (!updatedMedicalHistoryData.referralContext.includes(notes)) {
        updatedMedicalHistoryData.referralContext += notes;
      }
    }
    
    // Add metadata to track source of data
    updatedMedicalHistoryData._metadata = {
      ...(updatedMedicalHistoryData._metadata || {}),
      referralIntegrated: true,
      referralIntegrationDate: new Date().toISOString()
    };
    
    return updatedMedicalHistoryData;
  } catch (error) {
    console.error("ReferralIntegration - Error integrating with medical history:", error);
    return medicalHistoryData;
  }
}

/**
 * Detects section-specific requirements from referral data
 * 
 * @param referralData Referral data from context
 * @param sectionType The type of section to check for requirements
 * @returns Object containing requirements and priorities for the section
 */
export function detectSectionRequirements(referralData: any, sectionType: string) {
  if (!referralData) {
    return { hasRequirements: false, requirements: [], priorities: [] };
  }
  
  try {
    const requirements = [];
    const priorities = [];
    let hasRequirements = false;
    
    // Get all potential requirement sources
    const domains = referralData.domains || [];
    const specificRequirements = referralData.specificRequirements || [];
    const assessmentTypes = referralData.assessmentTypes || [];
    
    // Check section-specific keywords
    switch (sectionType.toUpperCase()) {
      case 'FUNCTIONAL_STATUS':
        // Check for mobility and function keywords
        const mobilityKeywords = ['mobility', 'transfer', 'function', 'walking', 'standing', 'lifting'];
        for (const keyword of mobilityKeywords) {
          if (hasRequirement(referralData, keyword)) {
            requirements.push(`Assess ${keyword} status and capabilities`);
            hasRequirements = true;
          }
        }
        
        // Check assessment types
        if (assessmentTypes.some(t => t.includes('Functional') || t.includes('function'))) {
          priorities.push('Complete functional assessment as specifically requested in referral');
          hasRequirements = true;
        }
        break;
        
      case 'TYPICAL_DAY':
        // Check for routine and daily activity keywords
        const routineKeywords = ['routine', 'daily', 'typical day', 'schedule', 'activity pattern'];
        for (const keyword of routineKeywords) {
          if (hasRequirement(referralData, keyword)) {
            requirements.push(`Document ${keyword} patterns`);
            hasRequirements = true;
          }
        }
        
        // If no specific routines mentioned but ADL assessment requested
        if (assessmentTypes.some(t => t.includes('ADL') || t.includes('daily living'))) {
          priorities.push('Document typical day to support ADL assessment');
          hasRequirements = true;
        }
        break;
        
      case 'ADLS':
        // Check for ADL keywords
        const adlKeywords = ['self-care', 'feeding', 'dressing', 'bathing', 'grooming', 'toileting'];
        for (const keyword of adlKeywords) {
          if (hasRequirement(referralData, keyword)) {
            requirements.push(`Assess ${keyword} abilities`);
            hasRequirements = true;
          }
        }
        
        // Check assessment types
        if (assessmentTypes.some(t => t.includes('ADL') || t.includes('daily living'))) {
          priorities.push('Complete detailed ADL assessment as specifically requested in referral');
          hasRequirements = true;
        }
        break;
        
      case 'ENVIRONMENTAL':
        // Check for environment keywords
        const envKeywords = ['home', 'environment', 'safety', 'accessibility', 'modification'];
        for (const keyword of envKeywords) {
          if (hasRequirement(referralData, keyword)) {
            requirements.push(`Assess ${keyword} factors`);
            hasRequirements = true;
          }
        }
        
        // Check assessment types
        if (assessmentTypes.some(t => t.includes('home') || t.includes('environmental'))) {
          priorities.push('Complete environmental assessment as specifically requested in referral');
          hasRequirements = true;
        }
        break;
        
      case 'ATTENDANT_CARE':
        // Check for attendant care keywords
        const acKeywords = ['attendant', 'care', 'assistance', 'support', 'supervision'];
        for (const keyword of acKeywords) {
          if (hasRequirement(referralData, keyword)) {
            requirements.push(`Evaluate ${keyword} needs`);
            hasRequirements = true;
          }
        }
        
        // Check assessment types
        if (assessmentTypes.some(t => t.includes('Attendant') || t.includes('Care Needs'))) {
          priorities.push('Complete Form 1 Assessment as specifically requested in referral');
          hasRequirements = true;
        }
        break;
        
      case 'SYMPTOMS':
        // Check for symptom keywords
        const symptomKeywords = ['pain', 'symptoms', 'cognitive', 'emotional', 'physical complaints'];
        for (const keyword of symptomKeywords) {
          if (hasRequirement(referralData, keyword)) {
            requirements.push(`Document ${keyword} in detail`);
            hasRequirements = true;
          }
        }
        break;
        
      default:
        // No specific requirements for this section type
        break;
    }
    
    return {
      hasRequirements,
      requirements,
      priorities
    };
  } catch (error) {
    console.error(`ReferralIntegration - Error detecting requirements for ${sectionType}:`, error);
    return { hasRequirements: false, requirements: [], priorities: [] };
  }
}

/**
 * Integrates referral data across all assessment sections
 * 
 * @param referralData Referral data from context
 * @param assessmentData Current assessment data (all sections)
 * @returns Updated assessment data with referral info integrated across sections
 */
export function integrateAcrossSections(referralData: any, assessmentData: any = {}) {
  try {
    if (!referralData) {
      return assessmentData;
    }
    
    // Create a deep copy of assessment data
    const updatedAssessmentData = { ...assessmentData };
    
    // Demographics integration
    if (updatedAssessmentData.demographics) {
      updatedAssessmentData.demographics = integrateWithDemographics(
        referralData, 
        updatedAssessmentData.demographics
      );
    }
    
    // Purpose integration
    if (updatedAssessmentData.purpose) {
      updatedAssessmentData.purpose = integrateWithPurpose(
        referralData, 
        updatedAssessmentData.purpose
      );
    }
    
    // Medical history integration
    if (updatedAssessmentData.medicalHistory) {
      updatedAssessmentData.medicalHistory = integrateWithMedicalHistory(
        referralData, 
        updatedAssessmentData.medicalHistory
      );
    }
    
    // Integration with other sections (adding requirements metadata)
    const sectionTypes = [
      'functionalStatus',
      'typicalDay',
      'adls',
      'environmental',
      'attendantCare',
      'symptoms'
    ];
    
    // Add requirement metadata to each section
    sectionTypes.forEach(sectionType => {
      if (updatedAssessmentData[sectionType]) {
        const requirements = detectSectionRequirements(referralData, sectionType);
        
        if (requirements.hasRequirements) {
          updatedAssessmentData[sectionType]._metadata = {
            ...(updatedAssessmentData[sectionType]._metadata || {}),
            referralRequirements: requirements.requirements,
            referralPriorities: requirements.priorities,
            referralIntegrated: true,
            referralIntegrationDate: new Date().toISOString()
          };
        }
      }
    });
    
    // Add overall metadata about referral integration
    updatedAssessmentData._metadata = {
      ...(updatedAssessmentData._metadata || {}),
      referralIntegrated: true,
      referralIntegrationDate: new Date().toISOString(),
      referralSource: referralData.referralSource?.organization || 'Unknown',
      referralFileName: referralData._metadata?.fileName || 'Unknown'
    };
    
    return updatedAssessmentData;
  } catch (error) {
    console.error("ReferralIntegration - Error integrating across sections:", error);
    return assessmentData;
  }
}
