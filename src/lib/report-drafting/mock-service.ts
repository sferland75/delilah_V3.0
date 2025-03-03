/**
 * Mock Report Drafting Service
 * 
 * This is a temporary mock implementation of the report generation service
 * that will be replaced with actual API integration.
 */

import { 
  ReportTemplate, 
  SectionConfiguration, 
  ReportConfiguration,
  GeneratedReport,
  ReportSection,
  DetailLevel,
  ReportStyle,
  ExportFormat,
  ExportOptions,
  ExportResult
} from './types';

// Mock templates
const mockTemplates: ReportTemplate[] = [
  {
    id: 'initial-assessment',
    name: 'Initial Assessment Report',
    description: 'Comprehensive initial evaluation report',
    defaultSections: [
      'initial-assessment',
      'medical-history',
      'symptoms-assessment',
      'functional-status',
      'environmental-assessment',
      'activities-daily-living'
    ],
    defaultTitle: 'Initial Assessment Report',
    defaultStyle: 'clinical',
    isBuiltIn: true,
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'progress-report',
    name: 'Progress Report',
    description: 'Document client progress over time',
    defaultSections: [
      'initial-assessment',
      'functional-status',
      'symptoms-assessment',
      'activities-daily-living'
    ],
    defaultTitle: 'Progress Report',
    defaultStyle: 'clinical',
    isBuiltIn: true,
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'discharge-summary',
    name: 'Discharge Summary',
    description: 'Final assessment and recommendations',
    defaultSections: [
      'initial-assessment',
      'medical-history',
      'functional-status',
      'activities-daily-living',
      'environmental-assessment'
    ],
    defaultTitle: 'Discharge Summary',
    defaultStyle: 'clinical',
    isBuiltIn: true,
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'equipment-recommendation',
    name: 'Equipment Recommendation',
    description: 'Detailed equipment needs and justification',
    defaultSections: [
      'initial-assessment',
      'medical-history',
      'functional-status',
      'environmental-assessment'
    ],
    defaultTitle: 'Equipment Recommendation Report',
    defaultStyle: 'clinical',
    isBuiltIn: true,
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'home-assessment',
    name: 'Home Assessment Report',
    description: 'Home environment evaluation and recommendations',
    defaultSections: [
      'initial-assessment',
      'functional-status',
      'environmental-assessment'
    ],
    defaultTitle: 'Home Assessment Report',
    defaultStyle: 'clinical',
    isBuiltIn: true,
    createdAt: new Date('2025-01-15')
  },
  {
    id: 'custom-template',
    name: 'Custom Template',
    description: 'Create a report with custom sections',
    defaultSections: [],
    defaultTitle: 'Custom Report',
    defaultStyle: 'clinical',
    isBuiltIn: true,
    createdAt: new Date('2025-01-15')
  }
];

// Data availability status for the mock implementation
const dataAvailability: Record<string, { complete: boolean; percentage: number; }> = {
  'initial-assessment': { complete: true, percentage: 100 },
  'medical-history': { complete: true, percentage: 100 },
  'symptoms-assessment': { complete: true, percentage: 100 },
  'functional-status': { complete: true, percentage: 100 },
  'typical-day': { complete: false, percentage: 60 },
  'environmental-assessment': { complete: true, percentage: 100 },
  'activities-daily-living': { complete: false, percentage: 85 },
  'attendant-care': { complete: false, percentage: 30 }
};

// Section titles
const sectionTitles: Record<string, string> = {
  'initial-assessment': 'Client Information',
  'medical-history': 'Medical History',
  'symptoms-assessment': 'Symptoms Assessment',
  'functional-status': 'Functional Status',
  'typical-day': 'Typical Day',
  'environmental-assessment': 'Environmental Assessment',
  'activities-daily-living': 'Activities of Daily Living',
  'attendant-care': 'Attendant Care'
};

// Data sources for each section
const sectionDataSources: Record<string, string[]> = {
  'initial-assessment': ['Demographics', 'Referral Information', 'Client Profile'],
  'medical-history': ['Medical Conditions', 'Medications', 'Previous Interventions'],
  'symptoms-assessment': ['Symptom Inventory', 'Pain Assessment', 'Fatigue Scale'],
  'functional-status': ['Mobility Assessment', 'Range of Motion', 'Manual Muscle Testing'],
  'typical-day': ['Daily Schedule', 'Activity Log', 'Energy Expenditure'],
  'environmental-assessment': ['Home Assessment', 'Workplace Evaluation', 'Community Access'],
  'activities-daily-living': ['ADL Assessment', 'Self-Care Inventory', 'IADL Evaluation'],
  'attendant-care': ['Care Needs Assessment', 'Caregiver Assessment', 'Service Recommendations']
};

// Mock content for the sections with different detail levels
const mockContent: Record<string, Record<DetailLevel, string>> = {
  'initial-assessment': {
    'brief': 'Client is a 45-year-old male who presented for assessment on February 24, 2025. Primary diagnosis is Multiple Sclerosis with secondary issues related to mobility and fatigue.',
    'standard': 'Client is a 45-year-old male who presented for assessment on February 24, 2025. He resides in a single-level home with his spouse. Primary diagnosis is Multiple Sclerosis (relapsing-remitting) diagnosed in 2015 with secondary issues related to mobility, fatigue, and occasional cognitive changes. Client works part-time from home as a technical writer.\n\nClient was referred for occupational therapy assessment to evaluate current functioning and determine appropriate interventions and accommodations to maximize independence and quality of life.',
    'comprehensive': 'Client is a 45-year-old male who presented for assessment on February 24, 2025. He resides in a single-level home with his spouse of 18 years in a suburban neighborhood. Primary diagnosis is Multiple Sclerosis (relapsing-remitting) diagnosed in 2015 with secondary issues related to mobility, fatigue, and occasional cognitive changes including mild short-term memory impairment and word-finding difficulties. Client works part-time (25 hours/week) from home as a technical writer for a healthcare communications company.\n\nClient was referred for occupational therapy assessment by Dr. James Reynolds, neurologist, to evaluate current functioning and determine appropriate interventions and accommodations to maximize independence and quality of life. Client reports specific goals of maintaining work capacity, improving energy management throughout the day, and enhancing safety during home mobility.\n\nThis assessment was conducted over two sessions (February 24 and February 26, 2025) and included standardized assessments, observation of functional tasks, and a comprehensive home evaluation.'
  },
  // Content for other sections would be defined here in a similar structure
};

/**
 * Export the mock service
 */
export const reportDraftingService = {
  /**
   * Get available report templates
   */
  getTemplates: async (): Promise<ReportTemplate[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTemplates;
  },

  /**
   * Get a specific template by ID
   */
  getTemplate: async (templateId: string): Promise<ReportTemplate | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTemplates.find(t => t.id === templateId) || null;
  },

  /**
   * Get data availability status for all sections
   */
  getDataAvailability: async (): Promise<Record<string, { complete: boolean; percentage: number; }>> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    return dataAvailability;
  },

  /**
   * Create a new report configuration
   */
  createReportConfiguration: async (config: Omit<ReportConfiguration, 'id' | 'createdAt' | 'lastModified'>): Promise<ReportConfiguration> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Return with mock ID and timestamps
    return {
      ...config,
      id: `report-config-${Date.now()}`,
      createdAt: new Date(),
      lastModified: new Date()
    };
  },

  /**
   * Generate a report based on configuration
   */
  generateReport: async (configId: string): Promise<GeneratedReport> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For the mock service, we'll need to fetch the configuration first
    // This would come from the actual API in the real implementation
    const config: ReportConfiguration = {
      id: configId,
      name: 'Sample Report',
      templateId: 'initial-assessment',
      sections: [
        { id: 'initial-assessment', included: true, detailLevel: 'standard' },
        { id: 'medical-history', included: true, detailLevel: 'brief' },
        { id: 'symptoms-assessment', included: true, detailLevel: 'comprehensive' },
        { id: 'functional-status', included: true, detailLevel: 'standard' }
      ],
      style: 'clinical',
      createdBy: 'current-user',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft'
    };
    
    // Generate sections based on configuration
    const reportSections: ReportSection[] = config.sections
      .filter(section => section.included)
      .map(section => {
        const detailLevel = section.detailLevel;
        const content = mockContent[section.id]?.[detailLevel] || 
          `Content for ${sectionTitles[section.id]} with ${detailLevel} detail level would be generated here.`;
        
        return {
          id: section.id,
          title: sectionTitles[section.id] || 'Unknown Section',
          content,
          dataCompleteness: {
            status: dataAvailability[section.id]?.complete ? 'complete' : 
              dataAvailability[section.id]?.percentage > 50 ? 'partial' : 'incomplete',
            percentage: dataAvailability[section.id]?.percentage || 0
          },
          dataSources: sectionDataSources[section.id] || []
        };
      });
    
    // Return the generated report
    return {
      id: `report-${Date.now()}`,
      title: 'Initial Assessment Report',
      configurationId: configId,
      sections: reportSections,
      metadata: {
        clientName: 'John Smith',
        clientId: 'client-123',
        assessmentDate: new Date(),
        authorName: 'Current User',
        authorId: 'current-user',
        organizationName: 'ABC Rehabilitation',
        organizationId: 'org-123'
      },
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft',
      revisionHistory: [{
        timestamp: new Date(),
        userId: 'current-user',
        userName: 'Current User',
        changes: [{
          sectionId: 'initial-assessment',
          type: 'add',
          newContent: reportSections[0].content
        }]
      }]
    };
  },

  /**
   * Export a report to the specified format
   */
  exportReport: async (reportId: string, options: ExportOptions): Promise<ExportResult> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock export result
    return {
      success: true,
      message: `Report successfully exported as ${options.format.toUpperCase()}`,
      url: options.format !== 'clientRecord' ? '/mock-download-url.pdf' : undefined,
      recordId: options.format === 'clientRecord' ? 'record-123' : undefined
    };
  },

  /**
   * Update a report section
   */
  updateReportSection: async (reportId: string, sectionId: string, content: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would update the report in the database
    console.log(`Updated section ${sectionId} in report ${reportId}`);
  }
};
