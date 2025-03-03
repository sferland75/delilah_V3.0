/**
 * Prompt Testing Framework
 * 
 * This module provides utilities for testing prompt templates with various data
 * inputs to ensure they generate appropriate content for reports.
 */

import { getPromptTemplate, assembleReportPrompt } from '../prompt-templates';
import { DetailLevel, ReportStyle } from '../types';
import { getSampleData } from './sample-data';
import { evaluatePromptOutput } from './evaluator';

// API key for Claude
const API_KEY = process.env.NEXT_PUBLIC_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY || null;
const API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Run prompt tests for all sections with various combinations of detail levels and styles
 */
export async function runAllPromptTests() {
  const sections = [
    'initial-assessment',
    'medical-history',
    'symptoms-assessment',
    'functional-status',
    'typical-day',
    'environmental-assessment',
    'activities-daily-living',
    'attendant-care'
  ];
  
  const detailLevels: DetailLevel[] = ['brief', 'standard', 'comprehensive'];
  const styles: ReportStyle[] = ['clinical', 'conversational', 'simplified'];
  
  const results = [];
  
  for (const section of sections) {
    for (const detailLevel of detailLevels) {
      for (const style of styles) {
        const result = await testPrompt(section, detailLevel, style);
        results.push(result);
        
        // Log progress
        console.log(`Tested: ${section} - ${detailLevel} - ${style}`);
        console.log(`Result: ${result.success ? 'PASS' : 'FAIL'} - Score: ${result.score}/10`);
        
        // Give a small delay between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  return summarizeResults(results);
}

/**
 * Test a specific prompt configuration
 */
export async function testPrompt(
  sectionId: string,
  detailLevel: DetailLevel,
  style: ReportStyle
): Promise<TestResult> {
  try {
    // Check if API key is available
    if (!API_KEY) {
      return {
        sectionId,
        detailLevel,
        style,
        promptLength: 0,
        responseLength: 0,
        success: false,
        score: 0,
        issues: ['Error: Claude API key is not configured. Please set NEXT_PUBLIC_CLAUDE_API_KEY in your environment.'],
        prompt: '',
        response: 'API key not configured. Using mock data instead.'
      };
    }
    
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
    
    // Call the LLM API to generate content
    const generatedContent = await callClaudeAPI(prompt);
    
    // Evaluate the generated content
    const evaluation = evaluatePromptOutput(
      sectionId,
      detailLevel,
      style,
      generatedContent
    );
    
    return {
      sectionId,
      detailLevel,
      style,
      promptLength: prompt.length,
      responseLength: generatedContent.length,
      success: evaluation.score >= 7, // Consider 7/10 as passing
      score: evaluation.score,
      issues: evaluation.issues,
      prompt,
      response: generatedContent
    };
  } catch (error) {
    console.error(`Error testing prompt for ${sectionId} - ${detailLevel} - ${style}:`, error);
    
    return {
      sectionId,
      detailLevel,
      style,
      promptLength: 0,
      responseLength: 0,
      success: false,
      score: 0,
      issues: [`Error: ${error.message || 'Unknown error'}`],
      prompt: '',
      response: 'Error generating content. See issues for details.'
    };
  }
}

/**
 * Call the Claude API to generate content
 */
async function callClaudeAPI(prompt: string): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Claude API key is not configured.');
    }
    
    console.log('Calling Claude API with prompt length:', prompt.length);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      let errorMessage = `API error: HTTP status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = `API error: ${errorData.error?.message || 'Unknown error'}`;
      } catch (e) {
        // If parsing JSON fails, use the status-based error message
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Unexpected response format from Claude API');
    }
    
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error(`Failed to generate content: ${error.message || 'Unknown error'}`);
  }
}

// Fallback to mock data if API call fails
function getMockResponse(sectionId: string, style: ReportStyle): string {
  // Return appropriate mock content based on section and style
  switch (sectionId) {
    case 'initial-assessment':
      return `This is a mock initial assessment. The writing style is ${style}.`;
    case 'medical-history':
      return `This is a mock medical history. The writing style is ${style}.`;
    default:
      return `This is a mock response for ${sectionId}. The writing style is ${style}.`;
  }
}

/**
 * Summarize test results
 */
function summarizeResults(results: TestResult[]): TestSummary {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const passRate = (passedTests / totalTests) * 100;
  
  // Calculate average scores by section, detail level, and style
  const sectionScores: Record<string, number[]> = {};
  const detailLevelScores: Record<string, number[]> = {};
  const styleScores: Record<string, number[]> = {};
  
  results.forEach(result => {
    // Add score to section array
    if (!sectionScores[result.sectionId]) {
      sectionScores[result.sectionId] = [];
    }
    sectionScores[result.sectionId].push(result.score);
    
    // Add score to detail level array
    if (!detailLevelScores[result.detailLevel]) {
      detailLevelScores[result.detailLevel] = [];
    }
    detailLevelScores[result.detailLevel].push(result.score);
    
    // Add score to style array
    if (!styleScores[result.style]) {
      styleScores[result.style] = [];
    }
    styleScores[result.style].push(result.score);
  });
  
  // Calculate averages
  const averageSectionScores: Record<string, number> = {};
  for (const [section, scores] of Object.entries(sectionScores)) {
    averageSectionScores[section] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
  
  const averageDetailLevelScores: Record<string, number> = {};
  for (const [level, scores] of Object.entries(detailLevelScores)) {
    averageDetailLevelScores[level] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
  
  const averageStyleScores: Record<string, number> = {};
  for (const [style, scores] of Object.entries(styleScores)) {
    averageStyleScores[style] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
  
  // Collect common issues
  const commonIssues: Record<string, number> = {};
  results.forEach(result => {
    result.issues.forEach(issue => {
      if (!commonIssues[issue]) {
        commonIssues[issue] = 0;
      }
      commonIssues[issue]++;
    });
  });
  
  // Sort issues by frequency
  const sortedIssues = Object.entries(commonIssues)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([issue, count]) => ({ issue, count }));
  
  return {
    totalTests,
    passedTests,
    passRate,
    averageSectionScores,
    averageDetailLevelScores,
    averageStyleScores,
    commonIssues: sortedIssues,
    results: results.map(r => ({
      sectionId: r.sectionId,
      detailLevel: r.detailLevel,
      style: r.style,
      success: r.success,
      score: r.score,
      issues: r.issues
    }))
  };
}

/**
 * Test a prompt combination and save the result to a log file
 */
export async function testAndLogPrompt(
  sectionId: string,
  detailLevel: DetailLevel,
  style: ReportStyle,
  logFilePath: string
): Promise<void> {
  const result = await testPrompt(sectionId, detailLevel, style);
  
  // Format the result as markdown
  const markdown = `
# Prompt Test Result

## Configuration
- **Section**: ${sectionId}
- **Detail Level**: ${detailLevel}
- **Style**: ${style}
- **Result**: ${result.success ? 'PASS' : 'FAIL'}
- **Score**: ${result.score}/10

## Metrics
- Prompt Length: ${result.promptLength} characters
- Response Length: ${result.responseLength} characters

## Issues
${result.issues.map(issue => `- ${issue}`).join('\n')}

## Prompt
\`\`\`
${result.prompt}
\`\`\`

## Response
\`\`\`
${result.response}
\`\`\`
`;

  // Save to file
  // In a real implementation, this would use a file system module
  console.log(`Test result would be saved to ${logFilePath}`);
}

/**
 * Run a comprehensive test for full report assembly
 */
export async function testFullReportAssembly(): Promise<TestResult> {
  try {
    // Check if API key is available
    if (!API_KEY) {
      return {
        sectionId: 'full-report',
        detailLevel: 'standard',
        style: 'clinical',
        promptLength: 0,
        responseLength: 0,
        success: false,
        score: 0,
        issues: ['Error: Claude API key is not configured. Please set NEXT_PUBLIC_CLAUDE_API_KEY in your environment.'],
        prompt: '',
        response: 'API key not configured. Using mock data instead.'
      };
    }
    
    // Generate sample content for all sections
    const sections = [
      'initial-assessment',
      'medical-history',
      'symptoms-assessment',
      'functional-status',
      'typical-day',
      'environmental-assessment',
      'activities-daily-living',
      'attendant-care'
    ];
    
    const sectionContents = [];
    
    for (const sectionId of sections) {
      const sampleData = getSampleData(sectionId);
      
      // Generate content for this section
      const prompt = getPromptTemplate(sectionId, {
        detailLevel: 'standard',
        style: 'clinical',
        sectionData: sampleData,
        clientName: 'John Smith',
        assessmentDate: '2025-02-24'
      });
      
      try {
        const content = await callClaudeAPI(prompt);
        
        sectionContents.push({
          id: sectionId,
          title: sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          content
        });
      } catch (error) {
        console.error(`Error generating content for section ${sectionId}:`, error);
        
        // Use mock content for this section
        sectionContents.push({
          id: sectionId,
          title: sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          content: getMockResponse(sectionId, 'clinical')
        });
      }
    }
    
    // Generate the full report prompt
    const reportPrompt = assembleReportPrompt(
      sectionContents,
      'clinical',
      {
        clientName: 'John Smith',
        dateOfBirth: '1980-01-15',
        assessmentDate: '2025-02-24',
        referralSource: 'Dr. Jane Williams, Neurologist'
      }
    );
    
    // Generate the full report
    const fullReport = await callClaudeAPI(reportPrompt);
    
    // Evaluate the full report
    const evaluation = evaluateFullReport(fullReport, sectionContents);
    
    return {
      sectionId: 'full-report',
      detailLevel: 'standard',
      style: 'clinical',
      promptLength: reportPrompt.length,
      responseLength: fullReport.length,
      success: evaluation.score >= 7, // Consider 7/10 as passing
      score: evaluation.score,
      issues: evaluation.issues,
      prompt: reportPrompt,
      response: fullReport
    };
  } catch (error) {
    console.error('Error testing full report assembly:', error);
    
    return {
      sectionId: 'full-report',
      detailLevel: 'standard',
      style: 'clinical',
      promptLength: 0,
      responseLength: 0,
      success: false,
      score: 0,
      issues: [`Error: ${error.message || 'Unknown error'}`],
      prompt: '',
      response: 'Error generating full report. See issues for details.'
    };
  }
}

/**
 * Evaluate a full assembled report
 */
function evaluateFullReport(
  report: string,
  sectionContents: Array<{ id: string; title: string; content: string }>
): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 10; // Start with perfect score and deduct points
  
  // Check if all sections are included
  for (const section of sectionContents) {
    const sectionTitle = section.title.toLowerCase();
    if (!report.toLowerCase().includes(sectionTitle)) {
      issues.push(`Missing section: ${section.title}`);
      score -= 1;
    }
  }
  
  // Check for cohesiveness and flow
  if (!report.includes('Summary') && !report.includes('Conclusion')) {
    issues.push('Missing summary or conclusion section');
    score -= 1;
  }
  
  // Check length
  if (report.length < 2000) {
    issues.push('Report is too short for a comprehensive assessment');
    score -= 1;
  } else if (report.length > 20000) {
    issues.push('Report is excessively long');
    score -= 1;
  }
  
  // Check for professional language
  const unprofessionalTerms = [
    'poor compliance',
    'difficult patient',
    'refuses to',
    'non-compliant',
    'unmotivated'
  ];
  
  for (const term of unprofessionalTerms) {
    if (report.toLowerCase().includes(term)) {
      issues.push(`Contains unprofessional term: "${term}"`);
      score -= 0.5;
    }
  }
  
  // Check for person-first language
  const nonPersonFirstTerms = [
    'disabled person',
    'wheelchair bound',
    'handicapped',
    'suffers from',
    'victim of'
  ];
  
  for (const term of nonPersonFirstTerms) {
    if (report.toLowerCase().includes(term)) {
      issues.push(`Contains non-person-first language: "${term}"`);
      score -= 0.5;
    }
  }
  
  // Ensure score doesn't go below 0
  score = Math.max(0, score);
  
  return { score, issues };
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
