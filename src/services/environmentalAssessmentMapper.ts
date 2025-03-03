/**
 * Environmental Assessment Data Mapping Service
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

import { nanoid } from 'nanoid';

// Default form values
export const defaultValues = {
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

/**
 * Maps dwelling information from context to form
 * @param contextData Full context data
 * @param formData Form data to update
 * @param hasData Flag to indicate data presence
 */
function mapDwelling(contextData: any, formData: any, hasData: boolean) {
  try {
    if (contextData.homeLayout || contextData.dwelling) {
      hasData = true;
      const homeData = contextData.homeLayout || contextData.dwelling || {};
      
      // Map dwelling type
      if (homeData.residenceType || homeData.type) {
        formData.dwelling.type = homeData.residenceType || homeData.type || '';
      }
      
      // Map ownership status
      if (homeData.ownershipStatus || homeData.ownership) {
        formData.dwelling.ownership = homeData.ownershipStatus || homeData.ownership || '';
      }
      
      // Map number of levels
      if (homeData.numberOfLevels || homeData.levels) {
        formData.dwelling.levels = (homeData.numberOfLevels || homeData.levels || '').toString();
      }
      
      // Map room numbers
      if (homeData.rooms) {
        formData.dwelling.rooms.bedrooms = parseInt(homeData.rooms.bedrooms) || 0;
        formData.dwelling.rooms.bathrooms = parseInt(homeData.rooms.bathrooms) || 0;
        formData.dwelling.rooms.kitchens = parseInt(homeData.rooms.kitchens) || 0;
        
        if (Array.isArray(homeData.rooms.other)) {
          formData.dwelling.rooms.other = homeData.rooms.other;
        } else if (typeof homeData.rooms.other === 'string') {
          formData.dwelling.rooms.other = homeData.rooms.other.split(',').map(item => item.trim());
        }
      } else {
        // Try to extract room information from description
        if (homeData.description) {
          const description = homeData.description.toLowerCase();
          
          // Extract number of bedrooms
          const bedroomMatch = description.match(/(\d+)\s+bedroom/);
          if (bedroomMatch) {
            formData.dwelling.rooms.bedrooms = parseInt(bedroomMatch[1]);
          }
          
          // Extract number of bathrooms
          const bathroomMatch = description.match(/(\d+)\s+bathroom/);
          if (bathroomMatch) {
            formData.dwelling.rooms.bathrooms = parseInt(bathroomMatch[1]);
          }
          
          // Extract number of kitchens
          if (description.includes('kitchen')) {
            formData.dwelling.rooms.kitchens = 1;
          }
          
          // Extract other rooms
          const otherRooms = [];
          if (description.includes('dining room')) otherRooms.push('Dining Room');
          if (description.includes('living room')) otherRooms.push('Living Room');
          if (description.includes('family room')) otherRooms.push('Family Room');
          if (description.includes('den')) otherRooms.push('Den');
          if (description.includes('office')) otherRooms.push('Office');
          if (description.includes('basement')) otherRooms.push('Basement');
          
          if (otherRooms.length > 0) {
            formData.dwelling.rooms.other = otherRooms;
          }
        }
      }
      
      // Map layout description
      if (homeData.layoutDescription || homeData.layout) {
        formData.dwelling.layout = homeData.layoutDescription || homeData.layout || '';
      }
      
      // Map entry access
      if (homeData.entryAccess) {
        formData.dwelling.entryAccess.stairsToEnter = homeData.entryAccess.stairsToEnter || false;
        formData.dwelling.entryAccess.numberOfSteps = (homeData.entryAccess.numberOfSteps || '').toString();
        formData.dwelling.entryAccess.handrails = homeData.entryAccess.handrails || false;
        formData.dwelling.entryAccess.elevatorAccess = homeData.entryAccess.elevatorAccess || false;
        formData.dwelling.entryAccess.notes = homeData.entryAccess.notes || '';
      } else if (homeData.entryDescription) {
        // Try to extract entry information from description
        const description = homeData.entryDescription.toLowerCase();
        
        formData.dwelling.entryAccess.stairsToEnter = 
          description.includes('stair') || 
          description.includes('step') || 
          description.includes('flight');
        
        // Extract number of steps
        const stepsMatch = description.match(/(\d+)\s+step/);
        if (stepsMatch) {
          formData.dwelling.entryAccess.numberOfSteps = stepsMatch[1];
        }
        
        formData.dwelling.entryAccess.handrails = 
          description.includes('handrail') || 
          description.includes('railing');
        
        formData.dwelling.entryAccess.elevatorAccess = 
          description.includes('elevator') || 
          description.includes('lift');
        
        formData.dwelling.entryAccess.notes = homeData.entryDescription;
      }
      
      // Map other occupants
      if (homeData.otherOccupants && Array.isArray(homeData.otherOccupants)) {
        formData.dwelling.otherOccupants = homeData.otherOccupants;
      } else if (homeData.occupants) {
        // Try to convert to expected format
        if (Array.isArray(homeData.occupants)) {
          formData.dwelling.otherOccupants = homeData.occupants.map((occ: any) => {
            if (typeof occ === 'string') {
              return {
                id: nanoid(),
                relationship: occ,
                age: '',
                notes: ''
              };
            }
            return {
              id: occ.id || nanoid(),
              relationship: occ.relationship || occ.name || '',
              age: (occ.age || '').toString(),
              notes: occ.notes || ''
            };
          });
        } else if (typeof homeData.occupants === 'string') {
          formData.dwelling.otherOccupants = homeData.occupants.split(',').map((occ: string) => ({
            id: nanoid(),
            relationship: occ.trim(),
            age: '',
            notes: ''
          }));
        }
      }
    }
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error mapping dwelling:", error);
  }
}

/**
 * Maps safety assessment information from context to form
 * @param contextData Full context data
 * @param formData Form data to update
 * @param hasData Flag to indicate data presence
 */
function mapSafetyAssessment(contextData: any, formData: any, hasData: boolean) {
  try {
    if (contextData.safetyAssessment) {
      hasData = true;
      
      formData.safetyAssessment.generalSafety = contextData.safetyAssessment.generalSafety || '';
      formData.safetyAssessment.bedroomSafety = contextData.safetyAssessment.bedroomSafety || '';
      formData.safetyAssessment.bathroomSafety = contextData.safetyAssessment.bathroomSafety || '';
      formData.safetyAssessment.kitchenSafety = contextData.safetyAssessment.kitchenSafety || '';
      formData.safetyAssessment.stairsSafety = contextData.safetyAssessment.stairsSafety || '';
      formData.safetyAssessment.exteriorSafety = contextData.safetyAssessment.exteriorSafety || '';
      formData.safetyAssessment.nighttimeSafety = contextData.safetyAssessment.nighttimeSafety || '';
      formData.safetyAssessment.emergencyPlanning = contextData.safetyAssessment.emergencyPlanning || '';
    }
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error mapping safety assessment:", error);
  }
}

/**
 * Maps accessibility issues from context to form
 * @param contextData Full context data
 * @param formData Form data to update
 * @param hasData Flag to indicate data presence
 */
function mapAccessibilityIssues(contextData: any, formData: any, hasData: boolean) {
  try {
    if (contextData.accessibilityIssues) {
      hasData = true;
      
      if (contextData.accessibilityIssues.issues && Array.isArray(contextData.accessibilityIssues.issues)) {
        formData.accessibilityIssues.issues = contextData.accessibilityIssues.issues.map((issue: any) => ({
          id: issue.id || nanoid(),
          area: issue.area || '',
          description: issue.description || '',
          impactLevel: issue.impactLevel || 'moderate',
          recommendations: issue.recommendations || []
        }));
      } else if (typeof contextData.accessibilityIssues === 'string' || Array.isArray(contextData.accessibilityIssues)) {
        // Handle if accessibilityIssues is a string or array of strings
        const issues = Array.isArray(contextData.accessibilityIssues) ? 
          contextData.accessibilityIssues : 
          [contextData.accessibilityIssues];
        
        formData.accessibilityIssues.issues = issues.map((issueText: string) => {
          // Try to extract area from text
          let area = 'general';
          if (issueText.toLowerCase().includes('bathroom')) area = 'bathroom';
          if (issueText.toLowerCase().includes('bedroom')) area = 'bedroom';
          if (issueText.toLowerCase().includes('kitchen')) area = 'kitchen';
          if (issueText.toLowerCase().includes('stair')) area = 'stairs';
          if (issueText.toLowerCase().includes('entry')) area = 'entry';
          
          // Try to determine impact level from keywords
          let impactLevel = 'moderate';
          if (issueText.toLowerCase().includes('severe') || 
              issueText.toLowerCase().includes('major') || 
              issueText.toLowerCase().includes('critical')) {
            impactLevel = 'severe';
          } else if (issueText.toLowerCase().includes('mild') || 
                     issueText.toLowerCase().includes('minor')) {
            impactLevel = 'mild';
          }
          
          return {
            id: nanoid(),
            area,
            description: issueText,
            impactLevel,
            recommendations: []
          };
        });
      }
    }
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error mapping accessibility issues:", error);
  }
}

/**
 * Maps adaptive equipment from context to form
 * @param contextData Full context data
 * @param formData Form data to update
 * @param hasData Flag to indicate data presence
 */
function mapAdaptiveEquipment(contextData: any, formData: any, hasData: boolean) {
  try {
    if (contextData.adaptiveEquipment) {
      hasData = true;
      
      if (contextData.adaptiveEquipment.equipment && Array.isArray(contextData.adaptiveEquipment.equipment)) {
        formData.adaptiveEquipment.equipment = contextData.adaptiveEquipment.equipment.map((equip: any) => ({
          id: equip.id || nanoid(),
          name: equip.name || '',
          type: equip.type || '',
          location: equip.location || '',
          usage: equip.usage || '',
          effectiveness: equip.effectiveness || ''
        }));
      } else if (typeof contextData.adaptiveEquipment === 'string') {
        // Try to parse text description into equipment items
        const equipItems = contextData.adaptiveEquipment.split(/[.,;]/).filter((item: string) => item.trim().length > 0);
        
        formData.adaptiveEquipment.equipment = equipItems.map((item: string) => {
          // Try to determine equipment type and location
          let type = 'Other';
          let location = '';
          
          const text = item.toLowerCase();
          if (text.includes('grab bar') || text.includes('shower')) {
            type = 'Bathroom Safety';
            location = 'Bathroom';
          } else if (text.includes('walker') || text.includes('cane') || text.includes('wheelchair')) {
            type = 'Mobility Aid';
            location = 'Throughout home';
          } else if (text.includes('reacher') || text.includes('gripper')) {
            type = 'Reaching Aid';
            location = 'Throughout home';
          } else if (text.includes('kitchen')) {
            type = 'Kitchen Aid';
            location = 'Kitchen';
          }
          
          return {
            id: nanoid(),
            name: item.trim(),
            type,
            location,
            usage: 'Daily',
            effectiveness: 'Effective'
          };
        });
      }
    }
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error mapping adaptive equipment:", error);
  }
}

/**
 * Maps recommended modifications from context to form
 * @param contextData Full context data
 * @param formData Form data to update
 * @param hasData Flag to indicate data presence
 */
function mapRecommendedModifications(contextData: any, formData: any, hasData: boolean) {
  try {
    if (contextData.recommendedModifications) {
      hasData = true;
      
      if (contextData.recommendedModifications.modifications && 
          Array.isArray(contextData.recommendedModifications.modifications)) {
        formData.recommendedModifications.modifications = contextData.recommendedModifications.modifications.map((mod: any) => ({
          id: mod.id || nanoid(),
          area: mod.area || '',
          description: mod.description || '',
          priority: mod.priority || 'medium',
          cost: mod.cost || '',
          status: mod.status || 'recommended'
        }));
      } else if (typeof contextData.recommendedModifications === 'string') {
        // Try to parse text description into modification items
        const modItems = contextData.recommendedModifications.split(/[.,;]/).filter((item: string) => item.trim().length > 0);
        
        formData.recommendedModifications.modifications = modItems.map((item: string) => {
          // Try to determine area and priority from text
          let area = 'General';
          let priority = 'medium';
          
          const text = item.toLowerCase();
          if (text.includes('bathroom')) area = 'Bathroom';
          if (text.includes('bedroom')) area = 'Bedroom';
          if (text.includes('kitchen')) area = 'Kitchen';
          if (text.includes('stair')) area = 'Stairs';
          if (text.includes('entry')) area = 'Entry';
          
          if (text.includes('urgent') || text.includes('immediate') || text.includes('critical')) {
            priority = 'high';
          } else if (text.includes('consider') || text.includes('future') || text.includes('optional')) {
            priority = 'low';
          }
          
          return {
            id: nanoid(),
            area,
            description: item.trim(),
            priority,
            cost: '',
            status: 'recommended'
          };
        });
      }
    }
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error mapping recommended modifications:", error);
  }
}

/**
 * Enhances data by cross-referencing information between sections
 * @param contextData Full context data
 * @param formData Form data to update
 */
function enhanceDataFromCrossSectionMapping(contextData: any, formData: any) {
  try {
    // Enhance adaptive equipment based on safety assessments
    if (contextData.safetyAssessment) {
      // Check for bathroom equipment needs in bathroom safety assessment
      if (contextData.safetyAssessment.bathroomSafety && 
          contextData.safetyAssessment.bathroomSafety.toLowerCase().includes('grab bar') && 
          !formData.adaptiveEquipment.equipment.some((e: any) => e.name.toLowerCase().includes('grab bar'))) {
        formData.adaptiveEquipment.equipment.push({
          id: nanoid(),
          name: 'Grab bars',
          type: 'Bathroom Safety',
          location: 'Bathroom',
          usage: 'Daily',
          effectiveness: 'Effective'
        });
      }
      
      // Check for night lighting needs
      if (contextData.safetyAssessment.nighttimeSafety && 
          contextData.safetyAssessment.nighttimeSafety.toLowerCase().includes('night light') && 
          !formData.adaptiveEquipment.equipment.some((e: any) => e.name.toLowerCase().includes('night light'))) {
        formData.adaptiveEquipment.equipment.push({
          id: nanoid(),
          name: 'Night lights',
          type: 'Safety Equipment',
          location: 'Hallways and Bathroom',
          usage: 'Nightly',
          effectiveness: 'Effective'
        });
      }
      
      // Check for stair safety needs
      if (contextData.safetyAssessment.stairsSafety && 
          contextData.safetyAssessment.stairsSafety.toLowerCase().includes('handrail') && 
          !formData.adaptiveEquipment.equipment.some((e: any) => e.name.toLowerCase().includes('handrail'))) {
        formData.adaptiveEquipment.equipment.push({
          id: nanoid(),
          name: 'Stair handrails',
          type: 'Safety Equipment',
          location: 'Stairs',
          usage: 'Daily',
          effectiveness: 'Effective'
        });
      }
    }
    
    // Add accessibility issues based on safety concerns
    if (contextData.safetyAssessment) {
      // Extract key safety concerns and convert to accessibility issues
      const safetyAreas = [
        { field: 'bathroomSafety', area: 'bathroom' },
        { field: 'bedroomSafety', area: 'bedroom' },
        { field: 'kitchenSafety', area: 'kitchen' },
        { field: 'stairsSafety', area: 'stairs' },
        { field: 'exteriorSafety', area: 'exterior' }
      ];
      
      for (const safetyArea of safetyAreas) {
        if (contextData.safetyAssessment[safetyArea.field] && 
            (contextData.safetyAssessment[safetyArea.field].toLowerCase().includes('hazard') || 
             contextData.safetyAssessment[safetyArea.field].toLowerCase().includes('unsafe') || 
             contextData.safetyAssessment[safetyArea.field].toLowerCase().includes('risk') || 
             contextData.safetyAssessment[safetyArea.field].toLowerCase().includes('danger'))) {
          
          // Add as an accessibility issue if not already present
          const alreadyAdded = formData.accessibilityIssues.issues.some(
            (issue: any) => issue.area === safetyArea.area && 
                          issue.description.includes(contextData.safetyAssessment[safetyArea.field])
          );
          
          if (!alreadyAdded) {
            formData.accessibilityIssues.issues.push({
              id: nanoid(),
              area: safetyArea.area,
              description: `Safety concern: ${contextData.safetyAssessment[safetyArea.field]}`,
              impactLevel: contextData.safetyAssessment[safetyArea.field].toLowerCase().includes('severe') ? 
                          'severe' : 'moderate',
              recommendations: []
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error in cross-section mapping:", error);
  }
}

/**
 * Maps context data to form data structure
 * @param contextData Environmental assessment data from the assessment context
 * @returns Object containing form data and hasData flag
 */
export function mapContextToForm(contextData: any) {
  try {
    console.log("Environmental Assessment Mapper - Context Data:", contextData);
    
    // Start with default values
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    // Early return if no data
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }

    // Map each section independently with try/catch blocks
    mapDwelling(contextData, formData, hasData);
    mapSafetyAssessment(contextData, formData, hasData);
    mapAccessibilityIssues(contextData, formData, hasData);
    mapAdaptiveEquipment(contextData, formData, hasData);
    mapRecommendedModifications(contextData, formData, hasData);
    
    // Cross-section mapping for enhanced data inference
    enhanceDataFromCrossSectionMapping(contextData, formData);
    
    console.log("Environmental Assessment Mapper - Mapped Form Data:", formData);
    return { formData, hasData: true }; // Set hasData to true if we got to this point
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error mapping context data:", error);
    return { formData: defaultValues, hasData: false };
  }
}

/**
 * Maps form data to context structure
 * @param formData Form data from React Hook Form
 * @returns Context-structured data
 */
export function mapFormToContext(formData: any) {
  try {
    // Convert form data to the structure expected by the context
    const contextData = {
      homeLayout: {
        residenceType: formData.dwelling.type || '',
        ownershipStatus: formData.dwelling.ownership || '',
        numberOfLevels: formData.dwelling.levels || '',
        rooms: {
          bedrooms: formData.dwelling.rooms.bedrooms || 0,
          bathrooms: formData.dwelling.rooms.bathrooms || 0,
          kitchens: formData.dwelling.rooms.kitchens || 0,
          other: formData.dwelling.rooms.other || []
        },
        layoutDescription: formData.dwelling.layout || '',
        entryAccess: {
          stairsToEnter: formData.dwelling.entryAccess.stairsToEnter || false,
          numberOfSteps: formData.dwelling.entryAccess.numberOfSteps || '',
          handrails: formData.dwelling.entryAccess.handrails || false,
          elevatorAccess: formData.dwelling.entryAccess.elevatorAccess || false,
          notes: formData.dwelling.entryAccess.notes || ''
        },
        otherOccupants: formData.dwelling.otherOccupants || []
      },
      safetyAssessment: {
        generalSafety: formData.safetyAssessment.generalSafety || '',
        bedroomSafety: formData.safetyAssessment.bedroomSafety || '',
        bathroomSafety: formData.safetyAssessment.bathroomSafety || '',
        kitchenSafety: formData.safetyAssessment.kitchenSafety || '',
        stairsSafety: formData.safetyAssessment.stairsSafety || '',
        exteriorSafety: formData.safetyAssessment.exteriorSafety || '',
        nighttimeSafety: formData.safetyAssessment.nighttimeSafety || '',
        emergencyPlanning: formData.safetyAssessment.emergencyPlanning || ''
      },
      accessibilityIssues: {
        issues: formData.accessibilityIssues.issues.map((issue: any) => ({
          id: issue.id,
          area: issue.area || '',
          description: issue.description || '',
          impactLevel: issue.impactLevel || 'moderate',
          recommendations: issue.recommendations || []
        }))
      },
      adaptiveEquipment: {
        equipment: formData.adaptiveEquipment.equipment.map((equip: any) => ({
          id: equip.id,
          name: equip.name || '',
          type: equip.type || '',
          location: equip.location || '',
          usage: equip.usage || '',
          effectiveness: equip.effectiveness || ''
        }))
      },
      recommendedModifications: {
        modifications: formData.recommendedModifications.modifications.map((mod: any) => ({
          id: mod.id,
          area: mod.area || '',
          description: mod.description || '',
          priority: mod.priority || 'medium',
          cost: mod.cost || '',
          status: mod.status || 'recommended'
        }))
      }
    };
    
    console.log("Environmental Assessment Mapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error mapping to context:", error);
    return {};
  }
}

/**
 * Creates a JSON export of the environmental assessment data
 * @param contextData The context data from AssessmentContext
 * @returns String representation of the JSON data
 */
export function exportToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports environmental assessment from JSON
 * @param jsonString JSON string representation of environmental assessment data
 * @returns Parsed environmental assessment data
 */
export function importFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Environmental Assessment Mapper - Error importing from JSON:", error);
    return null;
  }
}
