/**
 * Symptoms Assessment Schema Migration Tests
 * 
 * These tests focus on the migration functionality between the legacy schema
 * (single physical/cognitive symptom) and the updated schema (multiple symptoms).
 */

import { 
  migrateToUpdatedSchema,
  migrateToLegacySchema,
  Symptoms,
  SymptomsUpdated
} from '../schema.updated';

describe('Symptoms Assessment Schema Migration', () => {
  describe('Legacy to Updated Schema Migration', () => {
    it('preserves all data when migrating from legacy to updated schema', () => {
      const legacyData: Symptoms = {
        general: {
          notes: 'Legacy symptom notes'
        },
        physical: {
          location: 'Lower Back',
          intensity: 'Moderate',
          description: 'Dull ache with occasional shooting pain',
          frequency: 'Daily',
          duration: 'Most of the day',
          aggravating: ['Sitting for long periods', 'Bending forward'],
          alleviating: ['Walking', 'Lying down', 'Heat therapy']
        },
        cognitive: {
          type: 'Memory Issues',
          impact: 'Difficulty recalling recent conversations',
          management: 'Using phone for notes and reminders',
          frequency: 'Daily',
          triggers: ['Stress', 'Fatigue', 'Multi-tasking'],
          coping: ['Written lists', 'Calendar reminders', 'Reducing distractions']
        },
        emotional: [
          {
            type: 'Anxiety',
            severity: 'moderate',
            frequency: 'daily',
            impact: 'Feeling tense and worried about health',
            management: 'Breathing exercises, mindfulness'
          },
          {
            type: 'Frustration',
            severity: 'mild',
            frequency: 'intermittent',
            impact: 'Occasional irritability when tasks are difficult',
            management: 'Taking breaks, talking to supportive friends'
          }
        ]
      };
      
      // Perform migration
      const updatedData = migrateToUpdatedSchema(legacyData);
      
      // Verify general section
      expect(updatedData.general).toEqual(legacyData.general);
      
      // Verify physical symptoms
      expect(updatedData.physical).toHaveLength(1);
      expect(updatedData.physical[0].location).toBe(legacyData.physical.location);
      expect(updatedData.physical[0].intensity).toBe(legacyData.physical.intensity);
      expect(updatedData.physical[0].description).toBe(legacyData.physical.description);
      expect(updatedData.physical[0].frequency).toBe(legacyData.physical.frequency);
      expect(updatedData.physical[0].duration).toBe(legacyData.physical.duration);
      expect(updatedData.physical[0].aggravating).toEqual(legacyData.physical.aggravating);
      expect(updatedData.physical[0].alleviating).toEqual(legacyData.physical.alleviating);
      
      // Verify cognitive symptoms
      expect(updatedData.cognitive).toHaveLength(1);
      expect(updatedData.cognitive[0].type).toBe(legacyData.cognitive.type);
      expect(updatedData.cognitive[0].impact).toBe(legacyData.cognitive.impact);
      expect(updatedData.cognitive[0].management).toBe(legacyData.cognitive.management);
      expect(updatedData.cognitive[0].frequency).toBe(legacyData.cognitive.frequency);
      expect(updatedData.cognitive[0].triggers).toEqual(legacyData.cognitive.triggers);
      expect(updatedData.cognitive[0].coping).toEqual(legacyData.cognitive.coping);
      
      // Verify emotional symptoms (should be unchanged)
      expect(updatedData.emotional).toEqual(legacyData.emotional);
    });
    
    it('handles empty data when migrating from legacy to updated schema', () => {
      const emptyLegacyData: Symptoms = {
        general: {
          notes: ''
        },
        physical: {
          location: '',
          intensity: '',
          description: '',
          frequency: '',
          duration: '',
          aggravating: [],
          alleviating: []
        },
        cognitive: {
          type: '',
          impact: '',
          management: '',
          frequency: '',
          triggers: [],
          coping: []
        },
        emotional: []
      };
      
      // Perform migration
      const updatedData = migrateToUpdatedSchema(emptyLegacyData);
      
      // Verify structures are created correctly even with empty data
      expect(updatedData.physical).toHaveLength(1);
      expect(updatedData.physical[0].location).toBe('');
      expect(updatedData.physical[0].id).toBeDefined(); // Should have a generated ID
      
      expect(updatedData.cognitive).toHaveLength(1);
      expect(updatedData.cognitive[0].type).toBe('');
      expect(updatedData.cognitive[0].id).toBeDefined(); // Should have a generated ID
      
      expect(updatedData.emotional).toEqual([]);
    });
    
    it('adds ID fields to symptoms when migrating from legacy to updated schema', () => {
      const legacyData: Symptoms = {
        general: {
          notes: 'Test notes'
        },
        physical: {
          location: 'Neck',
          intensity: 'Mild',
          description: 'Stiffness',
          frequency: 'Morning',
          duration: '1-2 hours',
          aggravating: [],
          alleviating: []
        },
        cognitive: {
          type: 'Concentration',
          impact: 'Difficulty focusing',
          management: 'Breaks',
          frequency: 'Daily',
          triggers: [],
          coping: []
        },
        emotional: []
      };
      
      // Perform migration
      const updatedData = migrateToUpdatedSchema(legacyData);
      
      // Verify ID fields are created
      expect(updatedData.physical[0].id).toBeDefined();
      expect(typeof updatedData.physical[0].id).toBe('string');
      
      expect(updatedData.cognitive[0].id).toBeDefined();
      expect(typeof updatedData.cognitive[0].id).toBe('string');
    });
  });
  
  describe('Updated to Legacy Schema Migration', () => {
    it('preserves first symptom data when migrating from updated to legacy schema', () => {
      const updatedData: SymptomsUpdated = {
        general: {
          notes: 'Updated symptom notes'
        },
        physical: [
          {
            id: 'physical-1',
            location: 'Neck',
            intensity: 'Moderate',
            description: 'Stiffness with occasional sharp pain',
            frequency: 'Daily',
            duration: 'Morning hours',
            aggravating: ['Looking down', 'Computer work'],
            alleviating: ['Stretching', 'Heat therapy']
          },
          {
            id: 'physical-2',
            location: 'Knee',
            intensity: 'Severe',
            description: 'Sharp pain when bending',
            frequency: 'With activity',
            duration: '1-2 hours',
            aggravating: ['Stairs', 'Squatting'],
            alleviating: ['Rest', 'Ice']
          }
        ],
        cognitive: [
          {
            id: 'cognitive-1',
            type: 'Concentration',
            impact: 'Difficulty focusing on tasks',
            management: 'Taking regular breaks',
            frequency: 'Daily',
            triggers: ['Noise', 'Fatigue'],
            coping: ['Quiet environment', 'Task lists']
          },
          {
            id: 'cognitive-2',
            type: 'Processing Speed',
            impact: 'Slower thinking and response',
            management: 'Allowing extra time',
            frequency: 'Constant',
            triggers: ['Complex tasks', 'Pressure'],
            coping: ['Breaking tasks down', 'Simplifying']
          }
        ],
        emotional: [
          {
            type: 'Anxiety',
            severity: 'moderate',
            frequency: 'daily',
            impact: 'Worry about health',
            management: 'Meditation'
          }
        ]
      };
      
      // Perform migration
      const legacyData = migrateToLegacySchema(updatedData);
      
      // Verify general section
      expect(legacyData.general).toEqual(updatedData.general);
      
      // Verify physical symptoms (should only keep the first one)
      expect(legacyData.physical.location).toBe(updatedData.physical[0].location);
      expect(legacyData.physical.intensity).toBe(updatedData.physical[0].intensity);
      expect(legacyData.physical.description).toBe(updatedData.physical[0].description);
      expect(legacyData.physical.frequency).toBe(updatedData.physical[0].frequency);
      expect(legacyData.physical.duration).toBe(updatedData.physical[0].duration);
      expect(legacyData.physical.aggravating).toEqual(updatedData.physical[0].aggravating);
      expect(legacyData.physical.alleviating).toEqual(updatedData.physical[0].alleviating);
      
      // Verify cognitive symptoms (should only keep the first one)
      expect(legacyData.cognitive.type).toBe(updatedData.cognitive[0].type);
      expect(legacyData.cognitive.impact).toBe(updatedData.cognitive[0].impact);
      expect(legacyData.cognitive.management).toBe(updatedData.cognitive[0].management);
      expect(legacyData.cognitive.frequency).toBe(updatedData.cognitive[0].frequency);
      expect(legacyData.cognitive.triggers).toEqual(updatedData.cognitive[0].triggers);
      expect(legacyData.cognitive.coping).toEqual(updatedData.cognitive[0].coping);
      
      // Verify emotional symptoms (should be unchanged)
      expect(legacyData.emotional).toEqual(updatedData.emotional);
    });
    
    it('handles empty symptom arrays when migrating from updated to legacy schema', () => {
      const emptyUpdatedData: SymptomsUpdated = {
        general: {
          notes: 'Test notes'
        },
        physical: [], // Empty array
        cognitive: [], // Empty array
        emotional: []
      };
      
      // Perform migration
      const legacyData = migrateToLegacySchema(emptyUpdatedData);
      
      // Verify default empty structures are created
      expect(legacyData.physical.location).toBe('');
      expect(legacyData.physical.intensity).toBe('');
      expect(legacyData.physical.description).toBe('');
      expect(legacyData.physical.aggravating).toEqual([]);
      
      expect(legacyData.cognitive.type).toBe('');
      expect(legacyData.cognitive.impact).toBe('');
      expect(legacyData.cognitive.triggers).toEqual([]);
      
      expect(legacyData.emotional).toEqual([]);
    });
    
    it('provides data lossless round-trip conversion for single symptom data', () => {
      // Start with legacy data
      const originalLegacyData: Symptoms = {
        general: {
          notes: 'Original notes'
        },
        physical: {
          location: 'Lower Back',
          intensity: 'Moderate',
          description: 'Dull ache',
          frequency: 'Daily',
          duration: 'All day',
          aggravating: ['Sitting', 'Bending'],
          alleviating: ['Walking', 'Heat']
        },
        cognitive: {
          type: 'Memory',
          impact: 'Forgetfulness',
          management: 'Notes',
          frequency: 'Daily',
          triggers: ['Stress'],
          coping: ['Lists']
        },
        emotional: [
          {
            type: 'Anxiety',
            severity: 'moderate',
            frequency: 'daily',
            impact: 'Worry',
            management: 'Breathing'
          }
        ]
      };
      
      // Migrate to updated schema
      const updatedData = migrateToUpdatedSchema(originalLegacyData);
      
      // Migrate back to legacy schema
      const roundTripLegacyData = migrateToLegacySchema(updatedData);
      
      // Verify data integrity for round-trip conversion
      expect(roundTripLegacyData.general).toEqual(originalLegacyData.general);
      
      expect(roundTripLegacyData.physical.location).toBe(originalLegacyData.physical.location);
      expect(roundTripLegacyData.physical.intensity).toBe(originalLegacyData.physical.intensity);
      expect(roundTripLegacyData.physical.description).toBe(originalLegacyData.physical.description);
      expect(roundTripLegacyData.physical.frequency).toBe(originalLegacyData.physical.frequency);
      expect(roundTripLegacyData.physical.duration).toBe(originalLegacyData.physical.duration);
      expect(roundTripLegacyData.physical.aggravating).toEqual(originalLegacyData.physical.aggravating);
      expect(roundTripLegacyData.physical.alleviating).toEqual(originalLegacyData.physical.alleviating);
      
      expect(roundTripLegacyData.cognitive.type).toBe(originalLegacyData.cognitive.type);
      expect(roundTripLegacyData.cognitive.impact).toBe(originalLegacyData.cognitive.impact);
      expect(roundTripLegacyData.cognitive.management).toBe(originalLegacyData.cognitive.management);
      expect(roundTripLegacyData.cognitive.frequency).toBe(originalLegacyData.cognitive.frequency);
      expect(roundTripLegacyData.cognitive.triggers).toEqual(originalLegacyData.cognitive.triggers);
      expect(roundTripLegacyData.cognitive.coping).toEqual(originalLegacyData.cognitive.coping);
      
      expect(roundTripLegacyData.emotional).toEqual(originalLegacyData.emotional);
    });
  });
});
