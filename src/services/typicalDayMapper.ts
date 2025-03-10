/**
 * Typical Day Data Mapping Service
 * 
 * This service handles bidirectional mapping between:
 * 1. Context data structure (as used in AssessmentContext)
 * 2. Form data structure (as used in React Hook Form)
 */

import { nanoid } from 'nanoid';
import { TypicalDay } from '@/sections/6-TypicalDay/schema';
import { ContextTypicalDayData } from '@/sections/6-TypicalDay/types';

// Default activity for new entries
const defaultActivity = { 
  timeBlock: '', 
  description: '', 
  assistance: '', 
  limitations: '' 
};

/**
 * Converts a text description into structured activities
 * @param text Descriptive text of activities
 * @returns Array of activity objects
 */
function textToActivities(text: string) {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  try {
    // Split the text into lines or sentences
    const lines = text.includes('\n') ? 
      text.split('\n') : 
      text.split(/\.\s*/).filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
      return [];
    }
    
    return lines.map(line => {
      const activity: any = { 
        timeBlock: '', 
        description: line.trim(), 
        assistance: '', 
        limitations: '' 
      };
      
      // Try to extract time information
      const timePattern = /(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)/;
      const timeMatch = line.match(timePattern);
      if (timeMatch && timeMatch[1]) {
        activity.timeBlock = timeMatch[1].trim();
        activity.description = line.replace(timeMatch[1], '').trim();
        if (activity.description.startsWith('-')) {
          activity.description = activity.description.substring(1).trim();
        }
      }
      
      // Extract assistance information
      if (line.includes('Assistance:')) {
        const parts = line.split('Assistance:');
        activity.description = parts[0].trim();
        activity.assistance = parts[1].trim();
      } else if (line.toLowerCase().includes('requires assistance')) {
        activity.assistance = 'Requires assistance';
      } else if (line.toLowerCase().includes('with assistance')) {
        activity.assistance = 'With assistance';
      }
      
      // Extract limitations information
      if (line.includes('Limitations:')) {
        const parts = line.split('Limitations:');
        if (!activity.assistance) {
          activity.description = parts[0].trim();
        }
        activity.limitations = parts[1].trim();
      } else if (line.toLowerCase().includes('limited by')) {
        const parts = line.split(/limited by/i);
        if (parts.length > 1) {
          activity.limitations = 'Limited by ' + parts[1].trim();
        }
      }
      
      return activity;
    });
  } catch (error) {
    console.error("Typical Day Mapper - Error converting text to activities:", error);
    return [];
  }
}

/**
 * Converts structured activities into a descriptive text
 * @param activities Array of activity objects
 * @returns Descriptive text
 */
function activitiesToText(activities: any[]) {
  if (!activities || !Array.isArray(activities) || activities.length === 0) {
    return '';
  }
  
  try {
    return activities.map(activity => {
      let text = '';
      
      // Add time if available
      if (activity.timeBlock) {
        text += `${activity.timeBlock}: `;
      }
      
      // Add activity description
      text += activity.description || '';
      
      // Add assistance if available
      if (activity.assistance) {
        text += ` Assistance: ${activity.assistance}`;
      }
      
      // Add limitations if available
      if (activity.limitations) {
        text += ` Limitations: ${activity.limitations}`;
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
export function mapContextToForm(contextData: ContextTypicalDayData): { formData: TypicalDay, hasData: boolean } {
  try {
    console.log("Typical Day Mapper - Context Data:", contextData);
    
    // Start with default values from the schema
    const formData: TypicalDay = {
      config: {
        activeTab: 'preAccident',
        mode: 'edit'
      },
      data: {
        preAccident: {
          dailyRoutine: {
            morning: [],
            afternoon: [],
            evening: [],
            night: []
          },
          sleepSchedule: {
            type: 'regular',
            regularSchedule: {
              wakeTime: '',
              bedTime: '',
              sleepQuality: ''
            }
          }
        },
        postAccident: {
          dailyRoutine: {
            morning: [],
            afternoon: [],
            evening: [],
            night: []
          },
          sleepSchedule: {
            type: 'regular',
            regularSchedule: {
              wakeTime: '',
              bedTime: '',
              sleepQuality: ''
            }
          }
        }
      }
    };
    
    let hasData = false;
    
    // Early return if no data
    if (!contextData || Object.keys(contextData).length === 0) {
      return { formData, hasData };
    }

    // Map data for both pre and post accident
    for (const timeframe of ['preAccident', 'postAccident'] as const) {
      try {
        if (contextData[timeframe]?.dailyRoutine) {
          const dailyRoutine = contextData[timeframe].dailyRoutine;

          // Map morning activities
          if (dailyRoutine.morningActivities) {
            formData.data[timeframe].dailyRoutine.morning = textToActivities(dailyRoutine.morningActivities);
            hasData = true;
          }

          // Map afternoon activities
          if (dailyRoutine.afternoonActivities) {
            formData.data[timeframe].dailyRoutine.afternoon = textToActivities(dailyRoutine.afternoonActivities);
            hasData = true;
          }

          // Map evening activities
          if (dailyRoutine.eveningActivities) {
            formData.data[timeframe].dailyRoutine.evening = textToActivities(dailyRoutine.eveningActivities);
            hasData = true;
          }

          // Map night activities
          if (dailyRoutine.nightActivities) {
            formData.data[timeframe].dailyRoutine.night = textToActivities(dailyRoutine.nightActivities);
            hasData = true;
          }

          // Map sleep schedule
          if (dailyRoutine.sleepSchedule) {
            hasData = true;

            // Check for irregular schedule
            if (dailyRoutine.sleepSchedule.irregularScheduleDetails) {
              formData.data[timeframe].sleepSchedule = {
                type: 'irregular',
                irregularScheduleDetails: dailyRoutine.sleepSchedule.irregularScheduleDetails
              };
            } else {
              // Regular schedule
              formData.data[timeframe].sleepSchedule = {
                type: 'regular',
                regularSchedule: {
                  wakeTime: dailyRoutine.sleepSchedule.wakeTime || '',
                  bedTime: dailyRoutine.sleepSchedule.bedTime || '',
                  sleepQuality: dailyRoutine.sleepSchedule.sleepQuality || ''
                }
              };
            }
          }
        }
      } catch (error) {
        console.error(`Typical Day Mapper - Error mapping ${timeframe} data:`, error);
      }
    }

    // Set active tab if specified in context
    if (contextData.config?.activeTab) {
      formData.config.activeTab = contextData.config.activeTab;
    }
    
    console.log("Typical Day Mapper - Mapped Form Data:", formData);
    return { formData, hasData };
  } catch (error) {
    console.error("Typical Day Mapper - Error mapping context data:", error);
    // Return default form data in case of error
    return { 
      formData: {
        config: {
          activeTab: 'preAccident',
          mode: 'edit'
        },
        data: {
          preAccident: {
            dailyRoutine: {
              morning: [],
              afternoon: [],
              evening: [],
              night: []
            },
            sleepSchedule: {
              type: 'regular',
              regularSchedule: {
                wakeTime: '',
                bedTime: '',
                sleepQuality: ''
              }
            }
          },
          postAccident: {
            dailyRoutine: {
              morning: [],
              afternoon: [],
              evening: [],
              night: []
            },
            sleepSchedule: {
              type: 'regular',
              regularSchedule: {
                wakeTime: '',
                bedTime: '',
                sleepQuality: ''
              }
            }
          }
        }
      }, 
      hasData: false 
    };
  }
}

/**
 * Maps form data to context structure
 * @param formData Form data from React Hook Form
 * @returns Context-structured data
 */
export function mapFormToContext(formData: TypicalDay): ContextTypicalDayData {
  try {
    // Convert form data to the structure expected by the context
    const contextData: ContextTypicalDayData = {
      config: {
        activeTab: formData.config.activeTab
      },
      preAccident: {
        dailyRoutine: {
          morningActivities: activitiesToText(formData.data.preAccident.dailyRoutine.morning),
          afternoonActivities: activitiesToText(formData.data.preAccident.dailyRoutine.afternoon),
          eveningActivities: activitiesToText(formData.data.preAccident.dailyRoutine.evening),
          nightActivities: activitiesToText(formData.data.preAccident.dailyRoutine.night)
        }
      },
      postAccident: {
        dailyRoutine: {
          morningActivities: activitiesToText(formData.data.postAccident.dailyRoutine.morning),
          afternoonActivities: activitiesToText(formData.data.postAccident.dailyRoutine.afternoon),
          eveningActivities: activitiesToText(formData.data.postAccident.dailyRoutine.evening),
          nightActivities: activitiesToText(formData.data.postAccident.dailyRoutine.night)
        }
      }
    };
    
    // Map sleep schedule for pre-accident
    if (formData.data.preAccident.sleepSchedule) {
      const sleepSchedule = formData.data.preAccident.sleepSchedule;
      
      if (sleepSchedule.type === 'irregular') {
        contextData.preAccident.dailyRoutine.sleepSchedule = {
          type: 'irregular',
          irregularScheduleDetails: sleepSchedule.irregularScheduleDetails
        };
      } else {
        contextData.preAccident.dailyRoutine.sleepSchedule = {
          type: 'regular',
          wakeTime: sleepSchedule.regularSchedule?.wakeTime,
          bedTime: sleepSchedule.regularSchedule?.bedTime,
          sleepQuality: sleepSchedule.regularSchedule?.sleepQuality
        };
      }
    }
    
    // Map sleep schedule for post-accident
    if (formData.data.postAccident.sleepSchedule) {
      const sleepSchedule = formData.data.postAccident.sleepSchedule;
      
      if (sleepSchedule.type === 'irregular') {
        contextData.postAccident.dailyRoutine.sleepSchedule = {
          type: 'irregular',
          irregularScheduleDetails: sleepSchedule.irregularScheduleDetails
        };
      } else {
        contextData.postAccident.dailyRoutine.sleepSchedule = {
          type: 'regular',
          wakeTime: sleepSchedule.regularSchedule?.wakeTime,
          bedTime: sleepSchedule.regularSchedule?.bedTime,
          sleepQuality: sleepSchedule.regularSchedule?.sleepQuality
        };
      }
    }
    
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
