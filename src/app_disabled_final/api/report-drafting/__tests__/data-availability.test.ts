/**
 * Tests for the data availability API route
 */

import { NextRequest } from 'next/server';
import { GET } from '../data-availability/route';
import * as assessmentService from '@/services/assessment-service';
import * as dataMapping from '@/lib/report-drafting/data-mapping';

// Mock the dependencies
jest.mock('@/services/assessment-service', () => ({
  getAssessmentData: jest.fn()
}));

jest.mock('@/lib/report-drafting/data-mapping', () => ({
  getDataCompleteness: jest.fn()
}));

describe('Data Availability API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    test('should return data availability successfully', async () => {
      // Arrange
      const mockAssessmentData = {
        demographics: { firstName: 'John', lastName: 'Doe' },
        medicalHistory: { conditions: ['Condition 1'] }
      };
      
      const mockCompleteness = {
        'initial-assessment': { status: 'complete', percentage: 100 },
        'medical-history': { status: 'partial', percentage: 75 }
      };
      
      (assessmentService.getAssessmentData as jest.Mock).mockResolvedValue(mockAssessmentData);
      (dataMapping.getDataCompleteness as jest.Mock).mockReturnValue(mockCompleteness);
      
      // Act
      const response = await GET();
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual(mockCompleteness);
      expect(assessmentService.getAssessmentData).toHaveBeenCalled();
      expect(dataMapping.getDataCompleteness).toHaveBeenCalledWith(mockAssessmentData);
    });
    
    test('should handle errors and return 500 status', async () => {
      // Arrange
      (assessmentService.getAssessmentData as jest.Mock).mockRejectedValue(new Error('Test error'));
      
      // Act
      const response = await GET();
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('Failed to calculate data availability');
    });
  });
});
