/**
 * Tests for the PDF Extraction Functions
 * 
 * These tests validate the PDF text extraction and helper functions.
 */

import { 
  extractListItems, 
  extractSeverity, 
  extractImpact,
  extractActivities,
  extractAssistance
} from '../pdfExtraction';

describe('PDF Extraction Helpers', () => {
  describe('extractListItems', () => {
    it('should extract numbered list items', () => {
      const text = `
        1. First item
        2. Second item
        3. Third item with more detail
      `;
      
      const result = extractListItems(text);
      
      expect(result).toHaveLength(3);
      expect(result).toContain('First item');
      expect(result).toContain('Second item');
      expect(result).toContain('Third item with more detail');
    });
    
    it('should extract bullet point list items', () => {
      const text = `
        • First bullet point
        • Second bullet point
        - Third item with dash
        * Fourth item with asterisk
      `;
      
      const result = extractListItems(text);
      
      expect(result).toHaveLength(4);
      expect(result).toContain('First bullet point');
      expect(result).toContain('Second bullet point');
      expect(result).toContain('Third item with dash');
      expect(result).toContain('Fourth item with asterisk');
    });
    
    it('should fall back to line breaks when no formal list format is detected', () => {
      const text = `
        First paragraph
        
        Second paragraph
        
        Third paragraph
      `;
      
      const result = extractListItems(text);
      
      expect(result).toHaveLength(3);
      expect(result).toContain('First paragraph');
      expect(result).toContain('Second paragraph');
      expect(result).toContain('Third paragraph');
    });
  });
  
  describe('extractSeverity', () => {
    it('should extract numeric pain scales', () => {
      expect(extractSeverity('pain rated as 7/10')).toBe('7/10');
      expect(extractSeverity('Pain level: 4/10')).toBe('4/10');
      expect(extractSeverity('Patient reports pain at 8/10')).toBe('8/10');
    });
    
    it('should extract severity descriptions', () => {
      expect(extractSeverity('Patient reports mild pain')).toBe('mild');
      expect(extractSeverity('Symptoms are described as moderate')).toBe('moderate');
      expect(extractSeverity('Patient experiences severe headaches')).toBe('severe');
    });
    
    it('should return null when no severity is found', () => {
      expect(extractSeverity('Patient reports ongoing symptoms')).toBeNull();
    });
  });
  
  describe('extractImpact', () => {
    it('should extract impact descriptions', () => {
      expect(extractImpact('Pain affects daily activities')).toBe('daily activities');
      expect(extractImpact('Symptoms impact ability to work')).toBe('ability to work');
      expect(extractImpact('Condition interferes with sleep and concentration')).toBe('sleep and concentration');
    });
    
    it('should return null when no impact is found', () => {
      expect(extractImpact('Patient reports ongoing symptoms')).toBeNull();
    });
  });
  
  describe('extractActivities', () => {
    it('should extract activities using common action verbs', () => {
      const text = `
        Patient performs personal care independently.
        Engages in light household cleaning.
        Walking short distances daily.
        Completes meal preparation with assistance.
      `;
      
      const result = extractActivities(text);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('personal care independently');
      expect(result).toContain('light household cleaning');
      expect(result).toContain('short distances daily');
    });
  });
  
  describe('extractAssistance', () => {
    it('should extract assistance needs', () => {
      const text = `
        Patient requires assistance with bathing and dressing.
        Needs help for meal preparation.
        Spouse assists with medication management.
        Dependent on family for transportation.
      `;
      
      const result = extractAssistance(text);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('bathing and dressing');
      expect(result).toContain('meal preparation');
      expect(result).toContain('medication management');
      expect(result).toContain('family for transportation');
    });
  });
});
