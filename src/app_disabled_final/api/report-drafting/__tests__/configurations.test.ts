/**
 * Tests for the configurations API route
 */

import { NextRequest } from 'next/server';
import { POST, GET } from '../configurations/route';

describe('Configurations API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Date for predictable timestamps
    const mockDate = new Date('2025-02-24T12:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST', () => {
    test('should create a new configuration successfully', async () => {
      // Arrange
      const requestBody = {
        templateId: 'template-1',
        sections: [
          { id: 'section-1', included: true, detailLevel: 'standard' }
        ],
        style: 'clinical',
        title: 'Test Report',
        clientId: 'client-1'
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/configurations',
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
        name: 'Test Report',
        templateId: 'template-1',
        sections: [
          { id: 'section-1', included: true, detailLevel: 'standard' }
        ],
        style: 'clinical',
        clientId: 'client-1',
        createdBy: 'current-user',
        createdAt: expect.any(String),
        lastModified: expect.any(String),
        status: 'draft'
      });
      expect(data.id).toMatch(/^config-/);
    });
    
    test('should return 400 if required fields are missing', async () => {
      // Arrange
      const requestBody = {
        // Missing templateId
        sections: [],
        // Missing style
        title: 'Test Report'
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/configurations',
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
      // Mock JSON parsing to throw error
      const originalJson = JSON.parse;
      JSON.parse = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/configurations',
        {
          method: 'POST',
          body: '{"invalid": json'
        }
      );
      
      // Act
      const response = await POST(request);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to create report configuration');
      
      // Restore original JSON.parse
      JSON.parse = originalJson;
    });
  });

  describe('GET', () => {
    test('should return an empty array initially', async () => {
      // Act
      const response = await GET();
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });
    
    test('should handle errors and return 500 status', async () => {
      // Arrange
      // Mock response.json to throw error
      const originalJson = JSON.stringify;
      JSON.stringify = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      // Act
      const response = await GET();
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to fetch report configurations');
      
      // Restore original JSON.stringify
      JSON.stringify = originalJson;
    });
  });
});
