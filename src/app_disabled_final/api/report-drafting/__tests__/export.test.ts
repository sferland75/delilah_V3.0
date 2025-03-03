/**
 * Tests for the export API route
 */

import { NextRequest } from 'next/server';
import { POST } from '../reports/[id]/export/route';

describe('Export API Route', () => {
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
    test('should export a report as PDF successfully', async () => {
      // Arrange
      const requestBody = {
        format: 'pdf',
        includeMetadata: true,
        includeHeaders: true,
        includeFooters: true
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/reports/report-123/export',
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );
      
      const params = {
        id: 'report-123'
      };
      
      // Act
      const response = await POST(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        message: 'Report exported as PDF',
        url: '/api/reports/download/report-123.pdf',
        format: 'pdf'
      });
    });
    
    test('should export a report as DOCX successfully', async () => {
      // Arrange
      const requestBody = {
        format: 'docx',
        includeMetadata: true,
        includeHeaders: true,
        includeFooters: true
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/reports/report-123/export',
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );
      
      const params = {
        id: 'report-123'
      };
      
      // Act
      const response = await POST(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        message: 'Report exported as Word document',
        url: '/api/reports/download/report-123.docx',
        format: 'docx'
      });
    });
    
    test('should add report to client record successfully', async () => {
      // Arrange
      const requestBody = {
        format: 'clientRecord',
        includeMetadata: true,
        includeHeaders: true,
        includeFooters: true
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/reports/report-123/export',
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );
      
      const params = {
        id: 'report-123'
      };
      
      // Act
      const response = await POST(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        message: 'Report added to client record',
        recordId: expect.any(String),
        format: 'clientRecord'
      });
    });
    
    test('should return 400 if format is missing', async () => {
      // Arrange
      const requestBody = {
        // Missing format
        includeMetadata: true,
        includeHeaders: true,
        includeFooters: true
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/reports/report-123/export',
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );
      
      const params = {
        id: 'report-123'
      };
      
      // Act
      const response = await POST(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Missing format field');
    });
    
    test('should return 400 if format is unsupported', async () => {
      // Arrange
      const requestBody = {
        format: 'unsupported',
        includeMetadata: true,
        includeHeaders: true,
        includeFooters: true
      };
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/reports/report-123/export',
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );
      
      const params = {
        id: 'report-123'
      };
      
      // Act
      const response = await POST(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Unsupported export format');
    });
    
    test('should handle errors and return 500 status', async () => {
      // Arrange
      // Mock JSON parsing to throw error
      const originalJson = JSON.parse;
      JSON.parse = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const request = new NextRequest(
        'http://localhost/api/report-drafting/reports/report-123/export',
        {
          method: 'POST',
          body: '{"invalid": json'
        }
      );
      
      const params = {
        id: 'report-123'
      };
      
      // Act
      const response = await POST(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to export report');
      
      // Restore original JSON.parse
      JSON.parse = originalJson;
    });
  });
});
