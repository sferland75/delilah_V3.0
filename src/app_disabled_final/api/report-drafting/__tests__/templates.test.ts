/**
 * Tests for the templates API route
 */

import { NextRequest } from 'next/server';
import { GET } from '../templates/route';
import * as templates from '@/lib/report-drafting/templates';

// Mock the dependencies
jest.mock('@/lib/report-drafting/templates', () => ({
  getAllTemplates: jest.fn()
}));

describe('Templates API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    test('should return all templates successfully', async () => {
      // Arrange
      const mockTemplates = [
        { id: 'template-1', name: 'Template 1' },
        { id: 'template-2', name: 'Template 2' }
      ];
      
      (templates.getAllTemplates as jest.Mock).mockReturnValue(mockTemplates);
      
      // Act
      const response = await GET();
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual(mockTemplates);
      expect(templates.getAllTemplates).toHaveBeenCalled();
    });
    
    test('should handle errors and return 500 status', async () => {
      // Arrange
      (templates.getAllTemplates as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });
      
      // Act
      const response = await GET();
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to fetch templates');
    });
  });
});
