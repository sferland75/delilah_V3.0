/**
 * Environmental Assessment Mapper Service Tests
 * 
 * Tests for the bidirectional mapping functionality between
 * context data and form data structures.
 */

import { 
  mapContextToForm,
  mapFormToContext,
  exportToJson,
  importFromJson,
  defaultValues
} from '../environmentalAssessmentMapper';

// Mock nanoid to return predictable IDs in tests
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id-123'
}));

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Environmental Assessment Mapper Service', () => {
  // Define mock context data for testing
  const mockContextData = {
    homeLayout: {
      residenceType: 'Single-story house',
      ownershipStatus: 'Owned',
      numberOfLevels: 1,
      rooms: {
        bedrooms: 3,
        bathrooms: 2,
        kitchens: 1,
        other: ['Living Room', 'Dining Room', 'Study']
      },
      layoutDescription: 'Open floor plan with central living area',
      entryAccess: {
        stairsToEnter: true,
        numberOfSteps: '3',
        handrails: true,
        elevatorAccess: false,
        notes: 'Concrete steps with metal handrail on right side'
      },
      otherOccupants: [
        {
          id: 'occupant-1',
          relationship: 'Spouse',
          age: '65',
          notes: 'Provides assistance with household tasks'
        }
      ]
    },
    safetyAssessment: {
      generalSafety: 'Home is generally safe with some fall hazards noted',
      bedroomSafety: 'Good lighting, clear pathways, bed at appropriate height',
      bathroomSafety: 'Needs grab bars in shower and by toilet; shower floor is slippery',
      kitchenSafety: 'Upper cabinets difficult to reach; good counter height',
      stairsSafety: 'Entry stairs have good handrail; proper lighting',
      exteriorSafety: 'Driveway has cracks; garden path is uneven',
      nighttimeSafety: 'Has night lights in hallway and bathroom',
      emergencyPlanning: 'Phone accessible in bedroom; emergency contacts listed'
    },
    accessibilityIssues: {
      issues: [
        {
          id: 'issue-1',
          area: 'bathroom',
          description: 'Shower entry has 6-inch threshold',
          impactLevel: 'severe',
          recommendations: ['Install zero-entry shower', 'Add shower transfer bench']
        },
        {
          id: 'issue-2',
          area: 'kitchen',
          description: 'Upper cabinets too high to reach safely',
          impactLevel: 'moderate',
          recommendations: ['Lower cabinet height', 'Install pull-down shelving']
        }
      ]
    },
    adaptiveEquipment: {
      equipment: [
        {
          id: 'equip-1',
          name: 'Shower chair',
          type: 'Bathroom Safety',
          location: 'Master Bathroom',
          usage: 'Daily',
          effectiveness: 'Effective'
        },
        {
          id: 'equip-2',
          name: 'Reacher',
          type: 'Adaptive Tool',
          location: 'Throughout home',
          usage: 'Daily',
          effectiveness: 'Somewhat effective'
        }
      ]
    },
    recommendedModifications: {
      modifications: [
        {
          id: 'mod-1',
          area: 'Bathroom',
          description: 'Install grab bars in shower and by toilet',
          priority: 'high',
          cost: '$300-500',
          status: 'recommended'
        },
        {
          id: 'mod-2',
          area: 'Kitchen',
          description: 'Install pull-down shelving in upper cabinets',
          priority: 'medium',
          cost: '$400-600',
          status: 'recommended'
        }
      ]
    }
  };

  // Test mapping from context to form
  describe('mapContextToForm', () => {
    it('should correctly map context data to form structure', () => {
      const { formData, hasData } = mapContextToForm(mockContextData);
      
      // Check hasData flag
      expect(hasData).toBe(true);
      
      // Check dwelling information
      expect(formData.dwelling.type).toBe('Single-story house');
      expect(formData.dwelling.ownership).toBe('Owned');
      expect(formData.dwelling.levels).toBe('1');
      expect(formData.dwelling.rooms.bedrooms).toBe(3);
      expect(formData.dwelling.rooms.bathrooms).toBe(2);
      expect(formData.dwelling.rooms.kitchens).toBe(1);
      expect(formData.dwelling.rooms.other).toEqual(['Living Room', 'Dining Room', 'Study']);
      expect(formData.dwelling.layout).toBe('Open floor plan with central living area');
      
      // Check entry access
      expect(formData.dwelling.entryAccess.stairsToEnter).toBe(true);
      expect(formData.dwelling.entryAccess.numberOfSteps).toBe('3');
      expect(formData.dwelling.entryAccess.handrails).toBe(true);
      expect(formData.dwelling.entryAccess.elevatorAccess).toBe(false);
      
      // Check other occupants
      expect(formData.dwelling.otherOccupants).toHaveLength(1);
      expect(formData.dwelling.otherOccupants[0].relationship).toBe('Spouse');
      expect(formData.dwelling.otherOccupants[0].age).toBe('65');
      
      // Check safety assessment
      expect(formData.safetyAssessment.generalSafety).toBe('Home is generally safe with some fall hazards noted');
      expect(formData.safetyAssessment.bathroomSafety).toBe('Needs grab bars in shower and by toilet; shower floor is slippery');
      expect(formData.safetyAssessment.kitchenSafety).toBe('Upper cabinets difficult to reach; good counter height');
      
      // Check accessibility issues
      expect(formData.accessibilityIssues.issues).toHaveLength(2);
      expect(formData.accessibilityIssues.issues[0].area).toBe('bathroom');
      expect(formData.accessibilityIssues.issues[0].impactLevel).toBe('severe');
      expect(formData.accessibilityIssues.issues[0].recommendations).toHaveLength(2);
      
      // Check adaptive equipment
      expect(formData.adaptiveEquipment.equipment).toHaveLength(2);
      expect(formData.adaptiveEquipment.equipment[0].name).toBe('Shower chair');
      expect(formData.adaptiveEquipment.equipment[0].type).toBe('Bathroom Safety');
      
      // Check recommended modifications
      expect(formData.recommendedModifications.modifications).toHaveLength(2);
      expect(formData.recommendedModifications.modifications[0].area).toBe('Bathroom');
      expect(formData.recommendedModifications.modifications[0].priority).toBe('high');
    });
    
    it('should return empty form data when context data is empty', () => {
      const { formData, hasData } = mapContextToForm({});
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(defaultValues);
    });
    
    it('should extract room information from description when not provided directly', () => {
      const partialContextData = {
        homeLayout: {
          description: 'A 3 bedroom, 2 bathroom house with kitchen and living room.'
        }
      };
      
      const { formData, hasData } = mapContextToForm(partialContextData);
      
      expect(hasData).toBe(true);
      expect(formData.dwelling.rooms.bedrooms).toBe(3);
      expect(formData.dwelling.rooms.bathrooms).toBe(2);
      expect(formData.dwelling.rooms.kitchens).toBe(1);
      expect(formData.dwelling.rooms.other).toContain('Living Room');
    });
    
    it('should extract entry information from description when not provided directly', () => {
      const partialContextData = {
        homeLayout: {
          entryDescription: 'Entry has 5 steps with a handrail on the left side.'
        }
      };
      
      const { formData, hasData } = mapContextToForm(partialContextData);
      
      expect(hasData).toBe(true);
      expect(formData.dwelling.entryAccess.stairsToEnter).toBe(true);
      expect(formData.dwelling.entryAccess.numberOfSteps).toBe('5');
      expect(formData.dwelling.entryAccess.handrails).toBe(true);
      expect(formData.dwelling.entryAccess.notes).toBe('Entry has 5 steps with a handrail on the left side.');
    });
    
    it('should parse text-based accessibility issues into structured format', () => {
      const textBasedContextData = {
        accessibilityIssues: 'Bathroom doorway too narrow for wheelchair. Kitchen counters too high.'
      };
      
      const { formData, hasData } = mapContextToForm(textBasedContextData);
      
      expect(hasData).toBe(true);
      expect(formData.accessibilityIssues.issues).toHaveLength(2);
      
      // Check the first issue (bathroom doorway)
      const bathroomIssue = formData.accessibilityIssues.issues.find(
        (i: any) => i.area === 'bathroom'
      );
      expect(bathroomIssue).toBeDefined();
      expect(bathroomIssue.description).toBe('Bathroom doorway too narrow for wheelchair.');
      
      // Check the second issue (kitchen counters)
      const kitchenIssue = formData.accessibilityIssues.issues.find(
        (i: any) => i.area === 'kitchen'
      );
      expect(kitchenIssue).toBeDefined();
      expect(kitchenIssue.description).toBe(' Kitchen counters too high.');
    });
    
    it('should handle parsing text-based adaptive equipment descriptions', () => {
      const textBasedContextData = {
        adaptiveEquipment: 'Shower chair, grab bars in bathroom, reacher tool for kitchen, non-slip bath mat'
      };
      
      const { formData, hasData } = mapContextToForm(textBasedContextData);
      
      expect(hasData).toBe(true);
      expect(formData.adaptiveEquipment.equipment.length).toBeGreaterThan(0);
      
      // Check for shower chair
      const showerChair = formData.adaptiveEquipment.equipment.find(
        (e: any) => e.name.toLowerCase().includes('shower chair')
      );
      expect(showerChair).toBeDefined();
      expect(showerChair.type).toBe('Bathroom Safety');
      expect(showerChair.location).toBe('Bathroom');
      
      // Check for grab bars
      const grabBars = formData.adaptiveEquipment.equipment.find(
        (e: any) => e.name.toLowerCase().includes('grab bars')
      );
      expect(grabBars).toBeDefined();
      expect(grabBars.type).toBe('Bathroom Safety');
    });
    
    it('should parse text-based recommended modifications into structured format', () => {
      const textBasedContextData = {
        recommendedModifications: 'Install grab bars in bathroom. Widen doorways for wheelchair access. Add ramp to front entrance.'
      };
      
      const { formData, hasData } = mapContextToForm(textBasedContextData);
      
      expect(hasData).toBe(true);
      expect(formData.recommendedModifications.modifications.length).toBeGreaterThan(0);
      
      // Check bathroom modification
      const bathroomMod = formData.recommendedModifications.modifications.find(
        (m: any) => m.area === 'Bathroom'
      );
      expect(bathroomMod).toBeDefined();
      expect(bathroomMod.description).toContain('Install grab bars');
      
      // Check entry modification
      const entryMod = formData.recommendedModifications.modifications.find(
        (m: any) => m.area === 'Entry'
      );
      expect(entryMod).toBeDefined();
      expect(entryMod.description).toContain('Add ramp');
    });
    
    it('should enhance data through cross-section references', () => {
      const crossRefContextData = {
        safetyAssessment: {
          bathroomSafety: 'Needs grab bars in shower; slip hazard in tub',
          stairsSafety: 'Missing handrail on left side; poor lighting'
        }
      };
      
      const { formData, hasData } = mapContextToForm(crossRefContextData);
      
      expect(hasData).toBe(true);
      
      // Should add grab bars to adaptive equipment
      const hasGrabBars = formData.adaptiveEquipment.equipment.some(
        (e: any) => e.name.toLowerCase().includes('grab bar')
      );
      expect(hasGrabBars).toBe(true);
      
      // Should add handrails to adaptive equipment
      const hasHandrails = formData.adaptiveEquipment.equipment.some(
        (e: any) => e.name.toLowerCase().includes('handrail')
      );
      expect(hasHandrails).toBe(true);
      
      // Should add accessibility issues from safety concerns
      const hasSlipHazard = formData.accessibilityIssues.issues.some(
        (i: any) => i.area === 'bathroom' && i.description.toLowerCase().includes('hazard')
      );
      expect(hasSlipHazard).toBe(true);
    });
  });
  
  // Test mapping from form to context
  describe('mapFormToContext', () => {
    it('should correctly map form data to context structure', () => {
      // Sample form data
      const formData = {
        dwelling: {
          type: 'Two-story house',
          ownership: 'Rented',
          levels: '2',
          rooms: {
            bedrooms: 4,
            bathrooms: 2.5,
            kitchens: 1,
            other: ['Living Room', 'Dining Room', 'Office', 'Laundry Room']
          },
          layout: 'Traditional layout with central staircase',
          entryAccess: {
            stairsToEnter: true,
            numberOfSteps: '4',
            handrails: true,
            elevatorAccess: false,
            notes: 'Wide concrete steps with metal handrails on both sides'
          },
          otherOccupants: [
            {
              id: 'occupant-1',
              relationship: 'Spouse',
              age: '67',
              notes: 'No health concerns'
            },
            {
              id: 'occupant-2',
              relationship: 'Adult Child',
              age: '35',
              notes: 'Lives in home part-time'
            }
          ]
        },
        safetyAssessment: {
          generalSafety: 'Home is generally safe with minor hazards',
          bedroomSafety: 'Clear pathways, good lighting',
          bathroomSafety: 'Grab bars installed in master bathroom; guest bathroom needs modifications',
          kitchenSafety: 'Good lighting and organization',
          stairsSafety: 'Both handrails secure; good visibility',
          exteriorSafety: 'Well-maintained walkways; good lighting',
          nighttimeSafety: 'Motion-activated night lights throughout',
          emergencyPlanning: 'Emergency contacts posted; clear exit paths'
        },
        accessibilityIssues: {
          issues: [
            {
              id: 'issue-1',
              area: 'stairs',
              description: 'Internal staircase difficult to navigate',
              impactLevel: 'severe',
              recommendations: ['Install stairlift', 'Consider first floor bedroom conversion']
            },
            {
              id: 'issue-2',
              area: 'bathroom',
              description: 'Guest bathroom doorway too narrow for walker',
              impactLevel: 'moderate',
              recommendations: ['Widen doorway to 36 inches']
            }
          ]
        },
        adaptiveEquipment: {
          equipment: [
            {
              id: 'equip-1',
              name: 'Grab bars',
              type: 'Bathroom Safety',
              location: 'Master Bathroom',
              usage: 'Daily',
              effectiveness: 'Very effective'
            },
            {
              id: 'equip-2',
              name: 'Walker',
              type: 'Mobility Aid',
              location: 'Throughout home',
              usage: 'Daily',
              effectiveness: 'Effective'
            },
            {
              id: 'equip-3',
              name: 'Raised toilet seat',
              type: 'Bathroom Safety',
              location: 'Master Bathroom',
              usage: 'Daily',
              effectiveness: 'Effective'
            }
          ]
        },
        recommendedModifications: {
          modifications: [
            {
              id: 'mod-1',
              area: 'Bathroom',
              description: 'Install grab bars in guest bathroom',
              priority: 'high',
              cost: '$200-300',
              status: 'pending'
            },
            {
              id: 'mod-2',
              area: 'Stairs',
              description: 'Install stairlift',
              priority: 'high',
              cost: '$3000-5000',
              status: 'under consideration'
            },
            {
              id: 'mod-3',
              area: 'Bathroom',
              description: 'Widen guest bathroom doorway',
              priority: 'medium',
              cost: '$800-1200',
              status: 'recommended'
            }
          ]
        }
      };
      
      const contextData = mapFormToContext(formData);
      
      // Check homeLayout mapping
      expect(contextData.homeLayout.residenceType).toBe('Two-story house');
      expect(contextData.homeLayout.ownershipStatus).toBe('Rented');
      expect(contextData.homeLayout.numberOfLevels).toBe('2');
      expect(contextData.homeLayout.rooms.bedrooms).toBe(4);
      expect(contextData.homeLayout.rooms.bathrooms).toBe(2.5);
      expect(contextData.homeLayout.rooms.other).toEqual(['Living Room', 'Dining Room', 'Office', 'Laundry Room']);
      expect(contextData.homeLayout.layoutDescription).toBe('Traditional layout with central staircase');
      
      // Check entry access mapping
      expect(contextData.homeLayout.entryAccess.stairsToEnter).toBe(true);
      expect(contextData.homeLayout.entryAccess.numberOfSteps).toBe('4');
      expect(contextData.homeLayout.entryAccess.handrails).toBe(true);
      expect(contextData.homeLayout.entryAccess.notes).toBe('Wide concrete steps with metal handrails on both sides');
      
      // Check other occupants mapping
      expect(contextData.homeLayout.otherOccupants).toHaveLength(2);
      expect(contextData.homeLayout.otherOccupants[0].relationship).toBe('Spouse');
      expect(contextData.homeLayout.otherOccupants[1].relationship).toBe('Adult Child');
      
      // Check safety assessment mapping
      expect(contextData.safetyAssessment.generalSafety).toBe('Home is generally safe with minor hazards');
      expect(contextData.safetyAssessment.bathroomSafety).toBe('Grab bars installed in master bathroom; guest bathroom needs modifications');
      expect(contextData.safetyAssessment.stairsSafety).toBe('Both handrails secure; good visibility');
      
      // Check accessibility issues mapping
      expect(contextData.accessibilityIssues.issues).toHaveLength(2);
      expect(contextData.accessibilityIssues.issues[0].area).toBe('stairs');
      expect(contextData.accessibilityIssues.issues[0].impactLevel).toBe('severe');
      expect(contextData.accessibilityIssues.issues[0].recommendations).toContain('Install stairlift');
      
      // Check adaptive equipment mapping
      expect(contextData.adaptiveEquipment.equipment).toHaveLength(3);
      expect(contextData.adaptiveEquipment.equipment[0].name).toBe('Grab bars');
      expect(contextData.adaptiveEquipment.equipment[0].type).toBe('Bathroom Safety');
      
      // Check recommended modifications mapping
      expect(contextData.recommendedModifications.modifications).toHaveLength(3);
      expect(contextData.recommendedModifications.modifications[0].area).toBe('Bathroom');
      expect(contextData.recommendedModifications.modifications[0].priority).toBe('high');
      expect(contextData.recommendedModifications.modifications[0].status).toBe('pending');
    });
    
    it('should handle empty form data gracefully', () => {
      const emptyFormData = {
        dwelling: {
          type: '',
          ownership: '',
          levels: '',
          rooms: {
            bedrooms: 0,
            bathrooms: 0,
            kitchens: 0,
            other: []
          },
          layout: '',
          entryAccess: {
            stairsToEnter: false,
            numberOfSteps: '',
            handrails: false,
            elevatorAccess: false,
            notes: ''
          },
          otherOccupants: []
        },
        safetyAssessment: {
          generalSafety: '',
          bedroomSafety: '',
          bathroomSafety: '',
          kitchenSafety: '',
          stairsSafety: '',
          exteriorSafety: '',
          nighttimeSafety: '',
          emergencyPlanning: ''
        },
        accessibilityIssues: {
          issues: []
        },
        adaptiveEquipment: {
          equipment: []
        },
        recommendedModifications: {
          modifications: []
        }
      };
      
      const contextData = mapFormToContext(emptyFormData);
      
      // Should return a valid structured object
      expect(contextData.homeLayout).toBeDefined();
      expect(contextData.safetyAssessment).toBeDefined();
      expect(contextData.accessibilityIssues).toBeDefined();
      expect(contextData.adaptiveEquipment).toBeDefined();
      expect(contextData.recommendedModifications).toBeDefined();
      
      // All collections should be empty
      expect(contextData.homeLayout.otherOccupants).toHaveLength(0);
      expect(contextData.accessibilityIssues.issues).toHaveLength(0);
      expect(contextData.adaptiveEquipment.equipment).toHaveLength(0);
      expect(contextData.recommendedModifications.modifications).toHaveLength(0);
    });
    
    it('should handle malformed form data without crashing', () => {
      const malformedFormData = {
        dwelling: null, // Should be an object
        safetyAssessment: {
          // Missing fields
        },
        // Missing other sections
      };
      
      // Should not throw errors
      const contextData = mapFormToContext(malformedFormData);
      
      // Should still return a structured object
      expect(contextData).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test JSON import/export functionality
  describe('JSON import/export', () => {
    it('should properly export context data to JSON', () => {
      const jsonString = exportToJson(mockContextData);
      
      // Should be a valid JSON string
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      // Should contain the original data
      const parsedData = JSON.parse(jsonString);
      expect(parsedData.homeLayout.residenceType).toBe('Single-story house');
      expect(parsedData.safetyAssessment.bathroomSafety).toBe('Needs grab bars in shower and by toilet; shower floor is slippery');
      expect(parsedData.accessibilityIssues.issues).toHaveLength(2);
    });
    
    it('should properly import JSON to context data', () => {
      const jsonString = JSON.stringify(mockContextData);
      const importedData = importFromJson(jsonString);
      
      // Should match the original data
      expect(importedData).toEqual(mockContextData);
    });
    
    it('should handle invalid JSON during import', () => {
      const invalidJsonString = '{ this is not valid JSON }';
      
      // Should return null for invalid JSON
      const importedData = importFromJson(invalidJsonString);
      expect(importedData).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test bidirectional mapping consistency
  describe('Bidirectional mapping', () => {
    it('should maintain data integrity through bidirectional mapping', () => {
      // Start with context data
      const { formData, hasData } = mapContextToForm(mockContextData);
      
      // Map back to context format
      const mappedContextData = mapFormToContext(formData);
      
      // Check key fields for data integrity
      expect(mappedContextData.homeLayout.residenceType).toBe(
        mockContextData.homeLayout.residenceType
      );
      
      expect(mappedContextData.homeLayout.rooms.bedrooms).toBe(
        mockContextData.homeLayout.rooms.bedrooms
      );
      
      expect(mappedContextData.safetyAssessment.bathroomSafety).toBe(
        mockContextData.safetyAssessment.bathroomSafety
      );
      
      expect(mappedContextData.accessibilityIssues.issues).toHaveLength(
        mockContextData.accessibilityIssues.issues.length
      );
      
      expect(mappedContextData.adaptiveEquipment.equipment[0].name).toBe(
        mockContextData.adaptiveEquipment.equipment[0].name
      );
      
      expect(mappedContextData.recommendedModifications.modifications[0].description).toBe(
        mockContextData.recommendedModifications.modifications[0].description
      );
    });
  });
  
  // Test cross-section reference enhancements
  describe('Cross-section reference enhancements', () => {
    it('should add adaptive equipment based on safety assessment needs', () => {
      // Only provide safety assessment information
      const safetyOnlyContext = {
        safetyAssessment: {
          bathroomSafety: 'Needs grab bars in shower and by toilet; shower floor is slippery',
          nighttimeSafety: 'Poor lighting in hallway; needs night lights',
          stairsSafety: 'Missing handrail on left side'
        }
      };
      
      const { formData, hasData } = mapContextToForm(safetyOnlyContext);
      
      expect(hasData).toBe(true);
      
      // Check that grab bars were added to equipment
      const hasGrabBars = formData.adaptiveEquipment.equipment.some(
        (e: any) => e.name.toLowerCase().includes('grab bar')
      );
      expect(hasGrabBars).toBe(true);
      
      // Check that night lights were added to equipment
      const hasNightLights = formData.adaptiveEquipment.equipment.some(
        (e: any) => e.name.toLowerCase().includes('night light')
      );
      expect(hasNightLights).toBe(true);
      
      // Check that handrails were added to equipment
      const hasHandrails = formData.adaptiveEquipment.equipment.some(
        (e: any) => e.name.toLowerCase().includes('handrail')
      );
      expect(hasHandrails).toBe(true);
    });
    
    it('should convert safety concerns to accessibility issues', () => {
      // Only provide safety assessment with concerns
      const safetyOnlyContext = {
        safetyAssessment: {
          bathroomSafety: 'Hazard: Slippery shower floor',
          kitchenSafety: 'Risk of falls due to cluttered floor',
          stairsSafety: 'Severe hazard: Poor lighting and loose carpet'
        }
      };
      
      const { formData, hasData } = mapContextToForm(safetyOnlyContext);
      
      expect(hasData).toBe(true);
      
      // Check that safety concerns were added as accessibility issues
      expect(formData.accessibilityIssues.issues.length).toBeGreaterThan(0);
      
      // Check for bathroom issue
      const hasBathroomIssue = formData.accessibilityIssues.issues.some(
        (i: any) => i.area === 'bathroom' && i.description.includes('Slippery shower floor')
      );
      expect(hasBathroomIssue).toBe(true);
      
      // Check for kitchen issue
      const hasKitchenIssue = formData.accessibilityIssues.issues.some(
        (i: any) => i.area === 'kitchen' && i.description.includes('cluttered floor')
      );
      expect(hasKitchenIssue).toBe(true);
      
      // Check that severe hazard was marked as severe impact
      const stairsIssue = formData.accessibilityIssues.issues.find(
        (i: any) => i.area === 'stairs'
      );
      expect(stairsIssue).toBeDefined();
      expect(stairsIssue.impactLevel).toBe('severe');
    });
  });
});
