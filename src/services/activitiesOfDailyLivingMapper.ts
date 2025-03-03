/**
 * Activities of Daily Living Data Mapping Service
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

import { nanoid } from 'nanoid';

// Default form values
export const defaultValues = {
  basicADLs: {
    feeding: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    bathing: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    grooming: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    dressing: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    toileting: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    mobilityTransfers: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    continence: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    }
  },
  instrumentalADLs: {
    cooking: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    cleaning: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    laundry: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    shopping: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    transportation: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    medication: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    finances: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    },
    communication: {
      independence: 'independent',
      details: '',
      equipment: '',
      notes: ''
    }
  },
  leisureRecreation: {
    physicalActivities: [],
    sports: [],
    volunteering: [],
    socialActivities: [],
    travel: []
  },
  summary: ''
};

/**
 * Determines independence level from a text description
 * @param text Description text to analyze
 * @returns Independence level: 'independent', 'assisted', or 'dependent'
 */
function determineIndependenceLevel(text: string): string {
  if (!text) return 'independent';
  
  const lowerText = text.toLowerCase();
  
  // Check for dependent indicators
  if (lowerText.includes('unable') ||
      lowerText.includes('cannot') ||
      lowerText.includes('dependent') ||
      lowerText.includes('completely') ||
      lowerText.includes('full assist') ||
      lowerText.includes('total assist')) {
    return 'dependent';
  }
  
  // Check for assisted indicators
  if (lowerText.includes('assist') ||
      lowerText.includes('help') ||
      lowerText.includes('support') ||
      lowerText.includes('supervision') ||
      lowerText.includes('cuing') ||
      lowerText.includes('partial') ||
      lowerText.includes('moderate') ||
      lowerText.includes('min assist') ||
      lowerText.includes('mod assist') ||
      lowerText.includes('setup') ||
      lowerText.includes('difficulty')) {
    return 'assisted';
  }
  
  // Default to independent
  return 'independent';
}

/**
 * Extracts equipment information from a text description
 * @param text Description text to analyze
 * @returns Equipment information as a string
 */
function extractEquipment(text: string): string {
  if (!text) return '';
  
  const lowerText = text.toLowerCase();
  const equipmentTerms = [
    'grab bar',
    'shower chair',
    'bath bench',
    'raised toilet',
    'commode',
    'walker',
    'cane',
    'wheelchair',
    'reacher',
    'dressing stick',
    'sock aid',
    'assistive device',
    'adaptive equipment',
    'utensil',
    'plate guard',
    'cup',
    'transfer',
    'lift',
    'pole',
    'rails'
  ];
  
  // Try to find equipment mentions in the text
  let equipmentFound = '';
  for (const term of equipmentTerms) {
    if (lowerText.includes(term)) {
      // Find the sentence containing the equipment term
      const sentences = text.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (sentence.toLowerCase().includes(term)) {
          // This sentence contains equipment information
          if (equipmentFound) {
            equipmentFound += '; ';
          }
          equipmentFound += sentence.trim();
          break;
        }
      }
    }
  }
  
  return equipmentFound;
}

/**
 * Creates a leisure activity entry
 * @param activity Activity details
 * @returns Formatted activity object
 */
function createLeisureActivity(activity: string | any): any {
  if (typeof activity === 'string') {
    return {
      id: nanoid(),
      name: activity,
      frequency: '',
      adaptations: '',
      notes: ''
    };
  }
  
  return {
    id: activity.id || nanoid(),
    name: activity.name || activity.activity || '',
    frequency: activity.frequency || '',
    adaptations: activity.adaptations || activity.modifications || '',
    notes: activity.notes || ''
  };
}

/**
 * Maps context data to form data structure
 * @param contextData Activities of daily living data from the assessment context
 * @returns Object containing form data and hasData flag
 */
export function mapContextToForm(contextData: any) {
  try {
    console.log("ADL Mapper - Context Data:", contextData);
    
    // Start with default values
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    // Early return if no data
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }

    // 1. Map Basic ADLs
    try {
      if (contextData.basicADLs) {
        hasData = true;
        
        // Map each basic ADL category
        const adlCategories = [
          'feeding',
          'bathing',
          'grooming',
          'dressing',
          'toileting',
          'mobilityTransfers',
          'continence'
        ];
        
        for (const category of adlCategories) {
          if (contextData.basicADLs[category]) {
            // Check if the category data is a string or an object
            if (typeof contextData.basicADLs[category] === 'string') {
              // It's a string description, analyze it
              const description = contextData.basicADLs[category];
              formData.basicADLs[category].details = description;
              formData.basicADLs[category].independence = determineIndependenceLevel(description);
              formData.basicADLs[category].equipment = extractEquipment(description);
            } else {
              // It's an object with structured data
              formData.basicADLs[category].independence = 
                contextData.basicADLs[category].independence || 
                determineIndependenceLevel(contextData.basicADLs[category].details || '');
              
              formData.basicADLs[category].details = contextData.basicADLs[category].details || '';
              formData.basicADLs[category].equipment = contextData.basicADLs[category].equipment || '';
              formData.basicADLs[category].notes = contextData.basicADLs[category].notes || '';
            }
          }
        }
      } else if (contextData.selfCare) {
        // Alternative structure: try to map from selfCare data
        hasData = true;
        
        // Map each basic ADL from selfCare data
        const selfCareMapping = {
          feeding: 'eating',
          bathing: 'bathing',
          grooming: 'grooming',
          dressing: 'dressing',
          toileting: 'toileting',
          mobilityTransfers: 'transfers',
          continence: 'continence'
        };
        
        for (const [formKey, contextKey] of Object.entries(selfCareMapping)) {
          if (contextData.selfCare[contextKey]) {
            // Check if it's a string or an object
            if (typeof contextData.selfCare[contextKey] === 'string') {
              // It's a string description, analyze it
              const description = contextData.selfCare[contextKey];
              formData.basicADLs[formKey].details = description;
              formData.basicADLs[formKey].independence = determineIndependenceLevel(description);
              formData.basicADLs[formKey].equipment = extractEquipment(description);
            } else {
              // It's an object with structured data
              formData.basicADLs[formKey].independence = 
                contextData.selfCare[contextKey].independence || 
                determineIndependenceLevel(contextData.selfCare[contextKey].details || '');
              
              formData.basicADLs[formKey].details = contextData.selfCare[contextKey].details || '';
              formData.basicADLs[formKey].equipment = contextData.selfCare[contextKey].equipment || '';
              formData.basicADLs[formKey].notes = contextData.selfCare[contextKey].notes || '';
            }
          }
        }
      }
    } catch (error) {
      console.error("ADL Mapper - Error mapping basic ADLs:", error);
    }
    
    // 2. Map Instrumental ADLs
    try {
      if (contextData.instrumentalADLs) {
        hasData = true;
        
        // Map each instrumental ADL category
        const iadlCategories = [
          'cooking',
          'cleaning',
          'laundry',
          'shopping',
          'transportation',
          'medication',
          'finances',
          'communication'
        ];
        
        for (const category of iadlCategories) {
          if (contextData.instrumentalADLs[category]) {
            // Check if the category data is a string or an object
            if (typeof contextData.instrumentalADLs[category] === 'string') {
              // It's a string description, analyze it
              const description = contextData.instrumentalADLs[category];
              formData.instrumentalADLs[category].details = description;
              formData.instrumentalADLs[category].independence = determineIndependenceLevel(description);
              formData.instrumentalADLs[category].equipment = extractEquipment(description);
            } else {
              // It's an object with structured data
              formData.instrumentalADLs[category].independence = 
                contextData.instrumentalADLs[category].independence || 
                determineIndependenceLevel(contextData.instrumentalADLs[category].details || '');
              
              formData.instrumentalADLs[category].details = contextData.instrumentalADLs[category].details || '';
              formData.instrumentalADLs[category].equipment = contextData.instrumentalADLs[category].equipment || '';
              formData.instrumentalADLs[category].notes = contextData.instrumentalADLs[category].notes || '';
            }
          }
        }
      } else if (contextData.homeManagement) {
        // Alternative structure: try to map from homeManagement data
        hasData = true;
        
        // Map each IADL from homeManagement data
        const homeManagementMapping = {
          cooking: 'mealPreparation',
          cleaning: 'housekeeping',
          laundry: 'laundry',
          shopping: 'shopping',
          transportation: 'transportation',
          medication: 'medicationManagement',
          finances: 'financialManagement',
          communication: 'communication'
        };
        
        for (const [formKey, contextKey] of Object.entries(homeManagementMapping)) {
          if (contextData.homeManagement[contextKey]) {
            // Check if it's a string or an object
            if (typeof contextData.homeManagement[contextKey] === 'string') {
              // It's a string description, analyze it
              const description = contextData.homeManagement[contextKey];
              formData.instrumentalADLs[formKey].details = description;
              formData.instrumentalADLs[formKey].independence = determineIndependenceLevel(description);
              formData.instrumentalADLs[formKey].equipment = extractEquipment(description);
            } else {
              // It's an object with structured data
              formData.instrumentalADLs[formKey].independence = 
                contextData.homeManagement[contextKey].independence || 
                determineIndependenceLevel(contextData.homeManagement[contextKey].details || '');
              
              formData.instrumentalADLs[formKey].details = contextData.homeManagement[contextKey].details || '';
              formData.instrumentalADLs[formKey].equipment = contextData.homeManagement[contextKey].equipment || '';
              formData.instrumentalADLs[formKey].notes = contextData.homeManagement[contextKey].notes || '';
            }
          }
        }
      }
    } catch (error) {
      console.error("ADL Mapper - Error mapping instrumental ADLs:", error);
    }
    
    // 3. Map Leisure & Recreation
    try {
      if (contextData.leisureRecreation) {
        hasData = true;
        
        // Map physical activities
        if (contextData.leisureRecreation.physicalActivities) {
          if (Array.isArray(contextData.leisureRecreation.physicalActivities)) {
            formData.leisureRecreation.physicalActivities = contextData.leisureRecreation.physicalActivities.map(
              (activity: any) => createLeisureActivity(activity)
            );
          } else if (typeof contextData.leisureRecreation.physicalActivities === 'string') {
            // If it's a comma-separated string, split it
            const activities = contextData.leisureRecreation.physicalActivities.split(',');
            formData.leisureRecreation.physicalActivities = activities.map(
              (activity: string) => createLeisureActivity(activity.trim())
            );
          }
        }
        
        // Map sports
        if (contextData.leisureRecreation.sports) {
          if (Array.isArray(contextData.leisureRecreation.sports)) {
            formData.leisureRecreation.sports = contextData.leisureRecreation.sports.map(
              (activity: any) => createLeisureActivity(activity)
            );
          } else if (typeof contextData.leisureRecreation.sports === 'string') {
            const activities = contextData.leisureRecreation.sports.split(',');
            formData.leisureRecreation.sports = activities.map(
              (activity: string) => createLeisureActivity(activity.trim())
            );
          }
        }
        
        // Map volunteering
        if (contextData.leisureRecreation.volunteering) {
          if (Array.isArray(contextData.leisureRecreation.volunteering)) {
            formData.leisureRecreation.volunteering = contextData.leisureRecreation.volunteering.map(
              (activity: any) => createLeisureActivity(activity)
            );
          } else if (typeof contextData.leisureRecreation.volunteering === 'string') {
            const activities = contextData.leisureRecreation.volunteering.split(',');
            formData.leisureRecreation.volunteering = activities.map(
              (activity: string) => createLeisureActivity(activity.trim())
            );
          }
        }
        
        // Map social activities
        if (contextData.leisureRecreation.socialActivities) {
          if (Array.isArray(contextData.leisureRecreation.socialActivities)) {
            formData.leisureRecreation.socialActivities = contextData.leisureRecreation.socialActivities.map(
              (activity: any) => createLeisureActivity(activity)
            );
          } else if (typeof contextData.leisureRecreation.socialActivities === 'string') {
            const activities = contextData.leisureRecreation.socialActivities.split(',');
            formData.leisureRecreation.socialActivities = activities.map(
              (activity: string) => createLeisureActivity(activity.trim())
            );
          }
        }
        
        // Map travel
        if (contextData.leisureRecreation.travel) {
          if (Array.isArray(contextData.leisureRecreation.travel)) {
            formData.leisureRecreation.travel = contextData.leisureRecreation.travel.map(
              (activity: any) => createLeisureActivity(activity)
            );
          } else if (typeof contextData.leisureRecreation.travel === 'string') {
            const activities = contextData.leisureRecreation.travel.split(',');
            formData.leisureRecreation.travel = activities.map(
              (activity: string) => createLeisureActivity(activity.trim())
            );
          }
        }
      } else if (contextData.leisure || contextData.recreation) {
        // Alternative structure: try to map from separate leisure or recreation data
        hasData = true;
        const leisureData = contextData.leisure || {};
        const recreationData = contextData.recreation || {};
        
        // Helper function to process activities
        const processActivities = (activities: any, category: string) => {
          if (Array.isArray(activities)) {
            formData.leisureRecreation[category] = activities.map(
              (activity: any) => createLeisureActivity(activity)
            );
          } else if (typeof activities === 'string') {
            const acts = activities.split(',');
            formData.leisureRecreation[category] = acts.map(
              (activity: string) => createLeisureActivity(activity.trim())
            );
          }
        };
        
        // Map from leisure data
        if (leisureData.activities) {
          processActivities(leisureData.activities, 'socialActivities');
        }
        
        // Map from recreation data
        if (recreationData.physical) {
          processActivities(recreationData.physical, 'physicalActivities');
        }
        
        if (recreationData.sports) {
          processActivities(recreationData.sports, 'sports');
        }
        
        if (recreationData.social) {
          processActivities(recreationData.social, 'socialActivities');
        }
        
        if (recreationData.travel) {
          processActivities(recreationData.travel, 'travel');
        }
        
        if (recreationData.volunteering) {
          processActivities(recreationData.volunteering, 'volunteering');
        }
      }
    } catch (error) {
      console.error("ADL Mapper - Error mapping leisure & recreation:", error);
    }
    
    // 4. Map Summary
    try {
      if (contextData.summary) {
        formData.summary = contextData.summary;
        hasData = true;
      } else if (contextData.adlSummary) {
        formData.summary = contextData.adlSummary;
        hasData = true;
      }
    } catch (error) {
      console.error("ADL Mapper - Error mapping summary:", error);
    }
    
    console.log("ADL Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    console.error("ADL Mapper - Error mapping context data:", error);
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
      basicADLs: {
        feeding: {
          independence: formData.basicADLs.feeding.independence,
          details: formData.basicADLs.feeding.details,
          equipment: formData.basicADLs.feeding.equipment,
          notes: formData.basicADLs.feeding.notes
        },
        bathing: {
          independence: formData.basicADLs.bathing.independence,
          details: formData.basicADLs.bathing.details,
          equipment: formData.basicADLs.bathing.equipment,
          notes: formData.basicADLs.bathing.notes
        },
        grooming: {
          independence: formData.basicADLs.grooming.independence,
          details: formData.basicADLs.grooming.details,
          equipment: formData.basicADLs.grooming.equipment,
          notes: formData.basicADLs.grooming.notes
        },
        dressing: {
          independence: formData.basicADLs.dressing.independence,
          details: formData.basicADLs.dressing.details,
          equipment: formData.basicADLs.dressing.equipment,
          notes: formData.basicADLs.dressing.notes
        },
        toileting: {
          independence: formData.basicADLs.toileting.independence,
          details: formData.basicADLs.toileting.details,
          equipment: formData.basicADLs.toileting.equipment,
          notes: formData.basicADLs.toileting.notes
        },
        mobilityTransfers: {
          independence: formData.basicADLs.mobilityTransfers.independence,
          details: formData.basicADLs.mobilityTransfers.details,
          equipment: formData.basicADLs.mobilityTransfers.equipment,
          notes: formData.basicADLs.mobilityTransfers.notes
        },
        continence: {
          independence: formData.basicADLs.continence.independence,
          details: formData.basicADLs.continence.details,
          equipment: formData.basicADLs.continence.equipment,
          notes: formData.basicADLs.continence.notes
        }
      },
      instrumentalADLs: {
        cooking: {
          independence: formData.instrumentalADLs.cooking.independence,
          details: formData.instrumentalADLs.cooking.details,
          equipment: formData.instrumentalADLs.cooking.equipment,
          notes: formData.instrumentalADLs.cooking.notes
        },
        cleaning: {
          independence: formData.instrumentalADLs.cleaning.independence,
          details: formData.instrumentalADLs.cleaning.details,
          equipment: formData.instrumentalADLs.cleaning.equipment,
          notes: formData.instrumentalADLs.cleaning.notes
        },
        laundry: {
          independence: formData.instrumentalADLs.laundry.independence,
          details: formData.instrumentalADLs.laundry.details,
          equipment: formData.instrumentalADLs.laundry.equipment,
          notes: formData.instrumentalADLs.laundry.notes
        },
        shopping: {
          independence: formData.instrumentalADLs.shopping.independence,
          details: formData.instrumentalADLs.shopping.details,
          equipment: formData.instrumentalADLs.shopping.equipment,
          notes: formData.instrumentalADLs.shopping.notes
        },
        transportation: {
          independence: formData.instrumentalADLs.transportation.independence,
          details: formData.instrumentalADLs.transportation.details,
          equipment: formData.instrumentalADLs.transportation.equipment,
          notes: formData.instrumentalADLs.transportation.notes
        },
        medication: {
          independence: formData.instrumentalADLs.medication.independence,
          details: formData.instrumentalADLs.medication.details,
          equipment: formData.instrumentalADLs.medication.equipment,
          notes: formData.instrumentalADLs.medication.notes
        },
        finances: {
          independence: formData.instrumentalADLs.finances.independence,
          details: formData.instrumentalADLs.finances.details,
          equipment: formData.instrumentalADLs.finances.equipment,
          notes: formData.instrumentalADLs.finances.notes
        },
        communication: {
          independence: formData.instrumentalADLs.communication.independence,
          details: formData.instrumentalADLs.communication.details,
          equipment: formData.instrumentalADLs.communication.equipment,
          notes: formData.instrumentalADLs.communication.notes
        }
      },
      leisureRecreation: {
        physicalActivities: formData.leisureRecreation.physicalActivities,
        sports: formData.leisureRecreation.sports,
        volunteering: formData.leisureRecreation.volunteering,
        socialActivities: formData.leisureRecreation.socialActivities,
        travel: formData.leisureRecreation.travel
      },
      summary: formData.summary
    };
    
    console.log("ADL Mapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    console.error("ADL Mapper - Error mapping to context:", error);
    return {};
  }
}

/**
 * Creates a JSON export of the activities of daily living data
 * @param contextData The context data from AssessmentContext
 * @returns String representation of the JSON data
 */
export function exportToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("ADL Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports activities of daily living data from JSON
 * @param jsonString JSON string representation of activities of daily living data
 * @returns Parsed activities of daily living data
 */
export function importFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("ADL Mapper - Error importing from JSON:", error);
    return null;
  }
}
