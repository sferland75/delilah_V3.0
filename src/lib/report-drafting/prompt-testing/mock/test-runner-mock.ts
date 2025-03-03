/**
 * Mock Prompt Testing Framework
 * 
 * This module provides a simulated version of the prompt testing framework
 * that doesn't make actual API calls to avoid CORS issues in the browser.
 */

import { DetailLevel, ReportStyle } from '../../types';
import { getPromptTemplate, assembleReportPrompt } from '../../prompt-templates';
import { getSampleData } from '../sample-data';

/**
 * Test a specific prompt configuration
 */
export async function testPrompt(
  sectionId: string,
  detailLevel: DetailLevel,
  style: ReportStyle
): Promise<TestResult> {
  try {
    console.log(`[MOCK] Testing prompt for ${sectionId} with ${detailLevel} detail level and ${style} style`);
    
    // Get sample data for this section
    const sampleData = getSampleData(sectionId);
    
    // Generate the prompt
    const prompt = getPromptTemplate(sectionId, {
      detailLevel,
      style,
      sectionData: sampleData,
      clientName: 'John Smith',
      assessmentDate: '2025-02-24'
    });
    
    // Instead of calling the API, generate a simulated response
    const simulatedResponse = generateMockResponse(sectionId, detailLevel, style);
    
    // Simulate a short delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      sectionId,
      detailLevel,
      style,
      promptLength: prompt.length,
      responseLength: simulatedResponse.length,
      success: true,
      score: 8.5, // Simulate a good score
      issues: getMockIssues(),
      prompt,
      response: simulatedResponse
    };
  } catch (error) {
    console.error(`[MOCK] Error testing prompt for ${sectionId}:`, error);
    
    return {
      sectionId,
      detailLevel,
      style,
      promptLength: 0,
      responseLength: 0,
      success: false,
      score: 0,
      issues: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      prompt: '',
      response: 'Error generating content.'
    };
  }
}

/**
 * Generate a mock response based on section and detail level
 */
function generateMockResponse(
  sectionId: string,
  detailLevel: DetailLevel,
  style: ReportStyle
): string {
  const contentLength = {
    'brief': 500,
    'standard': 1000,
    'comprehensive': 2000
  }[detailLevel];
  
  const stylePrefix = {
    'clinical': 'Clinical Assessment: ',
    'conversational': '',
    'simplified': 'Summary: '
  }[style];
  
  // Generate mock content based on section
  let content = '';
  
  switch (sectionId) {
    case 'initial-assessment':
      content = `${stylePrefix}John Smith is a 45-year-old male referred for in-home assessment following a motor vehicle accident on January 15, 2025. He sustained injuries to his cervical spine and right shoulder. The client reports persistent pain rated 7/10 and limited range of motion in his right upper extremity. He currently resides in a two-story home with his spouse and two children. Prior to the accident, Mr. Smith worked as a construction supervisor, a position he has held for 12 years. He has been unable to return to work since the accident. The assessment was conducted on February 24, 2025, at the client's residence.`;
      break;
      
    case 'medical-history':
      content = `${stylePrefix}Mr. Smith reports a history of hypertension (diagnosed 2020) and Type 2 diabetes (diagnosed 2018), both well-controlled with medication. Following the motor vehicle accident on January 15, 2025, he was diagnosed with a cervical strain, right rotator cuff tear, and mild traumatic brain injury. He underwent arthroscopic repair of his right shoulder on February 1, 2025. Current medications include Lisinopril 10mg daily, Metformin 500mg twice daily, Hydrocodone/Acetaminophen 5/325mg as needed for pain (reports taking 2-3 times daily), and Cyclobenzaprine 5mg at bedtime. He has no known drug allergies. He is currently attending physical therapy twice weekly for his neck and shoulder and reports some improvement in pain and mobility.`;
      break;
      
    case 'symptoms-assessment':
      content = `${stylePrefix}Mr. Smith reports the following symptoms related to his injuries:

Physical Symptoms:
1. Neck pain: Constant aching with intermittent sharp pain rated 6/10, increasing to 8/10 with prolonged sitting or standing
2. Right shoulder pain: Throbbing pain rated 7/10, worsening with overhead activities or lifting more than 5 pounds
3. Headaches: Occurs daily, typically in the afternoon, rated 5/10, described as pressure across forehead and temples
4. Dizziness: Occasional (2-3 times per week), typically when changing positions quickly
5. Fatigue: Moderate, most significant in the afternoon, interfering with daily activities

Cognitive Symptoms:
1. Difficulty concentrating: Moderate, noticeable when reading or following complex conversations
2. Short-term memory issues: Mild to moderate, frequently forgets recent conversations or where he placed items
3. Word-finding difficulties: Mild, occurs several times daily during conversation
4. Mental fatigue: Moderate, worsens throughout the day with mental exertion`;
      break;
      
    default:
      content = `${stylePrefix}This is a mock response for the ${sectionId} section with ${detailLevel} detail level in ${style} style. In a real implementation, this would contain assessment information gathered during the in-home evaluation.`;
  }
  
  // Adjust content length based on detail level
  if (content.length < contentLength) {
    const additionalDetails = `

Additional observations and assessments would be included based on the comprehensive evaluation performed during the in-home assessment. The content would be tailored to address specific aspects of the client's condition, functional abilities, and environmental factors.

Specific recommendations would be provided based on the identified needs and challenges, with consideration of the client's goals, preferences, and available resources. The assessment would inform the development of an individualized treatment plan aimed at maximizing functional independence and improving quality of life.`;
    
    content += additionalDetails.repeat(Math.ceil((contentLength - content.length) / additionalDetails.length));
  }
  
  return content.substring(0, contentLength);
}

/**
 * Get a random set of mock issues for evaluation
 */
function getMockIssues(): string[] {
  const possibleIssues = [
    'Content could include more specific functional implications',
    'Consider adding more client-centered language',
    'Ensure terminology is consistent throughout the document',
    'Additional details about assessment methods would improve clarity',
    'Consider adding specific measurement outcomes where available',
    'Supporting evidence for recommendations would strengthen the report'
  ];
  
  // Return 0-2 random issues
  const numIssues = Math.floor(Math.random() * 3);
  if (numIssues === 0) return [];
  
  const issues = [];
  for (let i = 0; i < numIssues; i++) {
    const randomIndex = Math.floor(Math.random() * possibleIssues.length);
    issues.push(possibleIssues[randomIndex]);
    possibleIssues.splice(randomIndex, 1); // Remove the issue so we don't repeat it
  }
  
  return issues;
}

/**
 * Run a mock comprehensive test for full report assembly
 */
export async function testFullReportAssembly(): Promise<TestResult> {
  try {
    console.log('[MOCK] Testing full report assembly');
    
    // Simulate a longer delay for comprehensive test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResponse = `# Occupational Therapy Assessment Report

## Client Information
Name: John Smith
Date of Birth: 1980-01-15
Assessment Date: 2025-02-24
Referral Source: Dr. Jane Williams, Neurologist

## Initial Assessment
[Mock content for Initial Assessment section]

## Medical History
[Mock content for Medical History section]

## Symptoms Assessment
[Mock content for Symptoms Assessment section]

## Functional Status
[Mock content for Functional Status section]

## Typical Day
[Mock content for Typical Day section]

## Environmental Assessment
[Mock content for Environmental Assessment section]

## Activities of Daily Living
[Mock content for Activities of Daily Living section]

## Attendant Care
[Mock content for Attendant Care section]

## Summary and Recommendations
[Mock content for summary and recommendations]`;

    return {
      sectionId: 'full-report',
      detailLevel: 'standard',
      style: 'clinical',
      promptLength: 5000, // Mock value
      responseLength: mockResponse.length,
      success: true,
      score: 9.0,
      issues: ['Consider adding more specific recommendations for home modifications'],
      prompt: 'Mock full report prompt',
      response: mockResponse
    };
  } catch (error) {
    console.error('[MOCK] Error testing full report assembly:', error);
    
    return {
      sectionId: 'full-report',
      detailLevel: 'standard',
      style: 'clinical',
      promptLength: 0,
      responseLength: 0,
      success: false,
      score: 0,
      issues: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      prompt: '',
      response: 'Error generating full report.'
    };
  }
}

// Types
export interface TestResult {
  sectionId: string;
  detailLevel: DetailLevel;
  style: ReportStyle;
  promptLength: number;
  responseLength: number;
  success: boolean;
  score: number;
  issues: string[];
  prompt: string;
  response: string;
}

export interface TestSummary {
  totalTests: number;
  passedTests: number;
  passRate: number;
  averageSectionScores: Record<string, number>;
  averageDetailLevelScores: Record<string, number>;
  averageStyleScores: Record<string, number>;
  commonIssues: Array<{ issue: string; count: number }>;
  results: Array<{
    sectionId: string;
    detailLevel: DetailLevel;
    style: ReportStyle;
    success: boolean;
    score: number;
    issues: string[];
  }>;
}
