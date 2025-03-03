import { generateWithClaude } from '../claude';
import { SectionData } from '../../contexts/AssessmentContext';

export interface ImprovementRecommendation {
  id: string;
  section: string;
  field?: string;
  currentContent?: string;
  recommendedImprovement: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
  category: 'clarity' | 'completeness' | 'professionalism' | 'objectivity' | 'specificity';
}

// This service provides content improvement recommendations
export const contentImprovementService = {
  // Get content improvement recommendations for a specific section
  getRecommendations: async (
    sectionName: string,
    sectionData: any,
    fullAssessmentData?: any
  ): Promise<ImprovementRecommendation[]> => {
    try {
      // For some sections, use rule-based recommendations
      if (sectionName === 'demographics' || sectionName === 'functionalStatus') {
        return getBasicRecommendations(sectionName, sectionData);
      }

      // For more complex, narrative-heavy sections, use NLP with Claude
      const prompt = createImprovementPrompt(sectionName, sectionData, fullAssessmentData);
      
      const result = await generateWithClaude(prompt, {
        temperature: 0.3,
        maxTokens: 1500,
        cacheKey: `improvement_${sectionName}_${JSON.stringify(sectionData).length}`
      });

      if (result.error) {
        console.error(`Error generating improvement recommendations for ${sectionName}:`, result.error);
        return [];
      }

      return parseRecommendationsFromLLM(result.content, sectionName);
    } catch (error) {
      console.error(`Error in getRecommendations for ${sectionName}:`, error);
      return [];
    }
  },

  // Get all improvement recommendations for the entire assessment
  getAllRecommendations: async (assessmentData: any): Promise<Record<string, ImprovementRecommendation[]>> => {
    const result: Record<string, ImprovementRecommendation[]> = {};
    
    for (const [section, data] of Object.entries(assessmentData)) {
      if (section !== 'metadata' && data) {
        result[section] = await contentImprovementService.getRecommendations(
          section, 
          data as SectionData,
          assessmentData
        );
      }
    }
    
    return result;
  }
};

// Basic rule-based recommendations for simpler sections
function getBasicRecommendations(
  sectionName: string,
  sectionData: any
): ImprovementRecommendation[] {
  const recommendations: ImprovementRecommendation[] = [];
  
  if (sectionName === 'demographics') {
    // Check for overly generic referral information
    if (
      sectionData?.referral?.reason && 
      (sectionData.referral.reason.includes('assessment') || sectionData.referral.reason.includes('evaluate')) &&
      sectionData.referral.reason.length < 30
    ) {
      recommendations.push({
        id: `demo-referral-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        section: 'demographics',
        field: 'referral.reason',
        currentContent: sectionData.referral.reason,
        recommendedImprovement: 'Provide a more specific reason for referral that includes the primary functional concerns or goals.',
        rationale: 'Generic referral reasons don\'t provide sufficient context for the assessment purpose.',
        priority: 'medium',
        category: 'specificity'
      });
    }
  }
  
  else if (sectionName === 'functionalStatus') {
    // Check for vague mobility descriptions
    if (
      sectionData?.mobilityAssessment?.description && 
      sectionData.mobilityAssessment.description.length < 50
    ) {
      recommendations.push({
        id: `func-mobility-desc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        section: 'functionalStatus',
        field: 'mobilityAssessment.description',
        currentContent: sectionData.mobilityAssessment.description,
        recommendedImprovement: 'Expand mobility description with specific details about ambulation distance, stability, and environmental factors that impact mobility.',
        rationale: 'Brief mobility descriptions often lack the specific details needed to understand functional limitations.',
        priority: 'medium',
        category: 'completeness'
      });
    }
    
    // Check for measurements without clinical significance
    if (
      sectionData?.upperExtremityFunction?.rightArm?.gripStrength &&
      sectionData?.upperExtremityFunction?.leftArm?.gripStrength &&
      !sectionData?.upperExtremityFunction?.strengthAssessment
    ) {
      recommendations.push({
        id: `func-grip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        section: 'functionalStatus',
        field: 'upperExtremityFunction.strengthAssessment',
        recommendedImprovement: 'Add an interpretation of grip strength measurements, explaining their functional significance.',
        rationale: 'Measurements are provided but their clinical significance and impact on function is not explained.',
        priority: 'medium',
        category: 'clarity'
      });
    }
  }
  
  return recommendations;
}

// Create a prompt for Claude to generate improvement recommendations
function createImprovementPrompt(
  sectionName: string,
  sectionData: any,
  fullAssessmentData?: any
): string {
  return `
You are an expert occupational therapy report editor with extensive experience improving clinical documentation.
Review the following content from the "${sectionName}" section of an OT assessment report and provide specific recommendations for improvement.

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

Your task is to identify ways to improve the clarity, completeness, professionalism, objectivity, and specificity of the content.
Consider the following:
- Use of vague or subjective language that should be more specific
- Missing information that would strengthen the assessment
- Professional terminology that could enhance clarity
- Objective, measurable descriptions that could replace subjective statements
- Specificity that would better illustrate functional impacts

Format your response as a JSON array of recommendation objects with these properties:
- id: A unique string ID
- section: The section this recommendation applies to (usually "${sectionName}")
- field: The specific field within the section this applies to (optional)
- currentContent: The current text that could be improved (if applicable)
- recommendedImprovement: A clear recommendation for how to improve the content
- rationale: Why this improvement would enhance the documentation
- priority: "high", "medium", or "low"
- category: One of "clarity", "completeness", "professionalism", "objectivity", or "specificity"

Example:
[
  {
    "id": "unique-id-1",
    "section": "${sectionName}",
    "field": "specificField",
    "currentContent": "Client has trouble walking",
    "recommendedImprovement": "Client ambulates with a shuffling gait pattern for approximately 15 feet before requiring rest, utilizing a front-wheeled walker for all mobility.",
    "rationale": "The improved description provides specific, measurable details about the client's mobility status.",
    "priority": "high",
    "category": "specificity"
  }
]

Provide only JSON with no additional text.
`;
}

// Parse recommendations from Claude's response
function parseRecommendationsFromLLM(response: string, sectionName: string): ImprovementRecommendation[] {
  try {
    // Extract JSON array from response (handling potential text before/after JSON)
    const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
    if (!jsonMatch) return [];
    
    const recommendations = JSON.parse(jsonMatch[0]) as ImprovementRecommendation[];
    
    // Validate and sanitize recommendations
    return recommendations.map(recommendation => ({
      ...recommendation,
      id: recommendation.id || `${sectionName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      section: recommendation.section || sectionName,
      priority: ['high', 'medium', 'low'].includes(recommendation.priority) 
        ? recommendation.priority as 'high' | 'medium' | 'low' 
        : 'medium',
      category: ['clarity', 'completeness', 'professionalism', 'objectivity', 'specificity'].includes(recommendation.category) 
        ? recommendation.category as 'clarity' | 'completeness' | 'professionalism' | 'objectivity' | 'specificity' 
        : 'clarity'
    }));
  } catch (error) {
    console.error('Error parsing recommendations from LLM:', error);
    return [];
  }
}
