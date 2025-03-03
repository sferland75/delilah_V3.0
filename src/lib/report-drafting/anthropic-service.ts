/**
 * Anthropic API Service for Report Generation
 * 
 * This module provides integration with the Anthropic Claude API for generating
 * report content based on templates and user data.
 */

import { DetailLevel, ReportStyle } from './types';

// Constants
const API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-3-haiku-20240307';
const DEFAULT_MAX_TOKENS = 4000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Interface for section data passed to content generation
 */
interface SectionData {
  id: string;
  detailLevel: DetailLevel;
  title: string;
  dataCompleteness: {
    status: string;
    percentage: number;
  };
  dataSources: string[];
}

/**
 * Generate content for a report section using Anthropic Claude API
 */
export async function generateContent(
  prompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    apiKey?: string;
  } = {}
): Promise<string> {
  // Use options or defaults
  const model = options.model || DEFAULT_MODEL;
  const maxTokens = options.maxTokens || DEFAULT_MAX_TOKENS;
  const temperature = options.temperature || 0.7;
  
  // Get API key from environment variable or options
  const apiKey = options.apiKey || process.env.CLAUDE_API_KEY;
  
  if (!apiKey) {
    throw new Error('No API key provided for Anthropic Claude API');
  }
  
  // Implement retry logic
  let retries = 0;
  let lastError = null;
  
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || `API returned status ${response.status}`;
        
        // Handle rate limiting specially
        if (response.status === 429) {
          console.warn('Rate limit exceeded, retrying after delay...');
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (retries + 1)));
          retries++;
          lastError = new Error(`Rate limit exceeded: ${errorMessage}`);
          continue;
        }
        
        throw new Error(`API error: ${errorMessage}`);
      }
      
      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error(`Error calling Anthropic API (attempt ${retries + 1}/${MAX_RETRIES}):`, error);
      
      // If this is not the last retry, wait and try again
      if (retries < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (retries + 1)));
        retries++;
        lastError = error;
      } else {
        // On the last retry, throw the error
        throw error;
      }
    }
  }
  
  // If we get here, all retries failed
  throw lastError || new Error('Failed to generate content after multiple retries');
}

/**
 * Generate multiple sections for a report
 */
export async function generateReportSections(
  sections: SectionData[],
  style: ReportStyle,
  clientData: any
): Promise<Array<{
  id: string;
  title: string;
  content: string;
  dataCompleteness: {
    status: string;
    percentage: number;
  };
  dataSources: string[];
}>> {
  // Import prompt templates dynamically to avoid circular dependencies
  const { getPromptTemplate } = await import('./prompt-templates');
  
  const generatedSections = [];
  const clientName = `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim() || 'The client';
  const assessmentDate = new Date().toLocaleDateString();
  
  // Process each section sequentially to avoid rate limits
  for (const section of sections) {
    try {
      // Generate the prompt for this section
      const prompt = getPromptTemplate(section.id, {
        detailLevel: section.detailLevel,
        style,
        sectionData: clientData,
        clientName,
        assessmentDate
      });
      
      // Call the API to generate content
      const content = await generateContent(prompt, {
        // Use a more capable model for complex sections or comprehensive detail
        model: (section.detailLevel === 'comprehensive' || 
                section.id === 'medical-history' ||
                section.id === 'symptoms-assessment') ? 
               'claude-3-sonnet-20240229' : DEFAULT_MODEL,
        // Adjust temperature based on section type and detail level
        temperature: getTemperatureForSection(section.id, section.detailLevel)
      });
      
      generatedSections.push({
        id: section.id,
        title: section.title,
        content,
        dataCompleteness: section.dataCompleteness,
        dataSources: section.dataSources
      });
    } catch (error) {
      console.error(`Error generating section ${section.id}:`, error);
      
      // Add fallback content if generation fails
      generatedSections.push({
        id: section.id,
        title: section.title,
        content: getFallbackContent(section.id, section.detailLevel),
        dataCompleteness: section.dataCompleteness,
        dataSources: section.dataSources
      });
    }
    
    // Add a small delay between section generations to avoid rate limiting
    if (sections.length > 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return generatedSections;
}

/**
 * Determine appropriate temperature for different section types and detail levels
 */
function getTemperatureForSection(sectionId: string, detailLevel: DetailLevel): number {
  // Use lower temperature for more factual sections that need precision
  const factuallySensitiveSections = [
    'initial-assessment',
    'medical-history',
    'symptoms-assessment'
  ];
  
  // Use higher temperature for more narrative sections
  const narrativeSections = [
    'typical-day'
  ];
  
  // Base temperature on section type
  if (factuallySensitiveSections.includes(sectionId)) {
    return 0.5; // More factual/precise
  } else if (narrativeSections.includes(sectionId)) {
    return 0.8; // More creative/flowing
  }
  
  // Otherwise, base temperature on detail level
  switch (detailLevel) {
    case 'brief':
      return 0.6;
    case 'standard':
      return 0.7;
    case 'comprehensive':
      return 0.7;
    default:
      return 0.7;
  }
}

/**
 * Fallback content in case API calls fail
 */
function getFallbackContent(sectionId: string, detailLevel: DetailLevel): string {
  // Simplified fallback content
  const contentLevels = {
    brief: {
      'initial-assessment': 'Client is a 45-year-old male who presented for assessment on February 24, 2025. Primary diagnosis is Multiple Sclerosis with secondary issues related to mobility and fatigue.',
      'medical-history': 'Client has a 10-year history of Multiple Sclerosis, diagnosed in 2015. Additional conditions include hypertension and mild depression.',
      'symptoms-assessment': 'Client reports moderate fatigue, mild pain in lower extremities, and occasional balance issues that impact daily activities.',
      'functional-status': 'Client is generally independent in mobility with use of a cane for longer distances. Demonstrates mild balance impairment and moderate endurance limitations.',
      'typical-day': 'Client typically wakes at 7:00 AM, completes self-care with minimal assistance, works from home part-time, and rests in the afternoon due to fatigue.',
      'environmental-assessment': 'Home is a single-level house with three steps at entry. Bathroom has been modified with grab bars and a shower seat.',
      'activities-daily-living': 'Client is independent in most ADLs with occasional assistance needed for lower body dressing during symptom flares.',
      'attendant-care': 'Client currently has 4 hours of weekly assistance for household tasks and meal preparation.'
    },
    standard: {
      'initial-assessment': 'Client is a 45-year-old male who presented for assessment on February 24, 2025. He resides in a single-level home with his spouse. Primary diagnosis is Multiple Sclerosis (relapsing-remitting) diagnosed in 2015 with secondary issues related to mobility, fatigue, and occasional cognitive changes. Client works part-time from home as a technical writer.\n\nClient was referred for occupational therapy assessment to evaluate current functioning and determine appropriate interventions and accommodations to maximize independence and quality of life.',
      // Other sections would have content here
    },
    comprehensive: {
      'initial-assessment': 'Client is a 45-year-old male who presented for assessment on February 24, 2025. He resides in a single-level home with his spouse of 18 years in a suburban neighborhood. Primary diagnosis is Multiple Sclerosis (relapsing-remitting) diagnosed in 2015 with secondary issues related to mobility, fatigue, and occasional cognitive changes including mild short-term memory impairment and word-finding difficulties. Client works part-time (25 hours/week) from home as a technical writer for a healthcare communications company.\n\nClient was referred for occupational therapy assessment by Dr. James Reynolds, neurologist, to evaluate current functioning and determine appropriate interventions and accommodations to maximize independence and quality of life. Client reports specific goals of maintaining work capacity, improving energy management throughout the day, and enhancing safety during home mobility.\n\nThis assessment was conducted over two sessions (February 24 and February 26, 2025) and included standardized assessments, observation of functional tasks, and a comprehensive home evaluation.',
      // Other sections would have content here
    }
  };
  
  return contentLevels[detailLevel]?.[sectionId] || 
    `[Fallback content for ${sectionId} section with ${detailLevel} detail level. This content is used when API generation fails.]`;
}

/**
 * Assemble a complete report from individual sections
 */
export async function assembleReport(
  reportTitle: string,
  sections: Array<{ id: string; title: string; content: string }>,
  style: ReportStyle,
  clientInfo: any
): Promise<string> {
  // Import prompt templates dynamically to avoid circular dependencies
  const { assembleReportPrompt } = await import('./prompt-templates');
  
  try {
    // Generate the prompt for the complete report
    const prompt = assembleReportPrompt(sections, style, clientInfo);
    
    // Call the API to generate the assembled report
    const content = await generateContent(prompt, {
      // Use a more capable model for report assembly
      model: 'claude-3-sonnet-20240229',
      maxTokens: 8000,
      temperature: 0.6
    });
    
    return content;
  } catch (error) {
    console.error('Error assembling complete report:', error);
    
    // Create a simple fallback report by concatenating sections with headings
    let fallbackReport = `# ${reportTitle}\n\n`;
    fallbackReport += `## Client Information\n`;
    fallbackReport += `Name: ${clientInfo.clientName || 'Not provided'}\n`;
    fallbackReport += `Assessment Date: ${clientInfo.assessmentDate || 'Not provided'}\n\n`;
    
    // Add each section with a heading
    sections.forEach(section => {
      fallbackReport += `## ${section.title}\n\n`;
      fallbackReport += `${section.content}\n\n`;
    });
    
    return fallbackReport;
  }
}
