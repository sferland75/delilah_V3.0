/**
 * Environmental Assessment Cross References Tests
 * 
 * Tests for the extractCrossReferences utility function in the Environmental Assessment mapper.
 */

import { extractCrossReferences } from '../environmentalAssessmentMapper';

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Environmental Assessment Cross References', () => {
  it('should extract bathroom equipment references from text', () => {
    const assessmentData = {
      indoorSpaces: {
        bathroom: {
          layout: 'Standard tub/shower combo, standard toilet height',
          hazards: ['Slippery surfaces', 'No grab bars'],
          accessibility: 'Difficult access for someone with mobility issues',
          equipment: [],
          recommendations: []
        }
      }
    };
    
    const text = 'Client would benefit from grab bars near toilet and in shower. A shower chair would also improve safety during bathing. Recommend non-slip bath mat.';
    
    const result = extractCrossReferences(text, assessmentData);
    
    expect(result.equipment).toContain('Grab bars');
    expect(result.equipment).toContain('Shower chair');
    expect(result.equipment).toContain('Non-slip bath mat');
  });
  
  it('should extract mobility device references from text', () => {
    const assessmentData = {
      mobilityDevices: []
    };
    
    const text = 'Client currently uses a rolling walker for all mobility. Has a wheelchair for longer distances but rarely uses it.';
    
    const result = extractCrossReferences(text, assessmentData);
    
    expect(result.mobilityDevices).toContain('Walker');
    expect(result.mobilityDevices).toContain('Wheelchair');
  });
  
  it('should extract bathroom hazard references from text', () => {
    const assessmentData = {
      indoorSpaces: {
        bathroom: {
          layout: 'Standard bathroom',
          hazards: [],
          accessibility: '',
          equipment: [],
          recommendations: []
        }
      }
    };
    
    const text = 'Bathroom presents multiple hazards including slippery tile flooring when wet, no grab bars by toilet or tub, and poor lighting during nighttime use.';
    
    const result = extractCrossReferences(text, assessmentData);
    
    expect(result.hazards).toContain('Slippery tile flooring');
    expect(result.hazards).toContain('No grab bars');
    expect(result.hazards).toContain('Poor lighting');
  });
  
  it('should extract home modification recommendations from text', () => {
    const assessmentData = {
      recommendations: []
    };
    
    const text = 'Recommend installing grab bars in bathroom, widening doorways for wheelchair access, and adding a stair lift for second floor access.';
    
    const result = extractCrossReferences(text, assessmentData);
    
    expect(result.recommendations).toContain('Install grab bars in bathroom');
    expect(result.recommendations).toContain('Widen doorways for wheelchair access');
    expect(result.recommendations).toContain('Add stair lift');
  });
  
  it('should handle text with no relevant references', () => {
    const assessmentData = {
      indoorSpaces: {
        bathroom: {
          equipment: []
        }
      },
      mobilityDevices: [],
      recommendations: []
    };
    
    const text = 'Client reported feeling well today with no new concerns.';
    
    const result = extractCrossReferences(text, assessmentData);
    
    expect(result.equipment).toEqual([]);
    expect(result.mobilityDevices).toEqual([]);
    expect(result.recommendations).toEqual([]);
    expect(result.hazards).toEqual([]);
  });
  
  it('should merge new references with existing ones', () => {
    const assessmentData = {
      indoorSpaces: {
        bathroom: {
          equipment: ['Shower chair']
        }
      },
      mobilityDevices: ['Cane']
    };
    
    const text = 'Client uses a walker and occasionally a wheelchair. Currently has a shower chair but needs grab bars.';
    
    const result = extractCrossReferences(text, assessmentData);
    
    // Should contain both existing and new references
    expect(result.equipment).toContain('Shower chair');
    expect(result.equipment).toContain('Grab bars');
    expect(result.mobilityDevices).toContain('Cane');
    expect(result.mobilityDevices).toContain('Walker');
    expect(result.mobilityDevices).toContain('Wheelchair');
  });
  
  it('should handle malformed assessment data without crashing', () => {
    const invalidData = null;
    
    const text = 'Client uses a walker and would benefit from grab bars in bathroom.';
    
    // Should not throw error
    expect(() => extractCrossReferences(text, invalidData)).not.toThrow();
    
    const result = extractCrossReferences(text, invalidData);
    expect(result).toBeDefined();
    expect(result.mobilityDevices).toContain('Walker');
    expect(result.equipment).toContain('Grab bars');
  });
});
