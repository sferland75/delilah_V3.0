/**
 * Typical Day Data Mapping Service
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

import { nanoid } from 'nanoid';

// Default form values
export const defaultValues = {
  morning: {
    wakeUpTime: '',
    routines: [
      { id: nanoid(), time: '', activity: '', independence: 'independent', notes: '' }
    ]
  },
  afternoon: {
    routines: [
      { id: nanoid(), time: '', activity: '', independence: 'independent', notes: '' }
    ]
  },
  evening: {
    bedtime: '',
    routines: [
      { id: nanoid(), time: '', activity: '', independence: 'independent', notes: '' }
    ]
  },
  night: {
    sleepQuality: '',
    routines: [
      { id: nanoid(), time: '', activity: '', independence: 'independent', notes: '' }
    ]
  },
  weekdayWeekendDifferences: '',
  seasonalConsiderations: '',
  summary: ''
};

/**
 * Converts a text description into structured activities
 * @param text Descriptive text of activities
 * @returns Array of activity objects
 */
function textToActivities(text: string) {
  if (!text || typeof text !== 'string') return [{ 
    id: nanoid(), 
    time: '', 
    activity: '', 
    independence: 'independent', 
    notes: '' 
  }];
  
  try {
    // Split the text into lines or sentences
    const lines = text.includes('\n') ? 
      text.split('\n') : 
      text.split(/\.\s*/).filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
      return [{ id: nanoid(), time: '', activity: '', independence: 'independent', notes: '' }];
    }
    
    return lines.map(line => {
      const activity: any = { id: nanoid(), activity: line.trim(), independence: 'independent', notes: '' };
      
      // Try to extract time information
      const timePattern = /(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)/;
      const timeMatch = line.match(timePattern);
      if (timeMatch && timeMatch[1]) {
        activity.time = timeMatch[1].trim();
        activity.activity = line.replace(timeMatch[1], '').trim();
        if (activity.activity.startsWith('-')) {
          activity.activity = activity.activity.substring(1).trim();
        }
      }
      
      // Try to determine independence level from keywords
      if (line.includes('assistance') || line.includes('help') || line.includes('aided')) {
        activity.independence = 'assisted';
      } else if (line.includes('dependent') || line.includes('unable') || line.includes('requires full')) {
        activity.independence = 'dependent';
      }
      
      // Extract notes from parentheses if present
      const notesPattern = /\(([^)]+)\)/;
      const notesMatch = line.match(notesPattern);
      if (notesMatch && notesMatch[1]) {
        activity.notes = notesMatch[1].trim();
        activity.activity = activity.activity.replace(notesPattern, '').trim();
      }
      
      return activity;
    });
  } catch (error) {
    console.error("Typical Day Mapper - Error converting text to activities:", error);
    return [{ id: nanoid(), time: '', activity: '', independence: 'independent', notes: '' }];
  }
}

/**
 * Converts structured activities into a descriptive text
 * @param activities Array of activity objects
 * @returns Descriptive text
 */
function activitiesToText(activities: any[]) {
  if (!activities || !Array.isArray(activities) || activities.length === 0) return '';
  
  try {
    return activities.map(activity => {
      let text = '';
      
      // Add time if available
      if (activity.time) {
        text += `${activity.time} - `;
      }
      
      // Add activity description
      text += activity.activity || '';
      
      // Add independence level if not independent
      if (activity.independence === 'assisted') {
        text += ' (requires assistance)';
      } else if (activity.independence === 'dependent') {
        text += ' (dependent)';
      }
      
      // Add notes if available
      if (activity.notes && !text.includes(activity.notes)) {
        text += ` (${activity.notes})`;
      }
      
      return text;
    }).join('\n');
  } catch (error) {
    console.error("Typical Day Mapper - Error converting activities to text:", error);
    return '';
  }
}

/**
 * Maps context data to form data structure
 * @param contextData Typical day data from the assessment context
 * @returns Object containing form data and hasData flag
 */
export function mapContextToForm(contextData: any) {
  try {
    console.log("Typical Day Mapper - Context Data:", contextData);
    
    // Start with default values
    const formData = JSON.parse(JSON.stringify(defaultValues));
    let hasData = false;
    
    // Early return if no data
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }

    // Map Morning data
    try {
      if (contextData.morning) {
        hasData = true;
        
        // Map wake-up time
        formData.morning.wakeUpTime = contextData.morning.wakeUpTime || '';
        
        // Map morning routines
        if (contextData.morning.routines && Array.isArray(contextData.morning.routines)) {
          formData.morning.routines = contextData.morning.routines;
        } else if (contextData.morning.description) {
          // Convert text description to activities
          formData.morning.routines = textToActivities(contextData.morning.description);
        } else if (typeof contextData.morning === 'string') {
          // Convert text description to activities
          formData.morning.routines = textToActivities(contextData.morning);
        }
      }
    } catch (error) {
      console.error("Typical Day Mapper - Error mapping morning routines:", error);
    }
    
    // Map Afternoon data
    try {
      if (contextData.afternoon) {
        hasData = true;
        
        // Map afternoon routines
        if (contextData.afternoon.routines && Array.isArray(contextData.afternoon.routines)) {
          formData.afternoon.routines = contextData.afternoon.routines;
        } else if (contextData.afternoon.description) {
          // Convert text description to activities
          formData.afternoon.routines = textToActivities(contextData.afternoon.description);
        } else if (typeof contextData.afternoon === 'string') {
          // Convert text description to activities
          formData.afternoon.routines = textToActivities(contextData.afternoon);
        }
      }
    } catch (error) {
      console.error("Typical Day Mapper - Error mapping afternoon routines:", error);
    }
    
    // Map Evening data
    try {
      if (contextData.evening) {
        hasData = true;
        
        // Map bedtime
        formData.evening.bedtime = contextData.evening.bedtime || '';
        
        // Map evening routines
        if (contextData.evening.routines && Array.isArray(contextData.evening.routines)) {
          formData.evening.routines = contextData.evening.routines;
        } else if (contextData.evening.description) {
          // Convert text description to activities
          formData.evening.routines = textToActivities(contextData.evening.description);
        } else if (typeof contextData.evening === 'string') {
          // Convert text description to activities
          formData.evening.routines = textToActivities(contextData.evening);
        }
      }
    } catch (error) {
      console.error("Typical Day Mapper - Error mapping evening routines:", error);
    }
    
    // Map Night data
    try {
      if (contextData.night) {
        hasData = true;
        
        // Map sleep quality
        formData.night.sleepQuality = contextData.night.sleepQuality || '';
        
        // Map night routines
        if (contextData.night.routines && Array.isArray(contextData.night.routines)) {
          formData.night.routines = contextData.night.routines;
        } else if (contextData.night.description) {
          // Convert text description to activities
          formData.night.routines = textToActivities(contextData.night.description);
        } else if (typeof contextData.night === 'string') {
          // Convert text description to activities
          formData.night.routines = textToActivities(contextData.night);
        }
      }
    } catch (error) {
      console.error("Typical Day Mapper - Error mapping night routines:", error);
    }
    
    // Map additional information
    try {
      // Map weekday/weekend differences
      if (contextData.weekdayWeekendDifferences) {
        formData.weekdayWeekendDifferences = contextData.weekdayWeekendDifferences;
        hasData = true;
      }
      
      // Map seasonal considerations
      if (contextData.seasonalConsiderations) {
        formData.seasonalConsiderations = contextData.seasonalConsiderations;
        hasData = true;
      }
      
      // Map summary
      if (contextData.summary) {
        formData.summary = contextData.summary;
        hasData = true;
      }
    } catch (error) {
      console.error("Typical Day Mapper - Error mapping additional information:", error);
    }
    
    console.log("Typical Day Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    console.error("Typical Day Mapper - Error mapping context data:", error);
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
      morning: {
        wakeUpTime: formData.morning.wakeUpTime || '',
        routines: formData.morning.routines,
        description: activitiesToText(formData.morning.routines)
      },
      afternoon: {
        routines: formData.afternoon.routines,
        description: activitiesToText(formData.afternoon.routines)
      },
      evening: {
        bedtime: formData.evening.bedtime || '',
        routines: formData.evening.routines,
        description: activitiesToText(formData.evening.routines)
      },
      night: {
        sleepQuality: formData.night.sleepQuality || '',
        routines: formData.night.routines,
        description: activitiesToText(formData.night.routines)
      },
      weekdayWeekendDifferences: formData.weekdayWeekendDifferences || '',
      seasonalConsiderations: formData.seasonalConsiderations || '',
      summary: formData.summary || ''
    };
    
    console.log("Typical Day Mapper - Mapped Context Data:", contextData);
    return contextData;
  } catch (error) {
    console.error("Typical Day Mapper - Error mapping to context:", error);
    return {};
  }
}

/**
 * Creates a JSON export of the typical day data
 * @param contextData The context data from AssessmentContext
 * @returns String representation of the JSON data
 */
export function exportToJson(contextData: any) {
  try {
    return JSON.stringify(contextData, null, 2);
  } catch (error) {
    console.error("Typical Day Mapper - Error exporting to JSON:", error);
    return '';
  }
}

/**
 * Imports typical day data from JSON
 * @param jsonString JSON string representation of typical day data
 * @returns Parsed typical day data
 */
export function importFromJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Typical Day Mapper - Error importing from JSON:", error);
    return null;
  }
}
