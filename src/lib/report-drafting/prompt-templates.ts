/**
 * Prompt Templates for Report Generation
 * 
 * This module contains the prompt templates for generating different sections of reports
 * with varying detail levels and styles.
 */

import { DetailLevel, ReportStyle } from './types';

/**
 * Interface for prompt template parameters
 */
interface PromptTemplateParams {
  detailLevel: DetailLevel;
  style: ReportStyle;
  sectionData: any;
  clientName?: string;
  assessmentDate?: string;
}

/**
 * Get a prompt template for a specific section
 */
export function getPromptTemplate(sectionId: string, params: PromptTemplateParams): string {
  const basePrompt = getBasePrompt(params.style);
  const sectionPrompt = getSectionPrompt(sectionId, params);
  const detailLevelInstructions = getDetailLevelInstructions(params.detailLevel);
  const professionalStandards = getProfessionalStandards();
  const evidenceBasedPractice = getEvidenceBasedPracticeGuidelines(sectionId);
  
  return `${basePrompt}

${detailLevelInstructions}

${professionalStandards}

${evidenceBasedPractice}

${sectionPrompt}

Please generate professional, evidence-based content for the ${getSectionName(sectionId)} section of the occupational therapy report.`;
}

/**
 * Get the base prompt that sets overall tone and style
 */
function getBasePrompt(style: ReportStyle): string {
  switch (style) {
    case 'clinical':
      return `You are an experienced occupational therapist with 15+ years of clinical experience, writing a formal clinical assessment report. 

ROLE AND PURPOSE:
- You are creating a section of a professional clinical documentation that will be reviewed by healthcare professionals, insurance providers, and potentially legal entities.
- Your writing should reflect the highest standards of professional clinical documentation.
- This documentation may be used for treatment planning, insurance approval, or legal proceedings.

WRITING STYLE:
- Use precise, professional medical terminology appropriate for healthcare professionals.
- Maintain a formal, objective tone throughout the entire report.
- Use third-person perspective consistently (e.g., "The client demonstrates..." or "Ms. Smith reports...").
- Structure content with clear organization and logical flow.
- Be concise while ensuring all clinically relevant information is included.
- Avoid subjective interpretations unless clearly identified as clinical impressions.
- Use proper medical abbreviations where appropriate, ensuring they are defined at first use.

CONTENT GUIDELINES:
- Focus primarily on factual observations, assessment findings, and evidence-based recommendations.
- Clearly differentiate between client-reported information and therapist observations/assessments.
- Include relevant clinical measurements, standardized assessment results, and objective data.
- Link findings to functional impacts using clinical reasoning.
- Ensure recommendations are specific, measurable, achievable, relevant, and time-bound (SMART).`;
    
    case 'conversational':
      return `You are an experienced occupational therapist with extensive experience in client education, writing an accessible assessment report.

ROLE AND PURPOSE:
- You are creating a section of a report that needs to be understood by the client and their family/caregivers.
- Your writing should balance clinical accuracy with accessibility.
- This documentation will help clients understand their condition and participate in treatment planning.

WRITING STYLE:
- Use clear, conversational language that maintains professional accuracy.
- Avoid excessive medical jargon; when technical terms are necessary, provide brief, simple explanations.
- Use a warm, supportive tone while remaining objective about findings.
- Use third-person perspective consistently (e.g., "Mr. Smith demonstrates..." or "You have shown...").
- Create short paragraphs with a logical flow that guides the reader through the information.
- Use simple sentence structures for better comprehension.

CONTENT GUIDELINES:
- Balance clinical information with practical explanations of how findings affect daily life.
- Explain the "why" behind recommendations in simple terms.
- Use analogies or examples to illustrate complex concepts when appropriate.
- Include practical, actionable information that clients can understand and implement.
- Focus on strengths alongside areas of challenge.
- Address common questions or concerns clients might have about findings or recommendations.`;
    
    case 'simplified':
      return `You are an occupational therapist creating a simplified assessment report for a broad audience with limited healthcare knowledge.

ROLE AND PURPOSE:
- You are creating a section of a report for readers who may have limited health literacy.
- Your writing must be accessible while still conveying essential clinical information.
- This documentation will help ensure all stakeholders understand key findings and recommendations.

WRITING STYLE:
- Use plain, straightforward language at approximately an 8th-grade reading level.
- Completely avoid medical terminology whenever possible; when it must be included, provide simple definitions.
- Use short, direct sentences with active voice.
- Create brief paragraphs (3-4 sentences maximum) with clear topic sentences.
- Use bullet points for lists rather than complex paragraphs.
- Include visual language and concrete examples rather than abstract concepts.

CONTENT GUIDELINES:
- Focus on practical implications rather than clinical details.
- Simplify complex information without losing critical meaning.
- Emphasize "what this means for daily life" rather than technical assessment findings.
- Use concrete examples to illustrate key points.
- Limit the number of main points to 3-5 key ideas per section.
- Include a brief summary of the most important take-away points at the end of each section.`;
      
    default:
      return `You are an experienced occupational therapist writing an assessment report.
Maintain a professional tone and use appropriate clinical terminology.
Be objective and focus on the assessment findings.`;
  }
}

/**
 * Get instructions for the specified detail level
 */
function getDetailLevelInstructions(detailLevel: DetailLevel): string {
  switch (detailLevel) {
    case 'brief':
      return `# DETAIL LEVEL: BRIEF

Your content should be concise while covering essential information only:

- Create a targeted summary of 1-3 paragraphs (maximum 250 words).
- Include only the most critical findings, implications, and recommendations.
- Focus on key data points and significant clinical findings.
- Omit detailed examples, background information, and minor details.
- Prioritize information with the highest clinical or functional relevance.
- Use efficient language without sacrificing clarity or clinical accuracy.
- Include only the most essential clinical reasoning connecting findings to recommendations.

This brief format is needed for quick reference by busy professionals or when only core information is required.`;
    
    case 'standard':
      return `# DETAIL LEVEL: STANDARD

Your content should be comprehensively informative while maintaining clarity:

- Create a well-rounded section of 3-5 paragraphs (approximately 350-500 words).
- Include all significant findings, implications, and recommendations.
- Provide sufficient supporting details and selected examples to illustrate key points.
- Include relevant contextual information that impacts clinical understanding.
- Balance thoroughness with readability and practical length.
- Explain key clinical reasoning connections between findings and recommendations.
- Organize information in a structured format with clear paragraph organization.

This standard format provides complete clinical documentation with appropriate detail for routine professional use.`;
    
    case 'comprehensive':
      return `# DETAIL LEVEL: COMPREHENSIVE

Your content should be exhaustive and thoroughly detailed:

- Create an in-depth section of 6+ paragraphs (600+ words as needed).
- Document all findings, observations, and assessment results in detail.
- Include comprehensive clinical reasoning explaining all connections between findings.
- Provide multiple specific examples to illustrate patterns and variations in functioning.
- Incorporate detailed contextual factors that influence assessment findings.
- Address nuances, exceptions, and special considerations.
- Include theoretical frameworks or clinical models that inform assessment interpretations.
- Discuss both immediate and long-term implications of findings.
- Provide detailed rationales for all recommendations.

This comprehensive format is appropriate for complex cases, legal documentation, research purposes, or when maximum clinical detail is required.`;
      
    default:
      return `Provide a balanced report with appropriate detail.
Include the most important information and relevant context.`;
  }
}

/**
 * Get professional standards to include in prompts
 */
function getProfessionalStandards(): string {
  return `# PROFESSIONAL DOCUMENTATION STANDARDS

Adhere to these professional documentation standards:

1. ACCURACY: Ensure all information is factually correct and clinically precise.

2. OBJECTIVITY: Separate observed facts from interpretations; clearly identify clinical impressions.

3. CLIENT-CENTERED: Focus on the client's unique needs, values, and context.

4. EVIDENCE-BASED: Base assessments and recommendations on current best practices.

5. CONFIDENTIALITY: Use de-identified language appropriate for protected health information.

6. RESPECTFUL LANGUAGE: Use person-first, dignity-preserving terminology.

7. PROFESSIONALISM: Maintain professional boundaries and avoid judgmental language.

8. CLARITY: Write clearly and unambiguously to prevent misinterpretation.`;
}

/**
 * Get evidence-based practice guidelines for specific sections
 */
function getEvidenceBasedPracticeGuidelines(sectionId: string): string {
  switch (sectionId) {
    case 'initial-assessment':
      return `# INITIAL ASSESSMENT BEST PRACTICES

Follow these evidence-based guidelines for initial assessment documentation:

- Include demographic information with only clinically relevant personal details
- Document referral source and reason with direct quotes when available
- Note assessment context (date, setting, duration) for procedural transparency
- Acknowledge any limitations to the assessment process or unusual circumstances
- Establish baseline status for measuring future progress
- Document client's understanding of the assessment purpose and process`;

    case 'medical-history':
      return `# MEDICAL HISTORY BEST PRACTICES

Follow these evidence-based guidelines for medical history documentation:

- Prioritize conditions that directly impact functional performance
- Note specific diagnoses with date of onset when available
- Document relevant medications with attention to functional side effects
- Include prior rehabilitative interventions and their outcomes
- Identify precautions and contraindications for intervention planning
- Note the relationship between medical conditions and occupational performance
- Distinguish between stable and progressive conditions`;

    case 'symptoms-assessment':
      return `# SYMPTOMS ASSESSMENT BEST PRACTICES

Follow these evidence-based guidelines for symptoms assessment documentation:

- Use standardized pain scales and body diagrams when available
- Document both the quality and quantity of symptoms
- Note temporal patterns (time of day, triggers, duration, frequency)
- Describe functional impact using specific activity examples
- Document both objective signs and subjective symptoms
- Note symptom management strategies and their effectiveness
- Identify inconsistencies in symptom presentation without judgment`;

    case 'functional-status':
      return `# FUNCTIONAL STATUS BEST PRACTICES

Follow these evidence-based guidelines for functional status documentation:

- Use objective measures and standardized assessment scores when available
- Compare current function to prior level of function when known
- Document capacity (what client can do) vs. performance (what client typically does)
- Include specific observations of task performance
- Note environmental factors that impact function
- Document compensatory strategies observed during assessment
- Use consistent terminology for assistance levels (independent, minimal assist, etc.)`;

    case 'typical-day':
      return `# TYPICAL DAY BEST PRACTICES

Follow these evidence-based guidelines for typical day documentation:

- Document routines chronologically with approximate timeframes
- Note energy levels, fatigue patterns, and rest periods throughout the day
- Identify challenges and accommodations for specific daily activities
- Distinguish between weekday and weekend routines if they differ
- Document roles fulfilled throughout the typical day
- Note client priorities and values related to daily activities
- Compare current routines to pre-injury/illness routines when relevant`;

    case 'environmental-assessment':
      return `# ENVIRONMENTAL ASSESSMENT BEST PRACTICES

Follow these evidence-based guidelines for environmental assessment documentation:

- Document specific measurements for critical architectural features
- Use objective terminology to describe accessibility concerns
- Include photos or diagrams when available
- Consider all functional domains (physical, cognitive, sensory) in environmental analysis
- Document both barriers and supportive features
- Note temporary vs. permanent environmental challenges
- Relate environmental factors directly to functional limitations`;

    case 'activities-daily-living':
      return `# ACTIVITIES OF DAILY LIVING BEST PRACTICES

Follow these evidence-based guidelines for ADL assessment documentation:

- Use standardized assessment results when available
- Document level of independence for each ADL category
- Note specific equipment or adaptations currently in use
- Document the quality, safety, and efficiency of ADL performance
- Include time required for task completion when relevant
- Note differences between self-report and observed performance
- Document sequence and method of task completion when relevant`;

    case 'attendant-care':
      return `# ATTENDANT CARE BEST PRACTICES

Follow these evidence-based guidelines for attendant care documentation:

- Specify exact nature of assistance required for each activity
- Document frequency, duration, and timing of care needs
- Differentiate between skilled and unskilled care requirements
- Note current caregivers' abilities and limitations
- Document safety concerns in current care arrangement
- Provide detailed justification for care recommendations
- Include caregiver training needs in recommendations`;

    default:
      return `# GENERAL DOCUMENTATION BEST PRACTICES

Follow these evidence-based guidelines for occupational therapy documentation:

- Focus on function rather than impairment alone
- Use specific, measurable terminology
- Document objectively, avoiding subjective judgments
- Include client perspective and priorities
- Balance deficits with strengths and abilities
- Connect findings directly to occupational performance`;
  }
}

/**
 * Get the prompt template for a specific section
 */
function getSectionPrompt(sectionId: string, params: PromptTemplateParams): string {
  const { sectionData, clientName = "the client", assessmentDate = "the assessment date" } = params;
  const clientFirstName = clientName.split(' ')[0] || "the client";

  switch (sectionId) {
    case 'initial-assessment':
      return `
# INITIAL ASSESSMENT / CLIENT INFORMATION SECTION

## AVAILABLE CLIENT INFORMATION:
${formatDataForPrompt(sectionData)}

## SPECIFIC CONTENT REQUIREMENTS:
1. Begin with a concise introduction of ${clientName}, including age, gender, living situation, and relevant occupational roles
2. State the specific reason for referral, including referral source and date
3. Document the assessment date, location, and who was present during the assessment
4. Note any relevant contextual factors that influence assessment findings (cultural, environmental, social)
5. Address client's understanding of assessment purpose and their stated goals
6. Note any factors that may have influenced assessment validity (cooperation, understanding, fatigue)

## CONTENT ORGANIZATION:
- Paragraph 1: Introduction and referral information
- Paragraph 2: Assessment context and methodology
- Paragraph 3: Client goals and perspectives
- Paragraph 4: Summary of key initial findings (brief overview only)

## CRITICAL REMINDERS:
- Do not fabricate information not provided in the data
- If critical information is missing, note it as "Information about [topic] was not available at the time of assessment"
- Avoid subjective judgments about client characteristics or circumstances
- Use client's preferred name consistently throughout after initial formal introduction`;

    case 'medical-history':
      return `
# MEDICAL HISTORY SECTION

## AVAILABLE MEDICAL INFORMATION:
${formatDataForPrompt(sectionData)}

## SPECIFIC CONTENT REQUIREMENTS:
1. Summarize primary diagnoses and relevant secondary conditions, noting dates of onset when available
2. Document current medications and their relevance to function and occupational performance
3. Note significant surgical or medical interventions and their outcomes
4. List relevant hospitalizations with dates and reasons
5. Document allergies and precautions that impact intervention planning
6. Analyze how medical conditions impact specific areas of occupational performance
7. Note stability or progression of conditions when information is available

## CONTENT ORGANIZATION:
- Paragraph 1: Primary diagnosis and key medical conditions
- Paragraph 2: Medication summary and management
- Paragraph 3: History of interventions and hospitalizations
- Paragraph 4: Functional impact of medical conditions
- Paragraph 5: Precautions and contraindications for occupational therapy

## CRITICAL REMINDERS:
- Organize medical conditions from most to least functionally significant
- Distinguish between client-reported medical history and verified information
- Focus on functional implications rather than detailed medical explanations
- Avoid clinical predictions about disease progression unless specifically indicated by medical documentation
- Note any discrepancies or inconsistencies in medical history without judgment`;

    case 'symptoms-assessment':
      return `
# SYMPTOMS ASSESSMENT SECTION

## AVAILABLE SYMPTOMS INFORMATION:
${formatDataForPrompt(sectionData)}

## SPECIFIC CONTENT REQUIREMENTS:
1. Document primary symptoms reported by ${clientName} including pain, fatigue, dizziness, etc.
2. For pain: document location, intensity (using standardized scale), quality, duration, and pattern
3. For fatigue: document severity, triggers, daily pattern, and impact on activity tolerance
4. Document sleep quality, quantity, and patterns
5. Note cognitive symptoms including attention, memory, information processing, and executive function concerns
6. Analyze how symptoms impact specific occupational performance areas
7. Document symptom management strategies currently employed and their effectiveness
8. Note any observed signs that correlate with reported symptoms

## CONTENT ORGANIZATION:
- Paragraph 1: Overview of primary symptoms and their general pattern
- Paragraph 2: Detailed pain assessment (if applicable)
- Paragraph 3: Fatigue and energy patterns
- Paragraph 4: Sleep quality and patterns
- Paragraph 5: Cognitive symptoms
- Paragraph 6: Impact on occupational performance
- Paragraph 7: Current management strategies and effectiveness

## CRITICAL REMINDERS:
- Use client's own descriptions of symptoms when available
- Document both severity and functional impact of each symptom
- Note consistency between reported symptoms and observed performance
- Identify factors that improve or exacerbate symptoms
- Avoid implying that subjective symptoms are exaggerated or minimized`;

    case 'functional-status':
      return `
# FUNCTIONAL STATUS SECTION

## AVAILABLE FUNCTIONAL INFORMATION:
${formatDataForPrompt(sectionData)}

## SPECIFIC CONTENT REQUIREMENTS:
1. Document mobility status including ambulation, transfers, and use of assistive devices
2. Assess upper extremity function including strength, coordination, and dexterity
3. Evaluate balance (static and dynamic) and fall risk factors
4. Document endurance and activity tolerance with specific metrics when available
5. Assess gross and fine motor coordination during functional tasks
6. Document sensory function as it relates to occupational performance
7. Note specific functional limitations observed during assessment
8. Document current use of adaptive strategies or compensatory techniques

## CONTENT ORGANIZATION:
- Paragraph 1: Overall functional status summary
- Paragraph 2: Mobility and transfer capabilities
- Paragraph 3: Upper extremity function and dexterity
- Paragraph 4: Balance and safety considerations
- Paragraph 5: Endurance and activity tolerance
- Paragraph 6: Observed functional limitations
- Paragraph 7: Current adaptive strategies and effectiveness

## CRITICAL REMINDERS:
- Use objective, measurable language (e.g., "transfers with moderate assistance of one" rather than "poor transfers")
- Include specific performance examples for each functional area
- Document functional capacity in contextually relevant settings when possible
- Note disparities between capacity and performance when observed
- Include standardized assessment scores when available
- Relate functional performance to occupational roles and client goals`;

    case 'typical-day':
      return `
# TYPICAL DAY SECTION

## AVAILABLE TYPICAL DAY INFORMATION:
${formatDataForPrompt(sectionData)}

## SPECIFIC CONTENT REQUIREMENTS:
1. Document ${clientFirstName}'s daily routine from morning to night in chronological order
2. Note time spent on self-care, productivity, and leisure activities
3. Document energy patterns throughout the day, including peak performance times and rest periods
4. Identify challenges encountered during specific daily activities
5. Note assistance or adaptation required throughout the daily routine
6. Document comparison to pre-injury/illness routine when information is available
7. Note client priorities and values related to daily activities
8. Document variability between weekday and weekend routines if differences exist

## CONTENT ORGANIZATION:
- Paragraph 1: Morning routine and activities
- Paragraph 2: Afternoon activities and routines
- Paragraph 3: Evening and nighttime routines
- Paragraph 4: Pattern analysis - energy levels, assistance needs, and challenges
- Paragraph 5: Comparison to prior routines and impact on roles and satisfaction

## CRITICAL REMINDERS:
- Use client's own description of routine when available
- Document both what activities are done and how they are accomplished
- Note time allocation patterns and priority activities
- Identify both challenges and successful adaptations in current routine
- Note activities that have been eliminated or significantly modified
- Document the emotional and social aspects of daily routine where relevant`;

    case 'environmental-assessment':
      return `
# ENVIRONMENTAL ASSESSMENT SECTION

## AVAILABLE ENVIRONMENTAL INFORMATION:
${formatDataForPrompt(sectionData)}

## SPECIFIC CONTENT REQUIREMENTS:
1. Document the physical layout of ${clientFirstName}'s home environment (type of dwelling, levels, accessibility)
2. Assess specific rooms and areas for accessibility and function (focus on bedroom, bathroom, kitchen, entry)
3. Document specific architectural barriers with measurements when available (doorway widths, step heights, etc.)
4. Identify safety hazards in the environment (fall risks, fire hazards, etc.)
5. Note existing modifications and adaptive equipment in the environment
6. Assess workplace or school environment if relevant to client goals
7. Document community access and transportation considerations
8. Analyze how environmental factors impact specific areas of occupational performance

## CONTENT ORGANIZATION:
- Paragraph 1: General description of living environment
- Paragraph 2: Home access (exterior and entry points)
- Paragraph 3: Bathroom accessibility and safety
- Paragraph 4: Kitchen accessibility and safety
- Paragraph 5: Bedroom and living areas
- Paragraph 6: Workplace/school environment (if applicable)
- Paragraph 7: Community access and transportation
- Paragraph 8: Overall environmental impact on occupational performance

## CRITICAL REMINDERS:
- Include specific measurements for critical architectural features
- Document both barriers and supportive features in the environment
- Consider all functional domains (physical, cognitive, sensory) in environmental analysis
- Note temporary vs. permanent environmental challenges
- Consider seasonal or weather-related environmental factors if relevant
- Document both objective assessment and client's perception of environmental barriers`;

    case 'activities-daily-living':
      return `
# ACTIVITIES OF DAILY LIVING SECTION

## AVAILABLE ADL INFORMATION:
${formatDataForPrompt(sectionData)}

## SPECIFIC CONTENT REQUIREMENTS:
1. Assess basic ADLs: bathing, grooming, dressing, toileting, feeding, functional mobility
2. Assess instrumental ADLs: meal preparation, home management, financial management, medication management, shopping, transportation
3. Document level of independence for each ADL category using consistent terminology
4. Note assistive devices or adaptive techniques currently used for ADLs
5. Document quality, safety, and efficiency of ADL performance
6. Identify specific barriers to ADL independence
7. Note client priorities for ADL independence
8. Document caregiver assistance required for ADL completion

## CONTENT ORGANIZATION:
- Paragraph 1: Overview of ADL status and general independence level
- Paragraph 2: Personal care activities (bathing, grooming, dressing, toileting)
- Paragraph 3: Feeding and medication management
- Paragraph 4: Home management activities (cleaning, laundry, meal preparation)
- Paragraph 5: Community living skills (shopping, transportation, financial management)
- Paragraph 6: Current adaptive strategies and equipment
- Paragraph 7: Assistance requirements and caregiver considerations

## CRITICAL REMINDERS:
- Use consistent terminology for assistance levels (independent, supervision, minimal assist, etc.)
- Document both what assistance is needed and why it is needed
- Note disparities between self-reported and observed ADL performance
- Consider efficiency and sustainability of current ADL methods
- Document safety concerns in ADL performance
- Note client satisfaction with current level of independence`;

    case 'attendant-care':
      return `
# ATTENDANT CARE SECTION

## AVAILABLE ATTENDANT CARE INFORMATION:
${formatDataForPrompt(sectionData)}

## SPECIFIC CONTENT REQUIREMENTS:
1. Document current caregiving arrangements (formal and informal)
2. Assess specific care needs for ADLs and IADLs with detailed requirements
3. Specify frequency, duration, and timing of care needs throughout a typical day and week
4. Document the skill level required for each assistance task (skilled vs. unskilled)
5. Analyze caregiver capabilities and limitations if relevant
6. Provide specific recommendation for attendant care hours with detailed justification
7. Document safety concerns related to current care arrangements
8. Specify caregiver training needs for optimal care delivery

## CONTENT ORGANIZATION:
- Paragraph 1: Overview of current care needs and arrangements
- Paragraph 2: Personal care assistance requirements (detail by task)
- Paragraph 3: Household management assistance requirements
- Paragraph 4: Health management assistance requirements
- Paragraph 5: Community access assistance requirements
- Paragraph 6: Recommended care schedule with hours justification
- Paragraph 7: Safety considerations and special requirements
- Paragraph 8: Caregiver training recommendations

## CRITICAL REMINDERS:
- Be specific about exact assistance techniques required for each task
- Provide objective justification for recommended hours
- Distinguish between care that enhances independence and care that is essential for health/safety
- Consider both physical and cognitive assistance needs
- Document how care needs vary throughout the day and week
- Note consistency between reported care needs and observed functional limitations`;

    default:
      return `
# GENERAL ASSESSMENT SECTION

## AVAILABLE INFORMATION:
${formatDataForPrompt(sectionData)}

## SPECIFIC CONTENT REQUIREMENTS:
1. Organize the assessment information in a logical and clinically relevant manner
2. Focus on functional implications rather than just listing findings
3. Connect assessment data to client's occupational roles and priorities
4. Document both strengths and areas of challenge
5. Note both observed performance and client's self-report
6. Consider environmental and contextual factors that influence function
7. Identify patterns across different assessment areas

## CONTENT ORGANIZATION:
- Paragraph 1: Overview of key findings
- Subsequent paragraphs: Organized by functional domain or assessment area
- Final paragraph: Summary of functional implications

## CRITICAL REMINDERS:
- Be factual and objective based on the provided data
- Do not fabricate information not provided in the data
- If critical information is missing, note it as "not available" rather than inventing details
- Maintain professional, non-judgmental language throughout
- Focus on function rather than impairment alone`;
  }
}

/**
 * Format data for inclusion in the prompt
 */
function formatDataForPrompt(data: any): string {
  if (!data) return "No data provided.";
  
  let result = "";
  
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') continue;
    
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      result += `${formatKeyName(key)}:\n`;
      value.forEach((item, index) => {
        if (typeof item === 'object') {
          result += `  ${index + 1}. ${JSON.stringify(item)}\n`;
        } else {
          result += `  ${index + 1}. ${item}\n`;
        }
      });
    } else if (typeof value === 'object') {
      result += `${formatKeyName(key)}:\n`;
      for (const [subKey, subValue] of Object.entries(value)) {
        if (subValue === undefined || subValue === null || subValue === '') continue;
        result += `  ${formatKeyName(subKey)}: ${subValue}\n`;
      }
    } else {
      result += `${formatKeyName(key)}: ${value}\n`;
    }
  }
  
  return result || "No specific data provided for this section.";
}

/**
 * Format a key name for better readability
 */
function formatKeyName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')  // Add space before capital letters
    .replace(/^./, str => str.toUpperCase())  // Capitalize the first letter
    .trim();
}

/**
 * Get section name from section ID
 */
function getSectionName(sectionId: string): string {
  const sectionNames: Record<string, string> = {
    'initial-assessment': 'Initial Assessment',
    'medical-history': 'Medical History',
    'symptoms-assessment': 'Symptoms Assessment',
    'functional-status': 'Functional Status',
    'typical-day': 'Typical Day',
    'environmental-assessment': 'Environmental Assessment',
    'activities-daily-living': 'Activities of Daily Living',
    'attendant-care': 'Attendant Care'
  };
  
  return sectionNames[sectionId] || sectionId;
}

/**
 * Assemble a complete report prompt from individual section prompts
 */
export function assembleReportPrompt(sections: any[], style: ReportStyle, clientInfo: any): string {
  const basePrompt = getBasePrompt(style);
  const professionalStandards = getProfessionalStandards();
  
  let sectionPrompts = '';
  sections.forEach(section => {
    sectionPrompts += `\n\n## ${getSectionName(section.id)} Section\n${section.content}`;
  });
  
  return `${basePrompt}

${professionalStandards}

# COMPLETE ASSESSMENT REPORT GENERATION

## CLIENT INFORMATION:
Name: ${clientInfo.clientName || 'Not provided'}
Assessment Date: ${clientInfo.assessmentDate || 'Not provided'}
${clientInfo.dateOfBirth ? `Date of Birth: ${clientInfo.dateOfBirth}` : ''}
${clientInfo.referralSource ? `Referral Source: ${clientInfo.referralSource}` : ''}

## CONTENT FROM INDIVIDUAL SECTIONS:
${sectionPrompts}

## REPORT GENERATION INSTRUCTIONS:
1. Create a cohesive, integrated assessment report by synthesizing the section content provided above
2. Ensure logical flow between sections with appropriate transitions
3. Maintain consistent formatting, terminology, and tone throughout
4. Eliminate redundancy while preserving all clinically significant information
5. Ensure recommendations are consistent across all sections
6. Create a brief executive summary at the beginning highlighting key findings and recommendations
7. Add a conclusion section that synthesizes findings across domains and outlines next steps

## CRITICAL REMINDERS:
- Do not fabricate information not present in the provided section content
- Maintain professional documentation standards throughout
- Ensure all recommendations are supported by assessment findings
- Use consistent terminology for functional status and assistance levels
- Check that section content is properly integrated without contradictions`;
}
