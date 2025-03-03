/**
 * Integration tests for the Report Drafting module
 * 
 * These tests verify that the different components of the module
 * work together correctly through the full report generation workflow.
 */

import { 
  getAvailableTemplates, 
  getTemplate, 
  getDataAvailabilityStatus, 
  createReportConfiguration, 
  generateReport,
  updateReportSection,
  exportReport
} from '../api-service';

import {
  saveTemplate,
  updateTemplate,
  deleteTemplate,
  getUserTemplateLibrary,
  exportTemplate,
  importTemplate,
  toggleFavoriteTemplate,
  toggleTemplateSharing,
  trackTemplateUsage
} from '../template-service';

import { 
  ReportConfiguration,
  ReportStyle,
  DetailLevel,
  ExportOptions,
  SavedTemplate
} from '../types';

// Mock fetch globally
const originalFetch = global.fetch;
let mockFetch: jest.Mock;

describe('Report Drafting Integration', () => {
  // Set up before each test
  beforeEach(() => {
    // Reset all mocks
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Mock Date for predictable timestamps
    jest.spyOn(global, 'Date').mockImplementation(() => 
      new Date('2025-02-24T12:00:00Z') as any
    );

    // Set up the mock API responses for the full workflow
    setupMockResponses();
  });
  
  // Clean up after each test
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });
  
  test('should complete the full report drafting workflow end-to-end', async () => {
    // Step 1: Get user's template library
    const library = await getUserTemplateLibrary();
    expect(library).toHaveProperty('personalTemplates');
    expect(library).toHaveProperty('favoriteTemplates');
    expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates/library');
    
    // Step 2: Get available templates
    const templates = await getAvailableTemplates();
    expect(templates).toHaveLength(2);
    expect(templates[0].id).toBe('template-1');
    expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates');
    
    // Step 3: Select a specific template
    const template = await getTemplate('template-1');
    expect(template).not.toBeNull();
    expect(template!.id).toBe('template-1');
    expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates/template-1');
    
    // Step 4: Track template usage
    await trackTemplateUsage('template-1');
    expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates/template-1/usage', expect.any(Object));
    
    // Step 5: Get data availability
    const dataAvailability = await getDataAvailabilityStatus();
    expect(dataAvailability).toHaveProperty('initial-assessment');
    expect(dataAvailability).toHaveProperty('medical-history');
    expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/data-availability');
    
    // Step 6: Create a report configuration
    const configInput = {
      templateId: 'template-1',
      sections: [
        { id: 'initial-assessment', included: true, detailLevel: 'standard' as DetailLevel },
        { id: 'medical-history', included: true, detailLevel: 'comprehensive' as DetailLevel },
        { id: 'symptoms-assessment', included: false, detailLevel: 'brief' as DetailLevel }
      ],
      style: 'clinical' as ReportStyle,
      reportTitle: 'Test Integration Report'
    };
    
    const config = await createReportConfiguration(configInput);
    expect(config).toHaveProperty('id');
    expect(config.name).toBe('Test Integration Report');
    expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/configurations', expect.any(Object));
    
    // Step 7: Generate report from configuration
    const report = await generateReport(config);
    expect(report).toHaveProperty('id');
    expect(report.title).toBe('Test Integration Report');
    expect(report.sections).toHaveLength(2); // Only included sections
    expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/generate', expect.any(Object));
    
    // Step 8: Update a section
    const updateResult = await updateReportSection(
      report.id,
      'initial-assessment',
      'Updated content for initial assessment'
    );
    expect(updateResult).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      `/api/report-drafting/reports/${report.id}/sections/initial-assessment`,
      expect.any(Object)
    );
    
    // Step 9: Save the report as a template
    const templateToSave: SavedTemplate = {
      id: `template-${Date.now()}`,
      name: 'My Custom Template',
      description: 'Based on the report I just generated',
      defaultSections: config.sections,
      defaultTitle: config.name,
      defaultStyle: config.style,
      isBuiltIn: false,
      version: 1,
      isShared: false,
      tags: ['custom', 'test'],
      category: 'Custom Templates',
      createdBy: 'current-user',
      createdAt: new Date(),
      lastModified: new Date()
    };
    
    const savedTemplate = await saveTemplate(templateToSave);
    expect(savedTemplate).toHaveProperty('id');
    expect(savedTemplate.name).toBe('My Custom Template');
    expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates/save', expect.any(Object));
    
    // Step 10: Update the template
    const updatedTemplate = await updateTemplate(savedTemplate.id, {
      description: 'Updated description',
      tags: ['custom', 'test', 'updated']
    });
    expect(updatedTemplate).toHaveProperty('id');
    expect(updatedTemplate.description).toBe('Updated description');
    expect(updatedTemplate.tags).toContain('updated');
    expect(mockFetch).toHaveBeenCalledWith(`/api/report-drafting/templates/${savedTemplate.id}`, expect.any(Object));
    
    // Step 11: Add template to favorites
    await toggleFavoriteTemplate(savedTemplate.id, true);
    expect(mockFetch).toHaveBeenCalledWith(`/api/report-drafting/templates/favorites/${savedTemplate.id}`, expect.any(Object));
    
    // Step 12: Export the report
    const exportOptions: ExportOptions = {
      format: 'pdf',
      includeMetadata: true,
      includeHeaders: true,
      includeFooters: true
    };
    
    const exportResult = await exportReport(report.id, exportOptions);
    expect(exportResult.success).toBe(true);
    expect(exportResult).toHaveProperty('url');
    expect(mockFetch).toHaveBeenCalledWith(
      `/api/report-drafting/reports/${report.id}/export`,
      expect.any(Object)
    );
    
    // Step 13: Export the template
    const templateBlob = await exportTemplate(savedTemplate.id);
    expect(templateBlob instanceof Blob).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(`/api/report-drafting/templates/${savedTemplate.id}/export`);
    
    // Step 14: Delete the template
    const deleteResult = await deleteTemplate(savedTemplate.id);
    expect(deleteResult).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(`/api/report-drafting/templates/${savedTemplate.id}`, expect.any(Object));
  });
  
  test('should handle API failures gracefully with fallbacks', async () => {
    // Override some of the mock responses to simulate failures
    setupFailureMockResponses();
    
    // Step 1: Get user's template library (API failure)
    const library = await getUserTemplateLibrary();
    // Should still get a library structure from local fallback
    expect(library).toHaveProperty('personalTemplates');
    expect(library).toHaveProperty('favoriteTemplates');
    
    // Step 2: Get available templates (API failure)
    const templates = await getAvailableTemplates();
    // Should still get templates from local fallback
    expect(templates.length).toBeGreaterThan(0);
    
    // Step 3: Create a report configuration (API failure)
    const configInput = {
      templateId: 'template-1',
      sections: [
        { id: 'initial-assessment', included: true, detailLevel: 'standard' as DetailLevel }
      ],
      style: 'clinical' as ReportStyle,
      reportTitle: 'Test Failure Report'
    };
    
    const config = await createReportConfiguration(configInput);
    // Should still get a configuration from local fallback
    expect(config).toHaveProperty('id');
    expect(config.name).toBe('Test Failure Report');
    
    // Step 4: Generate report (API failure)
    const report = await generateReport(config);
    // Should still get a report from local fallback
    expect(report).toHaveProperty('id');
    expect(report.title).toBe('Test Failure Report');
    expect(report.sections.length).toBeGreaterThan(0);
    
    // Step 5: Save template (API failure)
    const templateToSave: SavedTemplate = {
      id: `template-${Date.now()}`,
      name: 'My Custom Template',
      description: 'Testing fallback',
      defaultSections: config.sections,
      defaultTitle: config.name,
      defaultStyle: config.style,
      isBuiltIn: false,
      version: 1,
      isShared: false,
      tags: ['custom', 'test'],
      category: 'Custom Templates',
      createdBy: 'current-user',
      createdAt: new Date(),
      lastModified: new Date()
    };
    
    const savedTemplate = await saveTemplate(templateToSave);
    // Should still save template locally
    expect(savedTemplate).toHaveProperty('id');
    expect(savedTemplate.name).toBe('My Custom Template');
    
    // Step 6: Toggle favorite (API failure)
    const favoriteResult = await toggleFavoriteTemplate(savedTemplate.id, true);
    // Should still return success
    expect(favoriteResult).toBe(true);
    
    // Step 7: Export template (API failure)
    const blobResult = await exportTemplate(savedTemplate.id);
    // Should still get a blob
    expect(blobResult instanceof Blob).toBe(true);
  });
  
  /**
   * Helper function to set up mock API responses for the full workflow
   */
  function setupMockResponses(): void {
    // Use a counter to return different responses based on call sequence
    let callCount = 0;
    
    mockFetch.mockImplementation(() => {
      callCount++;
      
      // Define responses for each API call in sequence
      switch (callCount) {
        // Get template library
        case 1:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              userId: 'current-user',
              personalTemplates: [
                {
                  id: 'saved-template-1',
                  name: 'My Saved Template',
                  description: 'A template I saved earlier',
                  defaultSections: [],
                  defaultTitle: 'Custom Report',
                  defaultStyle: 'clinical',
                  isBuiltIn: false,
                  version: 1,
                  isShared: false,
                  tags: ['custom'],
                  category: 'Custom',
                  createdBy: 'current-user',
                  createdAt: new Date().toISOString(),
                  lastModified: new Date().toISOString()
                }
              ],
              favoriteTemplates: ['saved-template-1'],
              recentlyUsedTemplates: [
                {
                  templateId: 'saved-template-1',
                  lastUsed: new Date().toISOString(),
                  useCount: 2
                }
              ]
            })
          });
        
        // Get available templates
        case 2:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              { id: 'template-1', name: 'Template 1' },
              { id: 'template-2', name: 'Template 2' }
            ])
          });
        
        // Get specific template
        case 3:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              id: 'template-1',
              name: 'Template 1',
              description: 'Test template',
              defaultSections: [
                { id: 'initial-assessment', included: true, detailLevel: 'standard' },
                { id: 'medical-history', included: true, detailLevel: 'comprehensive' },
                { id: 'symptoms-assessment', included: false, detailLevel: 'brief' }
              ],
              defaultTitle: 'Test Report Template',
              defaultStyle: 'clinical',
              isBuiltIn: true
            })
          });
        
        // Track template usage
        case 4:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true })
          });
        
        // Get data availability
        case 5:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              'initial-assessment': { status: 'complete', percentage: 100 },
              'medical-history': { status: 'complete', percentage: 100 },
              'symptoms-assessment': { status: 'partial', percentage: 75 },
              'functional-status': { status: 'incomplete', percentage: 30 }
            })
          });
        
        // Create configuration
        case 6:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              id: 'config-12345',
              name: 'Test Integration Report',
              templateId: 'template-1',
              sections: [
                { id: 'initial-assessment', included: true, detailLevel: 'standard' },
                { id: 'medical-history', included: true, detailLevel: 'comprehensive' },
                { id: 'symptoms-assessment', included: false, detailLevel: 'brief' }
              ],
              style: 'clinical',
              createdBy: 'test-user',
              createdAt: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              status: 'draft'
            })
          });
        
        // Generate report
        case 7:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              id: 'report-12345',
              title: 'Test Integration Report',
              configurationId: 'config-12345',
              sections: [
                {
                  id: 'initial-assessment',
                  title: 'Initial Assessment',
                  content: 'Generated content for initial assessment',
                  dataCompleteness: { status: 'complete', percentage: 100 },
                  dataSources: ['Demographics', 'Referral Information']
                },
                {
                  id: 'medical-history',
                  title: 'Medical History',
                  content: 'Generated content for medical history',
                  dataCompleteness: { status: 'complete', percentage: 100 },
                  dataSources: ['Medical Conditions', 'Medications']
                }
              ],
              metadata: {
                clientName: 'John Doe',
                clientId: 'client-123',
                assessmentDate: new Date().toISOString(),
                authorName: 'Current User',
                authorId: 'current-user',
                organizationName: 'ABC Rehabilitation',
                organizationId: 'org-123'
              },
              createdAt: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              status: 'draft',
              revisionHistory: [{
                timestamp: new Date().toISOString(),
                userId: 'test-user',
                userName: 'Test User',
                changes: [
                  {
                    sectionId: 'initial-assessment',
                    type: 'add',
                    newContent: 'Generated content for initial assessment'
                  },
                  {
                    sectionId: 'medical-history',
                    type: 'add',
                    newContent: 'Generated content for medical history'
                  }
                ]
              }]
            })
          });
        
        // Update section
        case 8:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              success: true,
              reportId: 'report-12345',
              sectionId: 'initial-assessment',
              message: 'Section updated successfully',
              timestamp: new Date().toISOString()
            })
          });
        
        // Save template
        case 9:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              id: 'new-template-12345',
              name: 'My Custom Template',
              description: 'Based on the report I just generated',
              defaultSections: [
                { id: 'initial-assessment', included: true, detailLevel: 'standard' },
                { id: 'medical-history', included: true, detailLevel: 'comprehensive' },
                { id: 'symptoms-assessment', included: false, detailLevel: 'brief' }
              ],
              defaultTitle: 'Test Integration Report',
              defaultStyle: 'clinical',
              isBuiltIn: false,
              version: 1,
              isShared: false,
              tags: ['custom', 'test'],
              category: 'Custom Templates',
              createdBy: 'current-user',
              createdAt: new Date().toISOString(),
              lastModified: new Date().toISOString()
            })
          });
        
        // Update template
        case 10:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              id: 'new-template-12345',
              name: 'My Custom Template',
              description: 'Updated description',
              defaultSections: [
                { id: 'initial-assessment', included: true, detailLevel: 'standard' },
                { id: 'medical-history', included: true, detailLevel: 'comprehensive' },
                { id: 'symptoms-assessment', included: false, detailLevel: 'brief' }
              ],
              defaultTitle: 'Test Integration Report',
              defaultStyle: 'clinical',
              isBuiltIn: false,
              version: 2,
              isShared: false,
              tags: ['custom', 'test', 'updated'],
              category: 'Custom Templates',
              createdBy: 'current-user',
              createdAt: new Date().toISOString(),
              lastModified: new Date().toISOString()
            })
          });
        
        // Add to favorites
        case 11:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true })
          });
        
        // Export report
        case 12:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              success: true,
              message: 'Report exported as PDF',
              url: '/api/reports/download/report-12345.pdf',
              format: 'pdf'
            })
          });
        
        // Export template
        case 13:
          return Promise.resolve({
            ok: true,
            status: 200,
            blob: () => Promise.resolve(new Blob(['template data'], { type: 'application/json' }))
          });
        
        // Delete template
        case 14:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true })
          });
        
        // Default fallback for any other calls
        default:
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({})
          });
      }
    });
  }
  
  /**
   * Helper function to set up mock API responses that simulate failures
   */
  function setupFailureMockResponses(): void {
    mockFetch.mockImplementation(() => {
      return Promise.reject(new Error('Network error'));
    });
  }
});
