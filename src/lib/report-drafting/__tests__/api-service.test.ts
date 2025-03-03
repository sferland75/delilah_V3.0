/**
 * Unit tests for the Report Drafting API Service
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
  ReportTemplate,
  ReportConfiguration,
  DataCompleteness,
  SectionConfiguration,
  ReportStyle,
  DetailLevel
} from '../types';

import * as templates from '../templates';
import * as dataMapping from '../data-mapping';
import * as assessmentService from '@/services/assessment-service';

// Mock the fetch API
const originalFetch = global.fetch;
let mockFetch: jest.Mock;

// Mock the service dependencies
jest.mock('../templates', () => ({
  getAllTemplates: jest.fn(),
  getTemplateById: jest.fn()
}));

jest.mock('../data-mapping', () => ({
  getDataCompleteness: jest.fn(),
  extractSectionData: jest.fn()
}));

jest.mock('@/services/assessment-service', () => ({
  getAssessmentData: jest.fn()
}));

// Mock dynamic import of anthropic-service
jest.mock('../anthropic-service', () => ({
  generateReportSections: jest.fn()
}), { virtual: true });

describe('Report Drafting API Service', () => {
  // Set up before each test
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    
    // Set up default mock responses
    (templates.getAllTemplates as jest.Mock).mockReturnValue([
      { id: 'template-1', name: 'Template 1' },
      { id: 'template-2', name: 'Template 2' }
    ]);
    
    (templates.getTemplateById as jest.Mock).mockImplementation((id) => {
      return { id, name: `Template ${id.split('-')[1]}` };
    });
    
    (dataMapping.getDataCompleteness as jest.Mock).mockReturnValue({
      'section-1': { status: 'complete', percentage: 100 },
      'section-2': { status: 'partial', percentage: 75 }
    });
    
    (assessmentService.getAssessmentData as jest.Mock).mockResolvedValue({
      demographics: {
        firstName: 'John',
        lastName: 'Doe'
      }
    });
  });
  
  // Clean up after each test
  afterEach(() => {
    global.fetch = originalFetch;
  });
  
  describe('getAvailableTemplates', () => {
    test('should fetch templates from API successfully', async () => {
      // Arrange
      const mockTemplates = [
        { id: 'api-template-1', name: 'API Template 1' },
        { id: 'api-template-2', name: 'API Template 2' }
      ];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplates
      });
      
      // Act
      const result = await getAvailableTemplates();
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates');
      expect(result).toEqual(mockTemplates);
      expect(templates.getAllTemplates).not.toHaveBeenCalled();
    });
    
    test('should fall back to local templates if API fails', async () => {
      // Arrange
      const mockLocalTemplates = [
        { id: 'local-template-1', name: 'Local Template 1' },
        { id: 'local-template-2', name: 'Local Template 2' }
      ];
      
      mockFetch.mockRejectedValueOnce(new Error('API error'));
      (templates.getAllTemplates as jest.Mock).mockReturnValue(mockLocalTemplates);
      
      // Act
      const result = await getAvailableTemplates();
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates');
      expect(result).toEqual(mockLocalTemplates);
      expect(templates.getAllTemplates).toHaveBeenCalled();
    });
    
    test('should fall back to local templates if API returns non-ok response', async () => {
      // Arrange
      const mockLocalTemplates = [
        { id: 'local-template-1', name: 'Local Template 1' },
        { id: 'local-template-2', name: 'Local Template 2' }
      ];
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found'
      });
      (templates.getAllTemplates as jest.Mock).mockReturnValue(mockLocalTemplates);
      
      // Act
      const result = await getAvailableTemplates();
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates');
      expect(result).toEqual(mockLocalTemplates);
      expect(templates.getAllTemplates).toHaveBeenCalled();
    });
  });
  
  describe('getTemplate', () => {
    test('should fetch a specific template from API successfully', async () => {
      // Arrange
      const mockTemplate = { id: 'api-template-1', name: 'API Template 1' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplate
      });
      
      // Act
      const result = await getTemplate('api-template-1');
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates/api-template-1');
      expect(result).toEqual(mockTemplate);
      expect(templates.getTemplateById).not.toHaveBeenCalled();
    });
    
    test('should fall back to local template if API fails', async () => {
      // Arrange
      const mockLocalTemplate = { id: 'local-template-1', name: 'Local Template 1' };
      
      mockFetch.mockRejectedValueOnce(new Error('API error'));
      (templates.getTemplateById as jest.Mock).mockReturnValue(mockLocalTemplate);
      
      // Act
      const result = await getTemplate('local-template-1');
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/templates/local-template-1');
      expect(result).toEqual(mockLocalTemplate);
      expect(templates.getTemplateById).toHaveBeenCalledWith('local-template-1');
    });
  });
  
  describe('getDataAvailabilityStatus', () => {
    test('should fetch data availability from API successfully', async () => {
      // Arrange
      const mockDataAvailability = {
        'section-1': { status: 'complete', percentage: 100 },
        'section-2': { status: 'partial', percentage: 75 }
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDataAvailability
      });
      
      // Act
      const result = await getDataAvailabilityStatus();
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/data-availability');
      expect(result).toEqual(mockDataAvailability);
      expect(assessmentService.getAssessmentData).not.toHaveBeenCalled();
      expect(dataMapping.getDataCompleteness).not.toHaveBeenCalled();
    });
    
    test('should calculate data availability locally if API fails', async () => {
      // Arrange
      const mockAssessmentData = { 
        demographics: { firstName: 'John', lastName: 'Doe' } 
      };
      const mockDataCompleteness = {
        'section-1': { status: 'complete', percentage: 100 },
        'section-2': { status: 'partial', percentage: 75 }
      };
      
      mockFetch.mockRejectedValueOnce(new Error('API error'));
      (assessmentService.getAssessmentData as jest.Mock).mockResolvedValue(mockAssessmentData);
      (dataMapping.getDataCompleteness as jest.Mock).mockReturnValue(mockDataCompleteness);
      
      // Act
      const result = await getDataAvailabilityStatus();
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/data-availability');
      expect(result).toEqual(mockDataCompleteness);
      expect(assessmentService.getAssessmentData).toHaveBeenCalled();
      expect(dataMapping.getDataCompleteness).toHaveBeenCalledWith(mockAssessmentData);
    });
  });
  
  describe('createReportConfiguration', () => {
    test('should create a report configuration via API successfully', async () => {
      // Arrange
      const configInput = {
        templateId: 'template-1',
        sections: [{ id: 'section-1', included: true, detailLevel: 'standard' as DetailLevel }],
        style: 'clinical' as ReportStyle,
        reportTitle: 'Test Report'
      };
      
      const mockConfig = {
        id: 'config-123',
        name: 'Test Report',
        templateId: 'template-1',
        sections: [{ id: 'section-1', included: true, detailLevel: 'standard' }],
        style: 'clinical',
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft',
        createdBy: 'test-user'
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockConfig
      });
      
      // Act
      const result = await createReportConfiguration(configInput);
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/configurations', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: 'template-1',
          sections: [{ id: 'section-1', included: true, detailLevel: 'standard' }],
          style: 'clinical',
          title: 'Test Report'
        })
      }));
      expect(result).toEqual(mockConfig);
    });
    
    test('should create a report configuration locally if API fails', async () => {
      // Arrange
      const configInput = {
        templateId: 'template-1',
        sections: [{ id: 'section-1', included: true, detailLevel: 'standard' as DetailLevel }],
        style: 'clinical' as ReportStyle,
        reportTitle: 'Test Report'
      };
      
      mockFetch.mockRejectedValueOnce(new Error('API error'));
      
      // Mock Date.now() for predictable test
      const originalDateNow = Date.now;
      const mockTimestamp = 12345678;
      global.Date.now = jest.fn(() => mockTimestamp);
      
      // Act
      const result = await createReportConfiguration(configInput);
      
      // Assert
      expect(mockFetch).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: `report-config-${mockTimestamp}`,
        name: 'Test Report',
        templateId: 'template-1',
        sections: [{ id: 'section-1', included: true, detailLevel: 'standard' }],
        style: 'clinical',
        status: 'draft'
      });
      
      // Restore original Date.now
      global.Date.now = originalDateNow;
    });
  });
  
  describe('generateReport', () => {
    test('should generate a report via API successfully', async () => {
      // Arrange
      const config: ReportConfiguration = {
        id: 'config-123',
        name: 'Test Report',
        templateId: 'template-1',
        sections: [
          { id: 'section-1', included: true, detailLevel: 'standard' as DetailLevel }
        ],
        style: 'clinical' as ReportStyle,
        createdBy: 'test-user',
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft'
      };
      
      const mockReport = {
        id: 'report-123',
        title: 'Test Report',
        configurationId: 'config-123',
        sections: [
          { 
            id: 'section-1', 
            title: 'Section 1', 
            content: 'Test content',
            dataCompleteness: { status: 'complete', percentage: 100 },
            dataSources: ['Test source']
          }
        ],
        metadata: {
          clientName: 'John Doe',
          assessmentDate: new Date()
        },
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'draft',
        revisionHistory: []
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport
      });
      
      // Act
      const result = await generateReport(config);
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith('/api/report-drafting/generate', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      }));
      expect(result).toEqual(mockReport);
    });
    
    // Additional tests for generateReport would go here...
  });
  
  describe('updateReportSection', () => {
    test('should update a report section via API successfully', async () => {
      // Arrange
      const reportId = 'report-123';
      const sectionId = 'section-1';
      const content = 'Updated content';
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });
      
      // Act
      const result = await updateReportSection(reportId, sectionId, content);
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/report-drafting/reports/${reportId}/sections/${sectionId}`,
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        })
      );
      expect(result).toBe(true);
    });
    
    test('should return success even if API fails (fallback behavior)', async () => {
      // Arrange
      const reportId = 'report-123';
      const sectionId = 'section-1';
      const content = 'Updated content';
      
      mockFetch.mockRejectedValueOnce(new Error('API error'));
      
      // Act
      const result = await updateReportSection(reportId, sectionId, content);
      
      // Assert
      expect(mockFetch).toHaveBeenCalled();
      expect(result).toBe(true); // Returns true even on API failure
    });
  });
  
  describe('exportReport', () => {
    test('should export a report via API successfully', async () => {
      // Arrange
      const reportId = 'report-123';
      const options = {
        format: 'pdf' as const,
        includeMetadata: true,
        includeHeaders: true,
        includeFooters: true
      };
      
      const mockExportResult = {
        success: true,
        message: 'Report exported successfully',
        url: '/api/reports/download/report-123.pdf'
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockExportResult
      });
      
      // Act
      const result = await exportReport(reportId, options);
      
      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/report-drafting/reports/${reportId}/export`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options)
        })
      );
      expect(result).toEqual(mockExportResult);
    });
    
    test('should return a fallback result if API fails', async () => {
      // Arrange
      const reportId = 'report-123';
      const options = {
        format: 'pdf' as const,
        includeMetadata: true,
        includeHeaders: true,
        includeFooters: true
      };
      
      mockFetch.mockRejectedValueOnce(new Error('API error'));
      
      // Mock Date.now() for predictable test
      const originalDateNow = Date.now;
      const mockTimestamp = 12345678;
      global.Date.now = jest.fn(() => mockTimestamp);
      
      // Act
      const result = await exportReport(reportId, options);
      
      // Assert
      expect(mockFetch).toHaveBeenCalled();
      expect(result).toMatchObject({
        success: true,
        message: expect.stringContaining('(local fallback)'),
        url: expect.stringContaining(reportId)
      });
      
      // Restore original Date.now
      global.Date.now = originalDateNow;
    });
  });
});
