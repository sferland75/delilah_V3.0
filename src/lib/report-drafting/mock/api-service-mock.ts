/**
 * Mock API Service
 * 
 * This file provides mock implementations of the API service functions
 * to avoid API issues during development.
 */

import { ReportConfiguration, ReportTemplate, GeneratedReport } from '../types';
import { getTemplate } from './template-service-mock';

/**
 * Mock implementation of getDataAvailabilityStatus
 */
export async function getDataAvailabilityStatus() {
  console.log('[MOCK] Getting data availability status');
  return {
    'initial-assessment': { complete: true, lastUpdated: new Date() },
    'medical-history': { complete: true, lastUpdated: new Date() },
    'symptoms-assessment': { complete: true, lastUpdated: new Date() },
    'functional-status': { complete: true, lastUpdated: new Date() },
    'typical-day': { complete: true, lastUpdated: new Date() },
    'environmental-assessment': { complete: true, lastUpdated: new Date() },
    'activities-daily-living': { complete: true, lastUpdated: new Date() },
    'attendant-care': { complete: true, lastUpdated: new Date() }
  };
}

/**
 * Mock implementation of createReportConfiguration
 */
export async function createReportConfiguration(config: Partial<ReportConfiguration>) {
  console.log('[MOCK] Creating report configuration:', config);
  
  const template = await getTemplate(config.templateId || 'template-001');
  
  return {
    id: `config-${Date.now()}`,
    templateId: config.templateId || template.id,
    reportTitle: config.reportTitle || 'Assessment Report',
    sections: config.sections || template.sections,
    style: config.style || template.defaultStyle,
    createdAt: new Date(),
  };
}

/**
 * Mock implementation of generateReport
 */
export async function generateReport(config: ReportConfiguration) {
  console.log('[MOCK] Generating report from configuration:', config);
  
  // Create mock sections based on configuration
  const sections = config.sections.filter(s => s.include).map(section => ({
    id: section.id,
    title: section.title,
    content: getMockSectionContent(section.id, section.detailLevel, config.style)
  }));
  
  return {
    id: `report-${Date.now()}`,
    title: config.reportTitle,
    sections: sections,
    configId: config.id,
    templateId: config.templateId,
    createdAt: new Date(),
    lastModified: new Date(),
    metadata: {
      clientName: 'John Smith',
      clientId: 'client-001',
      authorName: 'Jane Doe, OT',
      authorId: 'user-001',
      assessmentDate: new Date().toISOString().split('T')[0],
      organizationId: 'org-001',
      organizationName: 'Delilah Assessment',
      customFields: {}
    }
  };
}

/**
 * Generate mock content for a section based on type, detail level and style
 */
function getMockSectionContent(sectionId: string, detailLevel: string, style: string): string {
  const contentLength = {
    'brief': 300,
    'standard': 600,
    'comprehensive': 1200
  }[detailLevel || 'standard'] || 600;
  
  const stylePrefix = {
    'clinical': 'Clinical Assessment: ',
    'conversational': '',
    'simplified': 'Summary: '
  }[style || 'clinical'] || '';
  
  // Generate mock content based on section
  let content = '';
  
  switch (sectionId) {
    case 'initial-assessment':
      content = `${stylePrefix}John Smith is a 45-year-old male referred for in-home assessment following a motor vehicle accident on January 15, 2025. He sustained injuries to his cervical spine and right shoulder.`;
      break;
      
    case 'medical-history':
      content = `${stylePrefix}Mr. Smith reports a history of hypertension (diagnosed 2020) and Type 2 diabetes (diagnosed 2018), both well-controlled with medication.`;
      break;
      
    case 'symptoms-assessment':
      content = `${stylePrefix}Mr. Smith reports the following symptoms related to his injuries: neck pain, right shoulder pain, headaches, dizziness, and fatigue.`;
      break;
      
    default:
      content = `${stylePrefix}This is a mock response for the ${sectionId} section with ${detailLevel} detail level in ${style} style.`;
  }
  
  // Pad content to match the desired length
  if (content.length < contentLength) {
    const additionalDetails = `\n\nAdditional observations and assessments would be included based on the comprehensive evaluation performed during the in-home assessment. `;
    
    content += additionalDetails.repeat(Math.ceil((contentLength - content.length) / additionalDetails.length));
  }
  
  return content.substring(0, contentLength);
}

/**
 * Mock implementation of updateReportSection
 */
export async function updateReportSection(
  reportId: string,
  sectionId: string,
  content: string
): Promise<boolean> {
  console.log(`[MOCK] Updating section "${sectionId}" in report "${reportId}"`);
  return true;
}

/**
 * Mock implementation of exportReport
 */
export async function exportReport(
  reportId: string,
  options: any
) {
  console.log(`[MOCK] Exporting report "${reportId}" with options:`, options);
  return {
    success: true,
    message: `Report successfully exported with format: ${options.format}`,
  };
}