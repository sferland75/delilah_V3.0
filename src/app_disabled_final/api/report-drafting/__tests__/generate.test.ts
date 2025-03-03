/**
 * Tests for the report generation API route
 */

import { NextRequest } from 'next/server';
import { POST } from '../generate/route';
import * as assessmentService from '@/services/assessment-service';
import * as templates from '@/lib/report-drafting/templates';
import * as dataMapping from '@/lib/report-drafting/data-mapping';
import * as anthropicService from '@/lib/report-drafting/anthropic-service';

// Mock the dependencies
jest.mock('@/services/assessment-service', () => ({
  getAssessmentData: jest.fn()
}));

jest.mock('@/lib/report-drafting/templates', () => ({
  getSectionMetadata: jest.fn()
}));

jest.mock('@/lib/report-drafting/data-mapping', () => ({
  getDataCompleteness: jest.fn(),
  extractSectionData: jest.fn()
}));

jest.mock('@/lib/report-drafting/anthropic-service', () => ({
  generateReportSections: jest.fn()
}));

describe('Generate API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Date for predictable timestamps
    const mockDate = new Date('2025-02-24T12:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    
    // Set up default mocks
    (assessmentService.getAssessmentData as jest.Mock).mockResolvedValue({
      demographics: { firstName: 'John', lastName: 'Doe' }
    });
    
    (templates.getSectionMetadata as jest.Mock).mockImplementation((id) => ({
      title: `Section ${id.split('-')[1]}`,
      description: `Description for section ${id}`
    }));
    
    (dataMapping.getDataCompleteness as jest.Mock).mockReturnValue({
      'section-1': { status: 'complete', percentage: 100 },
      'section-2': { status: 'partial', percentage: 75 }
    });
    
    (anthropicService.generateReportSections as jest.Mock).mockResolvedValue([
      {
        id: 'section-1',
        title: 'Section 1',
        content: 'Generated content for section 1',
        dataCompleteness: { status: 'complete', percentage: 100 },
        dataSources: ['Source 1']
      }
    ]);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST', () => {
    test('should generate a report successfully', async () => {
      // Arrange
      const requestBody = {
        id: 'config-123',
        templateId: 'template-1',
        sections: [
          { id: 'section-1', included: true, detailLevel: 'standard' },
          { id: 'section-2', included: false, detailLevel: 'brief' }
        ],
        style: 'clinical',
        name: 'Test Report',
        clientId: 'client-1'
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/generate',
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );
      
      // Act
      const response = await POST(request);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        id: expect.stringMatching(/^report-/),
        title: 'Test Report',
        configurationId: 'config-123',
        sections: [
          {
            id: 'section-1',
            title: 'Section 1',
            content: 'Generated content for section 1'
          }
        ],
        metadata: {
          clientName: 'John Doe',
          clientId: 'client-1',
          assessmentDate: expect.any(String),
          authorName: 'Current User'
        },
        status: 'draft',
        revisionHistory: expect.arrayContaining([
          expect.objectContaining({
            userId: 'current-user',
            userName: 'Current User',
            changes: expect.arrayContaining([
              expect.objectContaining({
                sectionId: 'section-1',
                type: 'add'
              })
            ])
          })
        ])
      });
      
      // Check that only included sections were processed
      expect(anthropicService.generateReportSections).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'section-1' })
        ]),
        'clinical',
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe'
        })
      );
    });
    
    test('should return 400 if required fields are missing', async () => {
      // Arrange
      const requestBody = {
        // Missing templateId
        sections: [],
        // Missing style
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/generate',
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );
      
      // Act
      const response = await POST(request);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Missing required fields');
    });
    
    test('should handle errors and return 500 status', async () => {
      // Arrange
      const requestBody = {
        id: 'config-123',
        templateId: 'template-1',
        sections: [
          { id: 'section-1', included: true, detailLevel: 'standard' }
        ],
        style: 'clinical',
        name: 'Test Report'
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/generate',
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );
      
      // Mock the anthropic service to throw an error
      (anthropicService.generateReportSections as jest.Mock).mockRejectedValue(
        new Error('API error')
      );
      
      // Act
      const response = await POST(request);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to generate report');
    });
  });
});
