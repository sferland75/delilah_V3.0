/**
 * Activities of Daily Living Mapper Service Tests
 * 
 * Tests for the bidirectional mapping functionality between
 * context data and form data structures for the Activities of Daily Living section.
 */

import { 
  mapContextToForm, 
  mapFormToContext,
  inferIndependenceLevel,
  exportADLToJson,
  importADLFromJson
} from '../activitiesOfDailyLivingMapper';

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Activities of Daily Living Mapper Service', () => {
  // Define default mock data structures
  const mockInitialFormState = {
    data: {
      basicADLs: {
        bathing: {
          independence: '',
          details: '',
          equipment: []
        },
        dressing: {
          independence: '',
          details: '',
          equipment: []
        },
        grooming: {
          independence: '',
          details: '',
          equipment: []
        },
        toileting: {
          independence: '',
          details: '',
          equipment: []
        },
        feeding: {
          independence: '',
          details: '',
          equipment: []
        },
        mobility: {
          independence: '',
          details: '',
          equipment: []
        }
      },
      instrumentalADLs: {
        mealPreparation: {
          independence: '',
          details: '',
          equipment: []
        },
        homeManagement: {
          independence: '',
          details: '',
          equipment: []
        },
        financialManagement: {
          independence: '',
          details: '',
          equipment: []
        },
        shopping: {
          independence: '',
          details: '',
          equipment: []
        },
        transportation: {
          independence: '',
          details: '',
          equipment: []
        },
        communication: {
          independence: '',
          details: '',
          equipment: []
        },
        medicationManagement: {
          independence: '',
          details: '',
          equipment: []
        }
      },
      leisureActivities: {
        physical: [],
        social: [],
        creative: [],
        cognitive: [],
        spiritual: []
      },
      summary: ''
    }
  };

  const mockContextData = {
    adlAssessment: {
      basicADLs: {
        bathing: {
          level: 'Modified Independent',
          details: 'Uses shower chair and handheld shower head. Requires setup assistance.',
          equipment: ['Shower chair', 'Handheld shower head', 'Grab bars'],
          adaptations: 'Uses long-handled sponge for lower extremities',
          notes: 'Prefers evening showers due to morning stiffness'
        },
        dressing: {
          level: 'Needs Minimal Assistance',
          details: 'Independent with upper body dressing, needs help with lower body clothing and footwear.',
          equipment: ['Reacher', 'Sock aid', 'Long-handled shoe horn'],
          adaptations: 'Modified clothing with elastic waistbands and velcro closures',
          notes: 'Takes approximately 30 minutes to complete dressing tasks'
        },
        grooming: {
          level: 'Independent',
          details: 'Can complete all grooming tasks without assistance',
          equipment: ['Electric razor', 'Built-up handle toothbrush'],
          adaptations: 'Sits at vanity for extended grooming tasks',
          notes: 'No issues reported'
        },
        toileting: {
          level: 'Modified Independent',
          details: 'Uses raised toilet seat and grab bars for safety.',
          equipment: ['Raised toilet seat', 'Toilet grab bars'],
          adaptations: 'None',
          notes: 'Occasionally uses bedside commode at night for convenience'
        },
        feeding: {
          level: 'Independent',
          details: 'No difficulties with self-feeding',
          equipment: ['Built-up utensils for occasional use'],
          adaptations: 'None',
          notes: 'No issues reported'
        },
        mobility: {
          level: 'Needs Moderate Assistance',
          details: 'Uses walker for household ambulation. Requires standby assistance for transfers and longer distances.',
          equipment: ['Walker', 'Cane for short distances'],
          adaptations: 'Furniture rearranged to create wider pathways',
          notes: 'Fatigue impacts mobility later in the day'
        }
      },
      instrumentalADLs: {
        mealPreparation: {
          level: 'Needs Minimal Assistance',
          details: 'Can prepare simple meals independently. Needs help with complex meal preparation and handling heavy pots and pans.',
          equipment: ['Kitchen trolley', 'Perching stool', 'Adaptive cutting board'],
          adaptations: 'Reorganized kitchen storage for frequently used items',
          notes: 'Batch cooks on weekends when family can assist'
        },
        homeManagement: {
          level: 'Needs Moderate Assistance',
          details: 'Can perform light cleaning tasks. Requires assistance for laundry, vacuuming, and other heavier household tasks.',
          equipment: ['Lightweight vacuum', 'Long-handled duster'],
          adaptations: 'Uses laundry basket on wheels',
          notes: 'Family assists with weekly deep cleaning'
        },
        financialManagement: {
          level: 'Independent',
          details: 'Manages own finances without difficulties',
          equipment: [],
          adaptations: 'Uses online banking and bill payment',
          notes: 'No issues reported'
        },
        shopping: {
          level: 'Needs Maximal Assistance',
          details: 'Requires transportation and physical assistance for shopping. Can create shopping lists independently.',
          equipment: [],
          adaptations: 'Uses grocery delivery services frequently',
          notes: 'Family assists with weekly grocery shopping'
        },
        transportation: {
          level: 'Dependent',
          details: 'Unable to drive or use public transportation independently',
          equipment: [],
          adaptations: 'Uses specialized transport services for medical appointments',
          notes: 'Relies on family and paratransit services'
        },
        communication: {
          level: 'Independent',
          details: 'Uses phone, computer, and manages mail independently',
          equipment: ['Smartphone with large buttons', 'Tablet computer'],
          adaptations: 'Voice-to-text features for longer communications',
          notes: 'No significant difficulties reported'
        },
        medicationManagement: {
          level: 'Modified Independent',
          details: 'Uses pill organizer and reminder system to manage multiple medications',
          equipment: ['Weekly pill organizer', 'Medication reminder app'],
          adaptations: 'Organized medication schedule with meals',
          notes: 'Occasional reminder needed for as-needed medications'
        }
      },
      leisureActivities: {
        physical: [
          {
            activity: 'Walking',
            frequency: '3 times per week',
            adaptations: 'Uses walker, stays on flat paved paths',
            barriers: 'Weather, fatigue, pain',
            notes: 'Enjoys walks in local park'
          },
          {
            activity: 'Seated exercise program',
            frequency: 'Daily',
            adaptations: 'Uses resistance bands, follows video program',
            barriers: 'None',
            notes: 'Recommended by physical therapist'
          }
        ],
        social: [
          {
            activity: 'Coffee with friends',
            frequency: 'Weekly',
            adaptations: 'Friends meet at accessible locations',
            barriers: 'Transportation',
            notes: 'Important for maintaining social connections'
          },
          {
            activity: 'Church attendance',
            frequency: 'Weekly',
            adaptations: 'Uses accessible seating',
            barriers: 'Transportation, fatigue after services',
            notes: 'Values spiritual community'
          }
        ],
        creative: [
          {
            activity: 'Knitting',
            frequency: 'Daily',
            adaptations: 'Ergonomic needles, wrist supports',
            barriers: 'Hand pain after extended periods',
            notes: 'Makes items for family and charity'
          }
        ],
        cognitive: [
          {
            activity: 'Reading',
            frequency: 'Daily',
            adaptations: 'E-reader with adjustable text size',
            barriers: 'None',
            notes: 'Prefers mysteries and biographies'
          },
          {
            activity: 'Crossword puzzles',
            frequency: '4-5 times per week',
            adaptations: 'Magnifier, large-print puzzles',
            barriers: 'None',
            notes: 'Enjoys challenge to keep mind active'
          }
        ],
        spiritual: [
          {
            activity: 'Meditation',
            frequency: 'Daily',
            adaptations: 'Uses guided audio programs',
            barriers: 'None',
            notes: 'Important for stress management'
          }
        ]
      },
      overallFunctioning: 'Client demonstrates moderate independence in basic ADLs with use of adaptive equipment and minimal to moderate assistance needed for most instrumental ADLs. They maintain an active leisure routine with appropriate adaptations. Primary support needs are in the areas of transportation, shopping, and more physically demanding home management tasks. Client is motivated to maintain independence and consistently uses recommended adaptive strategies and equipment.'
    }
  };

  // Test mapping from context to form
  describe('mapContextToForm', () => {
    it('should correctly map context data to form structure', () => {
      const { formData, hasData } = mapContextToForm(mockContextData, mockInitialFormState);
      
      // Check hasData flag
      expect(hasData).toBe(true);
      
      // Check Basic ADLs mapping
      expect(formData.data.basicADLs.bathing.independence).toBe('Modified Independent');
      expect(formData.data.basicADLs.bathing.details).toContain('Uses shower chair and handheld shower head');
      expect(formData.data.basicADLs.bathing.equipment).toContain('Shower chair');
      expect(formData.data.basicADLs.bathing.equipment).toContain('Handheld shower head');
      
      expect(formData.data.basicADLs.dressing.independence).toBe('Needs Minimal Assistance');
      expect(formData.data.basicADLs.dressing.details).toContain('Independent with upper body dressing');
      expect(formData.data.basicADLs.dressing.equipment).toContain('Reacher');
      expect(formData.data.basicADLs.dressing.equipment).toContain('Sock aid');
      
      expect(formData.data.basicADLs.grooming.independence).toBe('Independent');
      expect(formData.data.basicADLs.grooming.equipment).toContain('Electric razor');
      
      expect(formData.data.basicADLs.toileting.independence).toBe('Modified Independent');
      expect(formData.data.basicADLs.toileting.equipment).toContain('Raised toilet seat');
      
      expect(formData.data.basicADLs.feeding.independence).toBe('Independent');
      expect(formData.data.basicADLs.feeding.equipment).toContain('Built-up utensils for occasional use');
      
      expect(formData.data.basicADLs.mobility.independence).toBe('Needs Moderate Assistance');
      expect(formData.data.basicADLs.mobility.equipment).toContain('Walker');
      expect(formData.data.basicADLs.mobility.equipment).toContain('Cane for short distances');
      
      // Check Instrumental ADLs mapping
      expect(formData.data.instrumentalADLs.mealPreparation.independence).toBe('Needs Minimal Assistance');
      expect(formData.data.instrumentalADLs.mealPreparation.equipment).toContain('Kitchen trolley');
      expect(formData.data.instrumentalADLs.mealPreparation.equipment).toContain('Perching stool');
      
      expect(formData.data.instrumentalADLs.homeManagement.independence).toBe('Needs Moderate Assistance');
      expect(formData.data.instrumentalADLs.homeManagement.details).toContain('Can perform light cleaning tasks');
      
      expect(formData.data.instrumentalADLs.financialManagement.independence).toBe('Independent');
      expect(formData.data.instrumentalADLs.financialManagement.details).toContain('Manages own finances without difficulties');
      
      expect(formData.data.instrumentalADLs.shopping.independence).toBe('Needs Maximal Assistance');
      expect(formData.data.instrumentalADLs.shopping.details).toContain('Requires transportation and physical assistance');
      
      expect(formData.data.instrumentalADLs.transportation.independence).toBe('Dependent');
      expect(formData.data.instrumentalADLs.transportation.details).toContain('Unable to drive or use public transportation independently');
      
      expect(formData.data.instrumentalADLs.communication.independence).toBe('Independent');
      expect(formData.data.instrumentalADLs.communication.equipment).toContain('Smartphone with large buttons');
      
      expect(formData.data.instrumentalADLs.medicationManagement.independence).toBe('Modified Independent');
      expect(formData.data.instrumentalADLs.medicationManagement.equipment).toContain('Weekly pill organizer');
      
      // Check Leisure Activities mapping
      expect(formData.data.leisureActivities.physical.length).toBe(2);
      expect(formData.data.leisureActivities.physical[0].activity).toBe('Walking');
      expect(formData.data.leisureActivities.physical[0].frequency).toBe('3 times per week');
      expect(formData.data.leisureActivities.physical[0].adaptations).toBe('Uses walker, stays on flat paved paths');
      
      expect(formData.data.leisureActivities.social.length).toBe(2);
      expect(formData.data.leisureActivities.social[0].activity).toBe('Coffee with friends');
      expect(formData.data.leisureActivities.social[1].activity).toBe('Church attendance');
      
      expect(formData.data.leisureActivities.creative.length).toBe(1);
      expect(formData.data.leisureActivities.creative[0].activity).toBe('Knitting');
      
      expect(formData.data.leisureActivities.cognitive.length).toBe(2);
      expect(formData.data.leisureActivities.cognitive[0].activity).toBe('Reading');
      expect(formData.data.leisureActivities.cognitive[1].activity).toBe('Crossword puzzles');
      
      expect(formData.data.leisureActivities.spiritual.length).toBe(1);
      expect(formData.data.leisureActivities.spiritual[0].activity).toBe('Meditation');
      
      // Check summary mapping
      expect(formData.data.summary).toBe('Client demonstrates moderate independence in basic ADLs with use of adaptive equipment and minimal to moderate assistance needed for most instrumental ADLs. They maintain an active leisure routine with appropriate adaptations. Primary support needs are in the areas of transportation, shopping, and more physically demanding home management tasks. Client is motivated to maintain independence and consistently uses recommended adaptive strategies and equipment.');
    });
    
    it('should return empty form data when context data is empty', () => {
      const { formData, hasData } = mapContextToForm({}, mockInitialFormState);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(mockInitialFormState);
    });
    
    it('should handle missing sections gracefully', () => {
      const partialContextData = {
        adlAssessment: {
          basicADLs: {
            bathing: {
              level: 'Independent',
              details: 'No assistance needed',
              equipment: []
            }
          }
          // Missing other sections
        }
      };
      
      const { formData, hasData } = mapContextToForm(partialContextData, mockInitialFormState);
      
      expect(hasData).toBe(true);
      expect(formData.data.basicADLs.bathing.independence).toBe('Independent');
      expect(formData.data.basicADLs.bathing.details).toBe('No assistance needed');
      
      // Other sections should be initialized with defaults
      expect(formData.data.basicADLs.dressing.independence).toBe('');
      expect(formData.data.instrumentalADLs.mealPreparation.independence).toBe('');
    });
    
    it('should handle malformed data without crashing', () => {
      const malformedData = {
        adlAssessment: {
          basicADLs: "Not an object" // Incorrect type
        }
      };
      
      // Should not throw an error
      const { formData, hasData } = mapContextToForm(malformedData, mockInitialFormState);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(mockInitialFormState);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test inferIndependenceLevel utility
  describe('inferIndependenceLevel', () => {
    it('should correctly infer Independence level from text', () => {
      expect(inferIndependenceLevel('Client is fully independent with this task')).toBe('Independent');
      expect(inferIndependenceLevel('Performs task independently with no assistance')).toBe('Independent');
      expect(inferIndependenceLevel('Completes independently but uses adaptive equipment')).toBe('Modified Independent');
      expect(inferIndependenceLevel('Modified independence with grab bars')).toBe('Modified Independent');
      expect(inferIndependenceLevel('Needs setup and minimal assistance')).toBe('Needs Minimal Assistance');
      expect(inferIndependenceLevel('Requires moderate assistance from caregiver')).toBe('Needs Moderate Assistance');
      expect(inferIndependenceLevel('Maximal assistance needed for completion')).toBe('Needs Maximal Assistance');
      expect(inferIndependenceLevel('Dependent for all aspects of this task')).toBe('Dependent');
      expect(inferIndependenceLevel('Family member completes task for client')).toBe('Dependent');
    });
    
    it('should return empty string for ambiguous or insufficient text', () => {
      expect(inferIndependenceLevel('')).toBe('');
      expect(inferIndependenceLevel('The client performs this task')).toBe('');
      expect(inferIndependenceLevel('Sometimes performs well')).toBe('');
    });
  });
  
  // Test JSON import/export functionality
  describe('JSON import/export', () => {
    it('should properly export context data to JSON', () => {
      const jsonString = exportADLToJson(mockContextData);
      
      // Should be a valid JSON string
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      // Should contain the original data
      const parsedData = JSON.parse(jsonString);
      expect(parsedData.adlAssessment.basicADLs.bathing.level).toBe('Modified Independent');
      expect(parsedData.adlAssessment.instrumentalADLs.shopping.level).toBe('Needs Maximal Assistance');
    });
    
    it('should properly import JSON to context data', () => {
      const jsonString = JSON.stringify(mockContextData);
      const importedData = importADLFromJson(jsonString);
      
      // Should match the original data
      expect(importedData).toEqual(mockContextData);
    });
    
    it('should handle invalid JSON during import', () => {
      const invalidJsonString = '{ this is not valid JSON }';
      
      // Should return null for invalid JSON
      const importedData = importADLFromJson(invalidJsonString);
      expect(importedData).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test bidirectional mapping consistency
  describe('Bidirectional mapping', () => {
    it('should maintain data integrity through bidirectional mapping', () => {
      // Start with context data
      const { formData, hasData } = mapContextToForm(mockContextData, mockInitialFormState);
      
      // Map back to context format
      const mappedContextData = mapFormToContext(formData);
      
      // Check key fields for data integrity
      expect(mappedContextData.adlAssessment.basicADLs.bathing.level).toBe(
        mockContextData.adlAssessment.basicADLs.bathing.level
      );
      
      expect(mappedContextData.adlAssessment.basicADLs.bathing.equipment).toEqual(
        mockContextData.adlAssessment.basicADLs.bathing.equipment
      );
      
      expect(mappedContextData.adlAssessment.instrumentalADLs.mealPreparation.level).toBe(
        mockContextData.adlAssessment.instrumentalADLs.mealPreparation.level
      );
      
      // Check leisure activities
      expect(mappedContextData.adlAssessment.leisureActivities.physical.length).toBe(
        mockContextData.adlAssessment.leisureActivities.physical.length
      );
      
      expect(mappedContextData.adlAssessment.leisureActivities.physical[0].activity).toBe(
        mockContextData.adlAssessment.leisureActivities.physical[0].activity
      );
      
      expect(mappedContextData.adlAssessment.overallFunctioning).toBe(
        mockContextData.adlAssessment.overallFunctioning
      );
    });
  });
});
