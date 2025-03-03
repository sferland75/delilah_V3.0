/**
 * Report Templates
 * 
 * This module defines the standard report templates available in the system.
 * Each template specifies which sections are included by default and their
 * detail levels.
 */

import { DetailLevel, ReportStyle, SectionConfiguration } from './types';

/**
 * Standard report templates
 */
export const reportTemplates = {
  'initial-assessment': {
    id: 'initial-assessment',
    name: 'Initial Assessment Report',
    description: 'Comprehensive initial evaluation report',
    defaultTitle: 'Initial Assessment Report',
    defaultStyle: 'clinical' as ReportStyle,
    defaultSections: [
      { id: 'initial-assessment', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'medical-history', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'symptoms-assessment', included: true, detailLevel: 'comprehensive' as DetailLevel },
      { id: 'functional-status', included: true, detailLevel: 'comprehensive' as DetailLevel },
      { id: 'environmental-assessment', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'activities-daily-living', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'typical-day', included: false, detailLevel: 'brief' as DetailLevel },
      { id: 'attendant-care', included: false, detailLevel: 'brief' as DetailLevel }
    ],
    isBuiltIn: true
  },
  'progress-report': {
    id: 'progress-report',
    name: 'Progress Report',
    description: 'Document client progress and current status',
    defaultTitle: 'Progress Report',
    defaultStyle: 'clinical' as ReportStyle,
    defaultSections: [
      { id: 'initial-assessment', included: true, detailLevel: 'brief' as DetailLevel },
      { id: 'symptoms-assessment', included: true, detailLevel: 'comprehensive' as DetailLevel },
      { id: 'functional-status', included: true, detailLevel: 'comprehensive' as DetailLevel },
      { id: 'activities-daily-living', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'medical-history', included: false, detailLevel: 'brief' as DetailLevel },
      { id: 'environmental-assessment', included: false, detailLevel: 'brief' as DetailLevel },
      { id: 'typical-day', included: false, detailLevel: 'brief' as DetailLevel },
      { id: 'attendant-care', included: false, detailLevel: 'brief' as DetailLevel }
    ],
    isBuiltIn: true
  },
  'discharge-summary': {
    id: 'discharge-summary',
    name: 'Discharge Summary',
    description: 'Final assessment and recommendations',
    defaultTitle: 'Discharge Summary',
    defaultStyle: 'clinical' as ReportStyle,
    defaultSections: [
      { id: 'initial-assessment', included: true, detailLevel: 'brief' as DetailLevel },
      { id: 'medical-history', included: true, detailLevel: 'brief' as DetailLevel },
      { id: 'symptoms-assessment', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'functional-status', included: true, detailLevel: 'comprehensive' as DetailLevel },
      { id: 'activities-daily-living', included: true, detailLevel: 'comprehensive' as DetailLevel },
      { id: 'environmental-assessment', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'attendant-care', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'typical-day', included: false, detailLevel: 'brief' as DetailLevel }
    ],
    isBuiltIn: true
  },
  'equipment-recommendation': {
    id: 'equipment-recommendation',
    name: 'Equipment Recommendation',
    description: 'Detailed equipment needs and justification',
    defaultTitle: 'Equipment Recommendation Report',
    defaultStyle: 'clinical' as ReportStyle,
    defaultSections: [
      { id: 'initial-assessment', included: true, detailLevel: 'brief' as DetailLevel },
      { id: 'medical-history', included: true, detailLevel: 'brief' as DetailLevel },
      { id: 'symptoms-assessment', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'functional-status', included: true, detailLevel: 'comprehensive' as DetailLevel },
      { id: 'environmental-assessment', included: true, detailLevel: 'comprehensive' as DetailLevel },
      { id: 'activities-daily-living', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'typical-day', included: false, detailLevel: 'brief' as DetailLevel },
      { id: 'attendant-care', included: false, detailLevel: 'brief' as DetailLevel }
    ],
    isBuiltIn: true
  },
  'home-assessment': {
    id: 'home-assessment',
    name: 'Home Assessment Report',
    description: 'Home environment evaluation and recommendations',
    defaultTitle: 'Home Assessment Report',
    defaultStyle: 'clinical' as ReportStyle,
    defaultSections: [
      { id: 'initial-assessment', included: true, detailLevel: 'brief' as DetailLevel },
      { id: 'functional-status', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'environmental-assessment', included: true, detailLevel: 'comprehensive' as DetailLevel },
      { id: 'activities-daily-living', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'medical-history', included: false, detailLevel: 'brief' as DetailLevel },
      { id: 'symptoms-assessment', included: false, detailLevel: 'brief' as DetailLevel },
      { id: 'typical-day', included: false, detailLevel: 'brief' as DetailLevel },
      { id: 'attendant-care', included: false, detailLevel: 'brief' as DetailLevel }
    ],
    isBuiltIn: true
  },
  'custom-template': {
    id: 'custom-template',
    name: 'Custom Template',
    description: 'Create a report with custom sections',
    defaultTitle: 'Custom Report',
    defaultStyle: 'clinical' as ReportStyle,
    defaultSections: [
      { id: 'initial-assessment', included: true, detailLevel: 'standard' as DetailLevel },
      { id: 'medical-history', included: false, detailLevel: 'standard' as DetailLevel },
      { id: 'symptoms-assessment', included: false, detailLevel: 'standard' as DetailLevel },
      { id: 'functional-status', included: false, detailLevel: 'standard' as DetailLevel },
      { id: 'environmental-assessment', included: false, detailLevel: 'standard' as DetailLevel },
      { id: 'activities-daily-living', included: false, detailLevel: 'standard' as DetailLevel },
      { id: 'typical-day', included: false, detailLevel: 'standard' as DetailLevel },
      { id: 'attendant-care', included: false, detailLevel: 'standard' as DetailLevel }
    ],
    isBuiltIn: true
  }
};

/**
 * Section metadata for display and organization
 */
export const sectionMetadata = {
  'initial-assessment': {
    title: 'Client Information',
    description: 'Demographics and basic client information',
    order: 1,
    category: 'assessment'
  },
  'medical-history': {
    title: 'Medical History',
    description: 'Client\'s medical background and conditions',
    order: 2,
    category: 'assessment'
  },
  'symptoms-assessment': {
    title: 'Symptoms Assessment',
    description: 'Current symptoms and their impact',
    order: 3,
    category: 'assessment'
  },
  'functional-status': {
    title: 'Functional Status',
    description: 'Client\'s functional abilities and limitations',
    order: 4,
    category: 'functional'
  },
  'typical-day': {
    title: 'Typical Day',
    description: 'Client\'s daily routine and activities',
    order: 5,
    category: 'functional'
  },
  'environmental-assessment': {
    title: 'Environmental Assessment',
    description: 'Home and community environment evaluation',
    order: 6,
    category: 'functional'
  },
  'activities-daily-living': {
    title: 'Activities of Daily Living',
    description: 'Assessment of ADL performance and assistance needs',
    order: 7,
    category: 'functional'
  },
  'attendant-care': {
    title: 'Attendant Care',
    description: 'Care needs and recommendations',
    order: 8,
    category: 'functional'
  }
};

/**
 * Get a template by ID
 */
export function getTemplateById(templateId: string) {
  return reportTemplates[templateId as keyof typeof reportTemplates] || null;
}

/**
 * Get default sections for a template
 */
export function getDefaultSections(templateId: string): SectionConfiguration[] {
  const template = getTemplateById(templateId);
  return template?.defaultSections || [];
}

/**
 * Get all available templates
 */
export function getAllTemplates() {
  return Object.values(reportTemplates);
}

/**
 * Get section metadata by ID
 */
export function getSectionMetadata(sectionId: string) {
  return sectionMetadata[sectionId as keyof typeof sectionMetadata] || null;
}

/**
 * Get all section metadata
 */
export function getAllSectionMetadata() {
  return Object.entries(sectionMetadata).map(([id, metadata]) => ({
    id,
    ...metadata
  }));
}
