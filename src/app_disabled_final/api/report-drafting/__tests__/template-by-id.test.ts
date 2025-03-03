/**
 * Tests for the template by ID API route
 */

import { NextRequest } from 'next/server';
import { GET } from '../templates/[id]/route';
import * as templates from '@/lib/report-drafting/templates';

// Mock the dependencies
jest.mock('@/lib/report-drafting/templates', () => ({
  getTemplateById: jest.fn()
}));

describe('Template By ID API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    test('should return a specific template successfully', async () => {
      // Arrange
      const mockTemplate = { id: 'template-1', name: 'Template 1' };
      
      (templates.getTemplateById as jest.Mock).mockReturnValue(mockTemplate);
      
      const request = new NextRequest('http://localhost/api/report-drafting/templates/template-1');
      const params = { id: 'template-1' };
      
      // Act
      const response = await GET(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual(mockTemplate);
      expect(templates.getTemplateById).toHaveBeenCalledWith('template-1');
    });
    
    test('should return 404 if template is not found', async () => {
      // Arrange
      (templates.getTemplateById as jest.Mock).mockReturnValue(null);
      
      const request = new NextRequest('http://localhost/api/report-drafting/templates/not-found');
      const params = { id: 'not-found' };
      
      // Act
      const response = await GET(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Template not found');
    });
    
    test('should handle errors and return 500 status', async () => {
      // Arrange
      (templates.getTemplateById as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const request = new NextRequest('http://localhost/api/report-drafting/templates/template-1');
      const params = { id: 'template-1' };
      
      // Act
      const response = await GET(request, { params });
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to fetch template');
    });
  });
});
