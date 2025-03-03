/**
 * Tests for the section update API route
 */

import { NextRequest } from 'next/server';
import { PATCH } from '../reports/[id]/sections/[sectionId]/route';

describe('Update Section API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Date for predictable timestamps
    const mockDate = new Date('2025-02-24T12:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('PATCH', () => {
    test('should update a section successfully', async () => {
      // Arrange
      const requestBody = {
        content: 'Updated content for the section'
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/reports/report-123/sections/section-1',
        {
          method: 'PATCH',
          body: JSON.stringify(requestBody)
        }
      );
      
      const params = {
        id: 'report-123',
        sectionId: 'section-1'
      };
      
      // Act
      const response = await PATCH(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        reportId: 'report-123',
        sectionId: 'section-1',
        message: 'Section updated successfully',
        timestamp: expect.any(String)
      });
    });
    
    test('should return 400 if content is missing', async () => {
      // Arrange
      const requestBody = {
        // Missing content field
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/reports/report-123/sections/section-1',
        {
          method: 'PATCH',
          body: JSON.stringify(requestBody)
        }
      );
      
      const params = {
        id: 'report-123',
        sectionId: 'section-1'
      };
      
      // Act
      const response = await PATCH(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Missing content field');
    });
    
    test('should handle errors and return 500 status', async () => {
      // Arrange
      // Mock JSON parsing to throw error
      const originalJson = JSON.parse;
      JSON.parse = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/reports/report-123/sections/section-1',
        {
          method: 'PATCH',
          body: '{"invalid": json'
        }
      );
      
      const params = {
        id: 'report-123',
        sectionId: 'section-1'
      };
      
      // Act
      const response = await PATCH(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to update section');
      
      // Restore original JSON.parse
      JSON.parse = originalJson;
    });
  });
});
