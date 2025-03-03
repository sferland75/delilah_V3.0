import { generateWithClaude } from '../claude';
import { SectionData } from '../../contexts/AssessmentContext';

export interface Suggestion {
  id: string;
  section: string;
  field?: string;
  suggestion: string;
  context: string;
  priority: 'high' | 'medium' | 'low';
  type: 'addition' | 'modification' | 'clarification';
}

// This service provides contextual suggestions based on the assessment data
export const contextualSuggestionService = {
  // Get suggestions for a specific section
  getSuggestions: async (
    sectionName: string,
    sectionData: any,
    fullAssessmentData?: any
  ): Promise<Suggestion[]> => {
    try {
      // For sections that don't use Claude API, use rule-based suggestions
      if (sectionName === 'medicalHistory') {
        return getMedicalHistorySuggestions(sectionData, fullAssessmentData);
      } else if (sectionName === 'symptomsAssessment') {
        return getSymptomsAssessmentSuggestions(sectionData, fullAssessmentData);
      } else if (sectionName === 'functionalStatus') {
        return getFunctionalStatusSuggestions(sectionData, fullAssessmentData);
      }

      // For sections that benefit from NLP, use Claude
      const prompt = createSuggestionPrompt(sectionName, sectionData, fullAssessmentData);
      
      const result = await generateWithClaude(prompt, {
        temperature: 0.2,
        maxTokens: 1000,
        // Cache based on section and a hash of the data to avoid repeated calls
        cacheKey: `suggestions_${sectionName}_${JSON.stringify(sectionData).length}`
      });

      if (result.error) {
        console.error(`Error generating suggestions for ${sectionName}:`, result.error);
        return [];
      }

      return parseSuggestionsFromLLM(result.content, sectionName);
    } catch (error) {
      console.error(`Error in getSuggestions for ${sectionName}:`, error);
      return [];
    }
  },

  // Get all suggestions for the entire assessment
  getAllSuggestions: async (assessmentData: any): Promise<Record<string, Suggestion[]>> => {
    const result: Record<string, Suggestion[]> = {};
    
    for (const [section, data] of Object.entries(assessmentData)) {
      if (section !== 'metadata' && data) {
        result[section] = await contextualSuggestionService.getSuggestions(
          section, 
          data as SectionData,
          assessmentData
        );
      }
    }
    
    return result;
  }
};

// Helper functions for rule-based suggestions

// Medical History specific suggestions
function getMedicalHistorySuggestions(
  medicalHistoryData: any,
  fullAssessmentData?: any
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Check for conditions that might require additional clarification
  if (medicalHistoryData?.conditions?.length > 0) {
    for (const condition of medicalHistoryData.conditions) {
      // If a condition is listed but has minimal details
      if (condition.name && (!condition.details || condition.details.length < 10)) {
        suggestions.push({
          id: `mh-condition-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          section: 'medicalHistory',
          field: 'conditions',
          suggestion: `Consider adding more details about "${condition.name}" including onset date, treatment, and how it impacts daily function.`,
          context: `The condition "${condition.name}" has limited details.`,
          priority: 'medium',
          type: 'clarification'
        });
      }
    }
  }

  // Check for common missing medical information
  if (!medicalHistoryData?.medications || medicalHistoryData.medications.length === 0) {
    // Check if symptoms or conditions suggest medications might be present
    if (
      fullAssessmentData?.symptomsAssessment?.physicalSymptoms?.some((s: any) => 
        s.severity === 'severe' || s.severity === 'moderate'
      )
    ) {
      suggestions.push({
        id: `mh-meds-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        section: 'medicalHistory',
        field: 'medications',
        suggestion: 'Consider asking about medications, as there are moderate to severe symptoms reported but no medications listed.',
        context: 'Symptoms reported without corresponding medications.',
        priority: 'high',
        type: 'addition'
      });
    }
  }

  return suggestions;
}

// Symptoms Assessment specific suggestions
function getSymptomsAssessmentSuggestions(
  symptomsData: any,
  fullAssessmentData?: any
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Check for symptoms that lack impact details
  if (symptomsData?.physicalSymptoms?.length > 0) {
    for (const symptom of symptomsData.physicalSymptoms) {
      if (symptom.severity === 'severe' && (!symptom.impact || symptom.impact.length < 15)) {
        suggestions.push({
          id: `sa-symptom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          section: 'symptomsAssessment',
          field: 'physicalSymptoms',
          suggestion: `The symptom "${symptom.name}" is rated as severe but has limited details about its impact on daily function.`,
          context: `Severe symptom with minimal impact description.`,
          priority: 'high',
          type: 'clarification'
        });
      }
    }
  }

  // Check for cognitive symptoms relation to functional status
  if (
    symptomsData?.cognitiveSymptoms?.length > 0 && 
    fullAssessmentData?.functionalStatus
  ) {
    const hasCognitiveSymptomsButNoImpact = 
      symptomsData.cognitiveSymptoms.some((s: any) => s.severity === 'moderate' || s.severity === 'severe') &&
      !fullAssessmentData.functionalStatus.cognitiveFunctioning;
    
    if (hasCognitiveSymptomsButNoImpact) {
      suggestions.push({
        id: `sa-cog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        section: 'functionalStatus',
        field: 'cognitiveFunctioning',
        suggestion: 'Consider adding details about cognitive functioning impacts, as moderate to severe cognitive symptoms are reported.',
        context: 'Cognitive symptoms reported without corresponding functional impacts.',
        priority: 'medium',
        type: 'addition'
      });
    }
  }

  return suggestions;
}

// Functional Status specific suggestions
function getFunctionalStatusSuggestions(
  functionalStatusData: any,
  fullAssessmentData?: any
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Check for mobility issues that should be addressed in environmental assessment
  if (
    functionalStatusData?.mobilityAssessment?.assistiveDevices?.length > 0 &&
    fullAssessmentData?.environmentalAssessment
  ) {
    const hasDevicesButNoAccessibility = 
      functionalStatusData.mobilityAssessment.assistiveDevices.some((d: any) => 
        d.type === 'wheelchair' || d.type === 'walker'
      ) &&
      (!fullAssessmentData.environmentalAssessment.accessibilityIssues || 
       fullAssessmentData.environmentalAssessment.accessibilityIssues.length === 0);
    
    if (hasDevicesButNoAccessibility) {
      suggestions.push({
        id: `fs-access-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        section: 'environmentalAssessment',
        field: 'accessibilityIssues',
        suggestion: 'Consider adding details about home accessibility, as mobility devices are used but no accessibility issues are documented.',
        context: 'Mobility devices reported without corresponding accessibility assessment.',
        priority: 'high',
        type: 'addition'
      });
    }
  }

  return suggestions;
}

// Create a prompt for Claude to generate suggestions
function createSuggestionPrompt(
  sectionName: string,
  sectionData: any,
  fullAssessmentData?: any
): string {
  return `
You are an assistant helping an occupational therapist with an assessment report.
Based on the data provided about the "${sectionName}" section, suggest improvements, additions, or clarifications.

Section data:
${JSON.stringify(sectionData, null, 2)}

${fullAssessmentData ? `
Context from other sections:
${JSON.stringify(
  Object.fromEntries(
    Object.entries(fullAssessmentData).filter(([key]) => key !== sectionName)
  ),
  null, 2
)}
` : ''}

Your task is to identify missing information, contradictions, or areas that need clarification.
Format your response as a JSON array of suggestion objects with these properties:
- id: A unique string ID
- section: The section this suggestion applies to (usually "${sectionName}")
- field: The specific field within the section (optional)
- suggestion: A clear suggestion for improvement
- context: What triggered this suggestion
- priority: "high", "medium", or "low"
- type: "addition", "modification", or "clarification"

Example:
[
  {
    "id": "unique-id-1",
    "section": "${sectionName}",
    "field": "specificField",
    "suggestion": "Consider adding more details about X",
    "context": "X is mentioned but lacks detail",
    "priority": "medium",
    "type": "clarification"
  }
]

Provide only JSON with no additional text.
`;
}

// Parse suggestions from Claude's response
function parseSuggestionsFromLLM(response: string, sectionName: string): Suggestion[] {
  try {
    // Extract JSON array from response (handling potential text before/after JSON)
    const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
    if (!jsonMatch) return [];
    
    const suggestions = JSON.parse(jsonMatch[0]) as Suggestion[];
    
    // Validate and sanitize suggestions
    return suggestions.map(suggestion => ({
      ...suggestion,
      id: suggestion.id || `${sectionName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      section: suggestion.section || sectionName,
      priority: ['high', 'medium', 'low'].includes(suggestion.priority) 
        ? suggestion.priority as 'high' | 'medium' | 'low' 
        : 'medium',
      type: ['addition', 'modification', 'clarification'].includes(suggestion.type) 
        ? suggestion.type as 'addition' | 'modification' | 'clarification' 
        : 'clarification'
    }));
  } catch (error) {
    console.error('Error parsing suggestions from LLM:', error);
    return [];
  }
}
