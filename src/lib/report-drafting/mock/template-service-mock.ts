/**
 * Mock Template Service
 * 
 * This file provides mock implementations of the template service functions
 * to avoid API issues during development.
 */

// Mock template data
const mockTemplates = [
  {
    id: 'template-001',
    name: 'Standard Assessment Report',
    description: 'A comprehensive report template for in-home assessments',
    version: 1,
    isBuiltIn: true,
    isShared: true,
    sections: [
      { id: 'initial-assessment', title: 'Initial Assessment', detailLevel: 'standard', include: true },
      { id: 'medical-history', title: 'Medical History', detailLevel: 'standard', include: true },
      { id: 'symptoms-assessment', title: 'Symptoms Assessment', detailLevel: 'comprehensive', include: true },
      { id: 'functional-status', title: 'Functional Status', detailLevel: 'standard', include: true },
      { id: 'typical-day', title: 'Typical Day', detailLevel: 'standard', include: true },
      { id: 'environmental-assessment', title: 'Environmental Assessment', detailLevel: 'standard', include: true },
      { id: 'activities-daily-living', title: 'Activities of Daily Living', detailLevel: 'standard', include: true },
      { id: 'attendant-care', title: 'Attendant Care', detailLevel: 'brief', include: true },
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
    sections: [
      { id: 'initial-assessment', title: 'Initial Assessment', detailLevel: 'brief', include: true },
      { id: 'medical-history', title: 'Medical History', detailLevel: 'brief', include: true },
      { id: 'symptoms-assessment', title: 'Symptoms Assessment', detailLevel: 'brief', include: true },
      { id: 'functional-status', title: 'Functional Status', detailLevel: 'brief', include: true },
      { id: 'typical-day', title: 'Typical Day', detailLevel: 'brief', include: false },
      { id: 'environmental-assessment', title: 'Environmental Assessment', detailLevel: 'brief', include: true },
      { id: 'activities-daily-living', title: 'Activities of Daily Living', detailLevel: 'brief', include: true },
      { id: 'attendant-care', title: 'Attendant Care', detailLevel: 'brief', include: false },
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
 */
export async function getAvailableTemplates() {
  console.log('[MOCK] Getting available templates');
  return mockTemplates;
}

/**
 * Mock implementation of the getTemplate function
 */
export async function getTemplate(templateId: string) {
  console.log(`[MOCK] Getting template with ID: ${templateId}`);
  const template = mockTemplates.find(t => t.id === templateId);
  if (!template) {
    // Use the first template as fallback if not found
    return mockTemplates[0];
  }
  return template;
}

/**
 * Mock implementation of trackTemplateUsage
 */
export async function trackTemplateUsage(templateId: string) {
  console.log(`[MOCK] Tracking usage of template: ${templateId}`);
  return true;
}

/**
 * Mock implementation of getUserTemplateLibrary
 */
export async function getUserTemplateLibrary() {
  console.log('[MOCK] Getting user template library');
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
 */
export async function saveTemplate(template: any) {
  console.log('[MOCK] Saving template:', template.name);
  return { ...template, id: `template-${Date.now()}` };
}

export async function updateTemplate(templateId: string, updates: any) {
  console.log(`[MOCK] Updating template ${templateId}:`, updates);
  return { ...mockTemplates[0], ...updates, id: templateId };
}

export async function deleteTemplate(templateId: string) {
  console.log(`[MOCK] Deleting template: ${templateId}`);
  return true;
}

export async function getTemplateVersions(templateId: string) {
  console.log(`[MOCK] Getting versions for template: ${templateId}`);
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
  return new Blob(['Mock template export data'], { type: 'application/json' });
}

export async function importTemplate(file: File) {
  console.log('[MOCK] Importing template from file:', file.name);
  return mockTemplates[0];
}

export async function addTemplateToFavorites(templateId: string) {
  console.log(`[MOCK] Adding template to favorites: ${templateId}`);
  return true;
}

export async function removeTemplateFromFavorites(templateId: string) {
  console.log(`[MOCK] Removing template from favorites: ${templateId}`);
  return true;
}

export async function shareTemplate(templateId: string, isShared: boolean) {
  console.log(`[MOCK] Setting template sharing to ${isShared ? 'shared' : 'private'}: ${templateId}`);
  return { ...mockTemplates[0], id: templateId, isShared };
}

export async function createTemplateFromBase(baseTemplateId: string, newName: string) {
  console.log(`[MOCK] Creating new template based on ${baseTemplateId} with name: ${newName}`);
  return { ...mockTemplates[0], id: `template-${Date.now()}`, name: newName, isBuiltIn: false };
}