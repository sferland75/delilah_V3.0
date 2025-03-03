/**
 * Combined Mock API Service
 * 
 * This file provides mock implementations of all API service functions
 * needed by the ReportDraftingContext, including functions from both
 * the api-service and template-service.
 */

import { 
  ReportConfiguration, 
  ReportTemplate, 
  GeneratedReport, 
  TemplateLibrary 
} from '../types';

// Mock template data
const mockTemplates = [
  {
    id: 'template-001',
    name: 'Standard Assessment Report',
    description: 'A comprehensive report template for in-home assessments',
    version: 1,
    isBuiltIn: true,
    isShared: true,
    defaultTitle: 'In-Home Assessment Report',
    defaultSections: [
      { id: 'initial-assessment', title: 'Initial Assessment', detailLevel: 'standard', included: true },
      { id: 'medical-history', title: 'Medical History', detailLevel: 'standard', included: true },
      { id: 'symptoms-assessment', title: 'Symptoms Assessment', detailLevel: 'comprehensive', included: true },
      { id: 'functional-status', title: 'Functional Status', detailLevel: 'standard', included: true },
      { id: 'typical-day', title: 'Typical Day', detailLevel: 'standard', included: true },
      { id: 'environmental-assessment', title: 'Environmental Assessment', detailLevel: 'standard', included: true },
      { id: 'activities-daily-living', title: 'Activities of Daily Living', detailLevel: 'standard', included: true },
      { id: 'attendant-care', title: 'Attendant Care', detailLevel: 'brief', included: true },
    ],
    defaultStyle: 'clinical',
    createdAt: new Date('2025-01-15'),
    lastModified: new Date('2025-02-20'),
    category: 'General',
    tags: ['Standard', 'Comprehensive', 'In-Home'],
    createdBy: 'System'
  },
  {
    id: 'template-002',
    name: 'Brief Assessment Summary',
    description: 'A concise template focused on key findings and recommendations',
    version: 1,
    isBuiltIn: true,
    isShared: true,
    defaultTitle: 'Brief Assessment Summary',
    defaultSections: [
      { id: 'initial-assessment', title: 'Initial Assessment', detailLevel: 'brief', included: true },
      { id: 'medical-history', title: 'Medical History', detailLevel: 'brief', included: true },
      { id: 'symptoms-assessment', title: 'Symptoms Assessment', detailLevel: 'brief', included: true },
      { id: 'functional-status', title: 'Functional Status', detailLevel: 'brief', included: true },
      { id: 'typical-day', title: 'Typical Day', detailLevel: 'brief', included: false },
      { id: 'environmental-assessment', title: 'Environmental Assessment', detailLevel: 'brief', included: true },
      { id: 'activities-daily-living', title: 'Activities of Daily Living', detailLevel: 'brief', included: true },
      { id: 'attendant-care', title: 'Attendant Care', detailLevel: 'brief', included: false },
    ],
    defaultStyle: 'simplified',
    createdAt: new Date('2025-01-15'),
    lastModified: new Date('2025-02-20'),
    category: 'Brief',
    tags: ['Brief', 'Summary', 'Quick'],
    createdBy: 'System'
  }
];

/**
 * Mock implementation of the getAvailableTemplates function
 * (from the original api-service)
 */
export async function getAvailableTemplates() {
  console.log('[MOCK] Getting available templates');
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return mockTemplates;
}

/**
 * Mock implementation of the getTemplate function
 * (from the original api-service)
 */
export async function getTemplate(templateId: string) {
  console.log(`[MOCK] Getting template with ID: ${templateId}`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  const template = mockTemplates.find(t => t.id === templateId);
  if (!template) {
    // Use the first template as fallback if not found
    return mockTemplates[0];
  }
  return template;
}

/**
 * Mock implementation of getDataAvailabilityStatus
 * (from the original api-service)
 */
export async function getDataAvailabilityStatus() {
  console.log('[MOCK] Getting data availability status');
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return {
    'initial-assessment': { status: 'complete', percentage: 100, lastUpdated: new Date() },
    'medical-history': { status: 'complete', percentage: 100, lastUpdated: new Date() },
    'symptoms-assessment': { status: 'complete', percentage: 100, lastUpdated: new Date() },
    'functional-status': { status: 'complete', percentage: 100, lastUpdated: new Date() },
    'typical-day': { status: 'complete', percentage: 100, lastUpdated: new Date() },
    'environmental-assessment': { status: 'complete', percentage: 100, lastUpdated: new Date() },
    'activities-daily-living': { status: 'complete', percentage: 100, lastUpdated: new Date() },
    'attendant-care': { status: 'complete', percentage: 100, lastUpdated: new Date() }
  };
}

/**
 * Mock implementation of createReportConfiguration
 * (from the original api-service)
 */
export async function createReportConfiguration(config: Partial<ReportConfiguration>) {
  console.log('[MOCK] Creating report configuration:', config);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  const template = await getTemplate(config.templateId || 'template-001');
  
  return {
    id: `config-${Date.now()}`,
    templateId: config.templateId || template.id,
    reportTitle: config.reportTitle || 'Assessment Report',
    sections: config.sections || template.defaultSections,
    style: config.style || template.defaultStyle,
    createdAt: new Date(),
  };
}

/**
 * Mock implementation of generateReport
 * (from the original api-service)
 */
export async function generateReport(config: ReportConfiguration) {
  console.log('[MOCK] Generating report from configuration:', config);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate longer processing time
  
  // Create mock sections based on configuration
  const sections = config.sections.filter(s => s.included).map(section => {
    // Get data sources for this section
    const dataSources = getDataSourcesForSection(section.id);
    
    // Get data completeness for this section
    const dataCompleteness = {
      status: 'complete' as 'complete' | 'partial' | 'incomplete',
      percentage: 100
    };
    
    return {
      id: section.id,
      title: section.title || getSectionTitle(section.id),
      content: getMockSectionContent(section.id, section.detailLevel, config.style),
      dataSources,
      dataCompleteness
    };
  });
  
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
 * Get section title based on ID
 */
function getSectionTitle(sectionId: string): string {
  const titles: Record<string, string> = {
    'initial-assessment': 'Initial Assessment',
    'medical-history': 'Medical History',
    'symptoms-assessment': 'Symptoms Assessment',
    'functional-status': 'Functional Status',
    'typical-day': 'Typical Day',
    'environmental-assessment': 'Environmental Assessment',
    'activities-daily-living': 'Activities of Daily Living',
    'attendant-care': 'Attendant Care'
  };
  
  return titles[sectionId] || sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Get data sources for a section
 */
function getDataSourcesForSection(sectionId: string): string[] {
  const dataSources: Record<string, string[]> = {
    'initial-assessment': ['Demographics', 'Client Information', 'Referral Details'],
    'medical-history': ['Medical History Form', 'Physician Reports', 'Client Interview'],
    'symptoms-assessment': ['Symptoms Questionnaire', 'Pain Assessment', 'Client Interview'],
    'functional-status': ['Functional Assessment', 'Client Interview', 'Observation'],
    'typical-day': ['Daily Activity Log', 'Client Interview'],
    'environmental-assessment': ['Home Safety Checklist', 'Home Visit Observations'],
    'activities-daily-living': ['ADL Assessment Form', 'Client Interview', 'Observation'],
    'attendant-care': ['Care Needs Assessment', 'Family Interview', 'Client Interview']
  };
  
  return dataSources[sectionId] || ['Assessment Data'];
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
      content = `${stylePrefix}John Smith is a 45-year-old male referred for in-home assessment following a motor vehicle accident on January 15, 2025. He sustained injuries to his cervical spine and right shoulder. The client reports persistent pain rated 7/10 and limited range of motion in his right upper extremity. He currently resides in a two-story home with his spouse and two children. Prior to the accident, Mr. Smith worked as a construction supervisor, a position he has held for 12 years. He has been unable to return to work since the accident.`;
      break;
      
    case 'medical-history':
      content = `${stylePrefix}Mr. Smith reports a history of hypertension (diagnosed 2020) and Type 2 diabetes (diagnosed 2018), both well-controlled with medication. Following the motor vehicle accident on January 15, 2025, he was diagnosed with a cervical strain, right rotator cuff tear, and mild traumatic brain injury. He underwent arthroscopic repair of his right shoulder on February 1, 2025. Current medications include Lisinopril 10mg daily, Metformin 500mg twice daily, Hydrocodone/Acetaminophen 5/325mg as needed for pain, and Cyclobenzaprine 5mg at bedtime. He has no known drug allergies.`;
      break;
      
    case 'symptoms-assessment':
      content = `${stylePrefix}Mr. Smith reports the following symptoms related to his injuries:\n\nPhysical Symptoms:\n1. Neck pain: Constant aching with intermittent sharp pain rated 6/10, increasing to 8/10 with prolonged sitting or standing\n2. Right shoulder pain: Throbbing pain rated 7/10, worsening with overhead activities or lifting more than 5 pounds\n3. Headaches: Occurs daily, typically in the afternoon, rated 5/10\n4. Dizziness: Occasional (2-3 times per week), typically when changing positions quickly\n5. Fatigue: Moderate, most significant in the afternoon\n\nCognitive Symptoms:\n1. Difficulty concentrating: Moderate, noticeable when reading or following complex conversations\n2. Short-term memory issues: Mild to moderate, frequently forgets recent conversations\n3. Word-finding difficulties: Mild, occurs several times daily during conversation`;
      break;
      
    case 'functional-status':
      content = `${stylePrefix}Mr. Smith demonstrates the following functional limitations:\n\nMobility: Requires minimal assistance for ambulation on stairs due to occasional dizziness. Independent with all other mobility tasks including walking on level surfaces, transfers, and driving short distances.\n\nUpper Extremity Function: Limited active range of motion in the right shoulder. Flexion limited to 110°, abduction to 90°, and external rotation to 45°. Grip strength measured at 65% compared to the unaffected left side. These limitations impact activities requiring overhead reaching, lifting more than 10 pounds, and sustained fine motor tasks.`;
      break;
      
    case 'typical-day':
      content = `${stylePrefix}Mr. Smith's typical day begins at 7:00 AM when he wakes up with increased neck and shoulder pain and stiffness. He requires 10-15 minutes to loosen up before getting out of bed. Morning routines take approximately 45 minutes, which is longer than his pre-injury baseline of 20 minutes. He spends most mornings resting or doing light household activities with frequent breaks due to fatigue and pain. Afternoons are typically spent attending medical or therapy appointments or walking short distances in his neighborhood. He reports increased pain and fatigue by mid-afternoon, requiring 1-2 hours of rest. Evenings are spent with family with minimal participation in household management tasks.`;
      break;
      
    case 'environmental-assessment':
      content = `${stylePrefix}The client's home is a two-story residence with 3 bedrooms and 2 bathrooms. The primary living areas (kitchen, dining room, living room) are on the first floor with bedrooms on the second floor. There are 14 steps with a handrail on the right side leading to the second floor. The bathroom on the first floor has been modified with grab bars in the shower and beside the toilet. The second-floor bathroom is standard with no adaptive equipment. The kitchen has standard-height countertops and cabinets that require reaching overhead. The yard is level with 3 steps leading to the front door and a ramp at the back entrance.`;
      break;
      
    case 'activities-daily-living':
      content = `${stylePrefix}Basic Activities of Daily Living (BADLs):\n- Self-feeding: Independent\n- Bathing: Independent but requires increased time and experiences moderate pain\n- Grooming: Independent with modified techniques\n- Dressing: Independent with lower body; requires minimal assistance or adaptive techniques for upper body dressing\n- Toileting: Independent\n\nInstrumental Activities of Daily Living (IADLs):\n- Meal preparation: Capable of simple meal preparation but avoids complex cooking due to fatigue and pain with prolonged standing\n- Household management: Limited participation; spouse has assumed majority of household responsibilities\n- Financial management: Independent\n- Medication management: Independent\n- Community mobility: Independent for short distances; avoids driving during peak traffic hours due to concentration difficulties`;
      break;
      
    case 'attendant-care':
      content = `${stylePrefix}Based on the assessment findings, Mr. Smith requires the following attendant care services:\n\n1. Personal Care Assistance: 1 hour daily for assistance with upper body dressing, shower setup, and hair care\n\n2. Home Management: 4 hours weekly for assistance with meal preparation, laundry, and light housekeeping\n\n3. Community Access: 2 hours weekly for accompaniment to medical appointments and grocery shopping\n\nTotal recommended attendant care: 13 hours weekly\n\nIt is anticipated that these needs will decrease as Mr. Smith's recovery progresses, with reassessment recommended in 3 months.`;
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
 * (from the original api-service)
 */
export async function updateReportSection(
  reportId: string,
  sectionId: string,
  content: string
): Promise<boolean> {
  console.log(`[MOCK] Updating section "${sectionId}" in report "${reportId}"`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return true;
}

/**
 * Mock implementation of exportReport
 * (from the original api-service)
 */
export async function exportReport(
  reportId: string,
  options: any
) {
  console.log(`[MOCK] Exporting report "${reportId}" with options:`, options);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return {
    success: true,
    message: `Report successfully exported with format: ${options.format}`,
  };
}

/**
 * Mock implementation of trackTemplateUsage
 * (from the original template-service)
 */
export async function trackTemplateUsage(templateId: string) {
  console.log(`[MOCK] Tracking usage of template: ${templateId}`);
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
  return true;
}

/**
 * Mock implementation of getUserTemplateLibrary
 * (from the original template-service)
 */
export async function getUserTemplateLibrary() {
  console.log('[MOCK] Getting user template library');
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return {
    favorites: [mockTemplates[0].id],
    recent: [mockTemplates[0].id, mockTemplates[1].id],
    shared: mockTemplates,
    builtIn: mockTemplates,
    custom: []
  };
}

/**
 * Mock implementation of other template service functions
 * (from the original template-service)
 */
export async function saveTemplate(template: any) {
  console.log('[MOCK] Saving template:', template.name);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return { ...template, id: `template-${Date.now()}` };
}

export async function updateTemplate(templateId: string, updates: any) {
  console.log(`[MOCK] Updating template ${templateId}:`, updates);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return { ...mockTemplates[0], ...updates, id: templateId };
}

export async function deleteTemplate(templateId: string) {
  console.log(`[MOCK] Deleting template: ${templateId}`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return true;
}

export async function getTemplateVersions(templateId: string) {
  console.log(`[MOCK] Getting versions for template: ${templateId}`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return [
    { 
      id: 1, 
      templateId, 
      version: 1, 
      createdAt: new Date('2025-01-15'),
      createdBy: 'System',
      notes: 'Initial version' 
    }
  ];
}

export async function exportTemplate(templateId: string) {
  console.log(`[MOCK] Exporting template: ${templateId}`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return new Blob(['Mock template export data'], { type: 'application/json' });
}

export async function importTemplate(file: File) {
  console.log('[MOCK] Importing template from file:', file.name);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return mockTemplates[0];
}

export async function addTemplateToFavorites(templateId: string) {
  console.log(`[MOCK] Adding template to favorites: ${templateId}`);
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
  return true;
}

export async function removeTemplateFromFavorites(templateId: string) {
  console.log(`[MOCK] Removing template from favorites: ${templateId}`);
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
  return true;
}

export async function shareTemplate(templateId: string, isShared: boolean) {
  console.log(`[MOCK] Setting template sharing to ${isShared ? 'shared' : 'private'}: ${templateId}`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return { ...mockTemplates[0], id: templateId, isShared };
}

export async function createTemplateFromBase(baseTemplateId: string, newName: string) {
  console.log(`[MOCK] Creating new template based on ${baseTemplateId} with name: ${newName}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return { ...mockTemplates[0], id: `template-${Date.now()}`, name: newName, isBuiltIn: false };
}