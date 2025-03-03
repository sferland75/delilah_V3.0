/**
 * Updated Symptoms Schema Tests
 * 
 * Tests for the updated symptoms schema that supports multiple physical
 * and cognitive symptoms, and migration utilities between schemas.
 */

import { 
  symptomsSchemaUpdated, 
  symptomsSchema,
  migrateToUpdatedSchema,
  migrateToLegacySchema,
  PhysicalSymptom,
  CognitiveSymptom,
  EmotionalSymptom,
  SymptomsUpdated,
  Symptoms
} from '../schema.updated';
import { z } from 'zod';

describe('Symptoms Assessment Updated Schema', () => {
  // Test the updated schema validation
  describe('Schema Validation', () => {
    it('validates valid data correctly', () => {
      const validData: SymptomsUpdated = {
        general: {
          notes: 'Test notes about symptoms'
        },
        physical: [
          {
            id: 'physical-1',
            location: 'Neck Pain',
            intensity: 'Moderate',
            description: 'Sharp pain that radiates to shoulders',
            frequency: 'Daily',
            duration: '3-4 hours',
            aggravating: ['Sitting for long periods', 'Looking down'],
            alleviating: ['Heat therapy', 'Gentle stretching']
          }
        ],
        cognitive: [
          {
            id: 'cognitive-1',
            type: 'Memory Issues',
            impact: 'Difficulty recalling recent events',
            management: 'Using notes and reminders',
            frequency: 'Daily',
            triggers: ['Stress', 'Fatigue'],
            coping: ['Lists', 'Calendar alerts']
          }
        ],
        emotional: [
          {
            type: 'Anxiety',
            severity: 'moderate',
            frequency: 'daily',
            impact: 'Interferes with social activities',
            management: 'Deep breathing, counseling'
          }
        ]
      };
      
      // Parsing should succeed without errors
      const result = symptomsSchemaUpdated.safeParse(validData);
      expect(result.success).toBe(true);
    });
    
    it('requires at least one physical symptom with required fields', () => {
      const invalidData = {
        general: {
          notes: 'Test notes'
        },
        physical: [], // Empty array is invalid
        cognitive: [
          {
            id: 'cognitive-1',
            type: 'Memory Issues',
            impact: 'Test impact',
            management: 'Test management',
            frequency: 'Daily',
            triggers: [],
            coping: []
          }
        ],
        emotional: []
      };
      
      // Parsing should fail
      const result = symptomsSchemaUpdated.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        // Error should mention physical symptoms
        expect(result.error.format().physical?._errors).toContain(
          'At least one physical symptom is required'
        );
      }
    });
    
    it('requires at least one cognitive symptom with required fields', () => {
      const invalidData = {
        general: {
          notes: 'Test notes'
        },
        physical: [
          {
            id: 'physical-1',
            location: 'Test location',
            intensity: 'Test intensity',
            description: 'Test description',
            frequency: 'Test frequency',
            duration: 'Test duration',
            aggravating: [],
            alleviating: []
          }
        ],
        cognitive: [], // Empty array is invalid
        emotional: []
      };
      
      // Parsing should fail
      const result = symptomsSchemaUpdated.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        // Error should mention cognitive symptoms
        expect(result.error.format().cognitive?._errors).toContain(
          'At least one cognitive symptom is required'
        );
      }
    });
    
    it('validates required fields for physical symptoms', () => {
      const invalidData = {
        general: {
          notes: 'Test notes'
        },
        physical: [
          {
            id: 'physical-1',
            location: '', // Empty location is invalid
            intensity: 'Test intensity',
            description: 'Test description',
            frequency: 'Test frequency',
            duration: 'Test duration',
            aggravating: [],
            alleviating: []
          }
        ],
        cognitive: [
          {
            id: 'cognitive-1',
            type: 'Memory Issues',
            impact: 'Test impact',
            management: 'Test management',
            frequency: 'Daily',
            triggers: [],
            coping: []
          }
        ],
        emotional: []
      };
      
      // Parsing should fail
      const result = symptomsSchemaUpdated.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        // Should have error for location field
        expect(result.error.format().physical?.[0]?.location?._errors).toContain(
          'Location is required'
        );
      }
    });
    
    it('validates required fields for cognitive symptoms', () => {
      const invalidData = {
        general: {
          notes: 'Test notes'
        },
        physical: [
          {
            id: 'physical-1',
            location: 'Test location',
            intensity: 'Test intensity',
            description: 'Test description',
            frequency: 'Test frequency',
            duration: 'Test duration',
            aggravating: [],
            alleviating: []
          }
        ],
        cognitive: [
          {
            id: 'cognitive-1',
            type: '', // Empty type is invalid
            impact: 'Test impact',
            management: 'Test management',
            frequency: 'Test frequency',
            triggers: [],
            coping: []
          }
        ],
        emotional: []
      };
      
      // Parsing should fail
      const result = symptomsSchemaUpdated.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        // Should have error for type field
        expect(result.error.format().cognitive?.[0]?.type?._errors).toContain(
          'Type of cognitive issue is required'
        );
      }
    });
  });
  
  // Test migration utilities
  describe('Migration Utilities', () => {
    it('migrates from legacy schema to updated schema correctly', () => {
      const legacyData: Symptoms = {
        general: {
          notes: 'Legacy notes'
        },
        physical: {
          location: 'Headache',
          intensity: 'Severe',
          description: 'Throbbing pain',
          frequency: 'Weekly',
          duration: '6-8 hours',
          aggravating: ['Bright lights', 'Noise'],
          alleviating: ['Darkness', 'Rest']
        },
        cognitive: {
          type: 'Memory Issues',
          impact: 'Difficulty recalling recent events',
          management: 'Using notes',
          frequency: 'Daily',
          triggers: ['Stress'],
          coping: ['Lists']
        },
        emotional: [
          {
            type: 'Anxiety',
            severity: 'moderate',
            frequency: 'daily',
            impact: 'Social anxiety',
            management: 'Breathing exercises'
          }
        ]
      };
      
      // Migrate to updated schema
      const updatedData = migrateToUpdatedSchema(legacyData);
      
      // Check general section
      expect(updatedData.general.notes).toBe(legacyData.general.notes);
      
      // Check physical symptoms
      expect(updatedData.physical).toHaveLength(1);
      expect(updatedData.physical[0].location).toBe(legacyData.physical.location);
      expect(updatedData.physical[0].intensity).toBe(legacyData.physical.intensity);
      expect(updatedData.physical[0].aggravating).toEqual(legacyData.physical.aggravating);
      
      // Check cognitive symptoms
      expect(updatedData.cognitive).toHaveLength(1);
      expect(updatedData.cognitive[0].type).toBe(legacyData.cognitive.type);
      expect(updatedData.cognitive[0].impact).toBe(legacyData.cognitive.impact);
      expect(updatedData.cognitive[0].triggers).toEqual(legacyData.cognitive.triggers);
      
      // Check emotional symptoms (should be unchanged)
      expect(updatedData.emotional).toEqual(legacyData.emotional);
      
      // Validate against updated schema
      const result = symptomsSchemaUpdated.safeParse(updatedData);
      expect(result.success).toBe(true);
    });
    
    it('migrates from updated schema to legacy schema correctly', () => {
      const updatedData: SymptomsUpdated = {
        general: {
          notes: 'Updated notes'
        },
        physical: [
          {
            id: 'physical-1',
            location: 'Neck Pain',
            intensity: 'Moderate',
            description: 'Sharp pain',
            frequency: 'Daily',
            duration: '3-4 hours',
            aggravating: ['Sitting', 'Looking down'],
            alleviating: ['Heat', 'Stretching']
          },
          {
            id: 'physical-2',
            location: 'Back Pain',
            intensity: 'Severe',
            description: 'Dull ache',
            frequency: 'Constant',
            duration: 'All day',
            aggravating: ['Bending', 'Lifting'],
            alleviating: ['Rest', 'Medication']
          }
        ],
        cognitive: [
          {
            id: 'cognitive-1',
            type: 'Memory Issues',
            impact: 'Difficulty recalling',
            management: 'Using notes',
            frequency: 'Daily',
            triggers: ['Stress'],
            coping: ['Lists']
          }
        ],
        emotional: [
          {
            type: 'Anxiety',
            severity: 'moderate',
            frequency: 'daily',
            impact: 'Social anxiety',
            management: 'Breathing exercises'
          }
        ]
      };
      
      // Migrate to legacy schema
      const legacyData = migrateToLegacySchema(updatedData);
      
      // Check general section
      expect(legacyData.general.notes).toBe(updatedData.general.notes);
      
      // Check physical symptoms (should use first symptom only)
      expect(legacyData.physical.location).toBe(updatedData.physical[0].location);
      expect(legacyData.physical.intensity).toBe(updatedData.physical[0].intensity);
      expect(legacyData.physical.aggravating).toEqual(updatedData.physical[0].aggravating);
      
      // Check cognitive symptoms (should use first symptom only)
      expect(legacyData.cognitive.type).toBe(updatedData.cognitive[0].type);
      expect(legacyData.cognitive.impact).toBe(updatedData.cognitive[0].impact);
      expect(legacyData.cognitive.triggers).toEqual(updatedData.cognitive[0].triggers);
      
      // Check emotional symptoms (should be unchanged)
      expect(legacyData.emotional).toEqual(updatedData.emotional);
      
      // Validate against legacy schema
      const result = symptomsSchema.safeParse(legacyData);
      expect(result.success).toBe(true);
    });
    
    it('handles empty arrays in updated schema when migrating to legacy', () => {
      const updatedData: SymptomsUpdated = {
        general: {
          notes: 'Test notes'
        },
        physical: [], // Empty physical array
        cognitive: [], // Empty cognitive array
        emotional: []
      };
      
      // Migrate to legacy schema
      const legacyData = migrateToLegacySchema(updatedData);
      
      // Should create default empty objects
      expect(legacyData.physical.location).toBe('');
      expect(legacyData.physical.intensity).toBe('');
      expect(legacyData.physical.aggravating).toEqual([]);
      
      expect(legacyData.cognitive.type).toBe('');
      expect(legacyData.cognitive.impact).toBe('');
      expect(legacyData.cognitive.triggers).toEqual([]);
    });
  });
  
  // Test for types
  describe('TypeScript Types', () => {
    it('ensures PhysicalSymptom type has all required properties', () => {
      // This is a type check that will be validated at compile time
      const symptom: PhysicalSymptom = {
        id: 'test-id',
        location: 'Test location',
        intensity: 'Test intensity',
        description: 'Test description',
        frequency: 'Test frequency',
        duration: 'Test duration',
        aggravating: [],
        alleviating: []
      };
      
      // Just ensure the assignment works
      expect(symptom).toBeDefined();
    });
    
    it('ensures CognitiveSymptom type has all required properties', () => {
      // This is a type check that will be validated at compile time
      const symptom: CognitiveSymptom = {
        id: 'test-id',
        type: 'Test type',
        impact: 'Test impact',
        management: 'Test management',
        frequency: 'Test frequency',
        triggers: [],
        coping: []
      };
      
      // Just ensure the assignment works
      expect(symptom).toBeDefined();
    });
    
    it('ensures EmotionalSymptom type has all required properties', () => {
      // This is a type check that will be validated at compile time
      const symptom: EmotionalSymptom = {
        type: 'Test type',
        severity: 'Test severity',
        frequency: 'Test frequency',
        impact: 'Test impact',
        management: 'Test management'
      };
      
      // Just ensure the assignment works
      expect(symptom).toBeDefined();
    });
  });
});
