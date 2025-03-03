import { SectionData } from '../../contexts/AssessmentContext';

export interface ConsistencyCheck {
  id: string;
  section: string;
  field?: string;
  term: string;
  suggestedTerm: string;
  context: string;
  inconsistentSections: string[];
  priority: 'high' | 'medium' | 'low';
}

// Terminology mappings for consistency checking
const preferredTerminology: Record<string, string[]> = {
  // Mobility terms
  'wheelchair': ['wheel chair', 'wheeled chair', 'rolling chair'],
  'ambulation': ['walking', 'walk', 'mobility', 'locomotion'],
  'gait': ['walking pattern', 'step pattern', 'walking style'],
  'assistive device': ['walking aid', 'mobility aid', 'walking assistance'],
  'transfer': ['move between surfaces', 'move from', 'repositioning', 'position change'],
  
  // Upper extremity terms
  'upper extremity': ['upper limb', 'arm', 'upper body'],
  'grip strength': ['hand strength', 'grasp strength', 'gripping power'],
  'fine motor': ['dexterity', 'finger skills', 'hand skills', 'finger dexterity'],
  'range of motion': ['ROM', 'movement range', 'joint mobility'],
  
  // ADL terms
  'activities of daily living': ['ADL', 'daily activities', 'self-care activities', 'self care tasks'],
  'instrumental activities of daily living': ['IADL', 'complex daily activities', 'advanced daily activities'],
  'toileting': ['bathroom use', 'toilet use', 'elimination'],
  'bathing': ['showering', 'cleaning self', 'hygiene', 'washing'],
  
  // General terminology
  'client': ['patient', 'individual', 'subject', 'resident'],
  'occupational therapist': ['OT', 'therapist', 'rehabilitation specialist'],
  'recommendation': ['suggestion', 'advised', 'advised to', 'suggested to'],
  'assessment': ['evaluation', 'exam', 'examination', 'testing']
};

// This service provides terminology consistency checks
export const terminologyConsistencyService = {
  // Get consistency checks for a specific section
  getConsistencyChecks: async (
    sectionName: string,
    sectionData: any,
    fullAssessmentData?: any
  ): Promise<ConsistencyCheck[]> => {
    try {
      // Convert section data to string for text searching
      const sectionText = stringifyData(sectionData);
      
      // Get terminology used in this section
      const foundTerms = findTerminology(sectionText);
      
      // If we have full assessment data, check for inconsistencies across sections
      if (fullAssessmentData) {
        return findInconsistencies(sectionName, foundTerms, fullAssessmentData);
      }
      
      return [];
    } catch (error) {
      console.error(`Error in getConsistencyChecks for ${sectionName}:`, error);
      return [];
    }
  },

  // Get all consistency checks for the entire assessment
  getAllConsistencyChecks: async (assessmentData: any): Promise<ConsistencyCheck[]> => {
    try {
      // Process each section and find terminology
      const sectionTerms: Record<string, Record<string, string>> = {};
      
      for (const [section, data] of Object.entries(assessmentData)) {
        if (section !== 'metadata' && data) {
          const sectionText = stringifyData(data);
          sectionTerms[section] = findTerminology(sectionText);
        }
      }
      
      // Look for inconsistencies across sections
      return findCrossAssessmentInconsistencies(sectionTerms, assessmentData);
    } catch (error) {
      console.error('Error in getAllConsistencyChecks:', error);
      return [];
    }
  }
};

// Helper function to stringify an object for text searching
function stringifyData(data: any): string {
  if (!data) return '';
  
  try {
    // Recursively extract all string values
    const extractStrings = (obj: any): string[] => {
      if (typeof obj === 'string') return [obj];
      if (typeof obj !== 'object' || obj === null) return [];
      
      if (Array.isArray(obj)) {
        return obj.flatMap(item => extractStrings(item));
      }
      
      return Object.values(obj).flatMap(value => extractStrings(value));
    };
    
    return extractStrings(data).join(' ');
  } catch (error) {
    console.error('Error stringifying data:', error);
    return '';
  }
}

// Find terminology used in a section
function findTerminology(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  const textLower = text.toLowerCase();
  
  // Look for non-preferred terms
  for (const [preferred, alternates] of Object.entries(preferredTerminology)) {
    for (const alternate of alternates) {
      // Use word boundary matches to avoid partial matches
      const regex = new RegExp(`\\b${alternate}\\b`, 'i');
      if (regex.test(textLower)) {
        result[alternate.toLowerCase()] = preferred.toLowerCase();
      }
    }
    
    // Also check if the preferred term is used
    const regex = new RegExp(`\\b${preferred}\\b`, 'i');
    if (regex.test(textLower)) {
      result[preferred.toLowerCase()] = preferred.toLowerCase();
    }
  }
  
  return result;
}

// Find inconsistencies across sections
function findInconsistencies(
  sectionName: string,
  sectionTerms: Record<string, string>,
  fullAssessmentData: any
): ConsistencyCheck[] {
  const checks: ConsistencyCheck[] = [];
  
  // Process each other section and compare terminology
  for (const [otherSection, data] of Object.entries(fullAssessmentData)) {
    if (otherSection === sectionName || otherSection === 'metadata' || !data) continue;
    
    const otherSectionText = stringifyData(data);
    const otherSectionTerms = findTerminology(otherSectionText);
    
    // Look for the same concept described with different terms
    for (const [term, preferredTerm] of Object.entries(sectionTerms)) {
      for (const [otherTerm, otherPreferredTerm] of Object.entries(otherSectionTerms)) {
        // If they map to the same preferred term but are different terms
        if (
          preferredTerm === otherPreferredTerm && 
          term !== otherTerm &&
          // Make sure both aren't already the preferred term
          (term !== preferredTerm || otherTerm !== otherPreferredTerm)
        ) {
          // Determine which term to suggest
          let suggestedTerm: string;
          let termToChange: string;
          let termSection: string;
          
          if (term === preferredTerm) {
            // This section uses the preferred term, suggest changing the other section
            suggestedTerm = preferredTerm;
            termToChange = otherTerm;
            termSection = otherSection;
          } else {
            // This section doesn't use the preferred term
            suggestedTerm = preferredTerm;
            termToChange = term;
            termSection = sectionName;
          }
          
          checks.push({
            id: `term-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            section: termSection,
            term: termToChange,
            suggestedTerm,
            context: `Used "${termToChange}" but preferred term is "${suggestedTerm}"`,
            inconsistentSections: [sectionName, otherSection],
            priority: 'medium'
          });
        }
      }
    }
  }
  
  return checks;
}

// Find inconsistencies across the entire assessment
function findCrossAssessmentInconsistencies(
  sectionTerms: Record<string, Record<string, string>>,
  assessmentData: any
): ConsistencyCheck[] {
  const checks: ConsistencyCheck[] = [];
  
  // Get all unique terms used across sections
  const allTerms = new Set<string>();
  const termToSections: Record<string, string[]> = {};
  
  // Map each term to sections where it's used
  for (const [section, terms] of Object.entries(sectionTerms)) {
    for (const term of Object.keys(terms)) {
      allTerms.add(term);
      if (!termToSections[term]) {
        termToSections[term] = [];
      }
      termToSections[term].push(section);
    }
  }
  
  // Check for inconsistent usage of preferred vs. non-preferred terms
  for (const [preferred, alternates] of Object.entries(preferredTerminology)) {
    const preferredLower = preferred.toLowerCase();
    const usesPreferred = new Set<string>();
    const usesAlternate: Record<string, Set<string>> = {};
    
    // Find sections using preferred vs. alternates
    for (const [section, terms] of Object.entries(sectionTerms)) {
      // Check if this section uses the preferred term
      if (terms[preferredLower] === preferredLower) {
        usesPreferred.add(section);
      }
      
      // Check if this section uses any alternate terms
      for (const alternate of alternates) {
        const alternateLower = alternate.toLowerCase();
        if (terms[alternateLower]) {
          if (!usesAlternate[alternateLower]) {
            usesAlternate[alternateLower] = new Set<string>();
          }
          usesAlternate[alternateLower].add(section);
        }
      }
    }
    
    // Create consistency checks for alternate terms
    for (const [alternate, sections] of Object.entries(usesAlternate)) {
      // Only flag if some sections use preferred and others use alternate
      if (usesPreferred.size > 0 && sections.size > 0) {
        checks.push({
          id: `term-cross-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          section: Array.from(sections)[0], // Suggest changing in first section that uses it
          term: alternate,
          suggestedTerm: preferredLower,
          context: `Inconsistent terminology across sections: "${alternate}" vs. "${preferredLower}"`,
          inconsistentSections: [...Array.from(sections), ...Array.from(usesPreferred)],
          priority: 'medium'
        });
      }
    }
  }
  
  return checks;
}
