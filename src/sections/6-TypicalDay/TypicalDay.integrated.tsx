import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { TypicalDayFormData } from './types';
import { TypicalDayForm } from './components/TypicalDayForm';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAssessment } from '@/contexts/AssessmentContext';

// Define the schema
const activitySchema = z.object({
  specificTime: z.string().optional(),
  description: z.string().optional(),
  assistance: z.string().optional(),
  limitations: z.string().optional(),
});

const dailyRoutineSchema = z.object({
  earlyMorning: z.array(activitySchema).optional().default([]),
  morning: z.array(activitySchema).optional().default([]),
  afternoon: z.array(activitySchema).optional().default([]),
  evening: z.array(activitySchema).optional().default([]),
  night: z.array(activitySchema).optional().default([]),
});

const sleepScheduleSchema = z.object({
  wakeTime: z.string().optional(),
  bedTime: z.string().optional(),
  sleepQuality: z.string().optional(),
});

const typicalDayDataSchema = z.object({
  dailyRoutine: dailyRoutineSchema,
  sleepSchedule: sleepScheduleSchema.optional().default({}),
});

const typicalDaySchema = z.object({
  typicalDay: z.object({
    preAccident: typicalDayDataSchema.optional().default({
      dailyRoutine: {
        earlyMorning: [],
        morning: [],
        afternoon: [],
        evening: [],
        night: [],
      },
      sleepSchedule: {},
    }),
    postAccident: typicalDayDataSchema.optional().default({
      dailyRoutine: {
        earlyMorning: [],
        morning: [],
        afternoon: [],
        evening: [],
        night: [],
      },
      sleepSchedule: {},
    }),
  }),
});

const emptyRoutineData = {
  earlyMorning: [{ specificTime: '', description: '' }],
  morning: [{ specificTime: '', description: '' }],
  afternoon: [{ specificTime: '', description: '' }],
  evening: [{ specificTime: '', description: '' }],
  night: [{ specificTime: '', description: '' }],
};

const emptyPostRoutineData = {
  earlyMorning: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
  morning: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
  afternoon: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
  evening: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
  night: [{ specificTime: '', description: '', assistance: '', limitations: '' }],
};

const defaultValues: TypicalDayFormData = {
  typicalDay: {
    preAccident: {
      dailyRoutine: emptyRoutineData,
      sleepSchedule: {
        wakeTime: '',
        bedTime: '',
        sleepQuality: '',
      },
    },
    postAccident: {
      dailyRoutine: emptyPostRoutineData,
      sleepSchedule: {
        wakeTime: '',
        bedTime: '',
        sleepQuality: '',
      },
    },
  },
};

const TypicalDayIntegrated: React.FC = () => {
  const { data, updateSection } = useAssessment();
  const contextData = data.typicalDay || {};
  const [dataLoaded, setDataLoaded] = useState(false);

  // Map context data to form structure with error handling
  const mapContextDataToForm = (): TypicalDayFormData => {
    try {
      // If no context data, return defaults
      if (!contextData || Object.keys(contextData).length === 0) {
        return defaultValues;
      }

      console.log("Mapping typical day data from context:", contextData);
      
      // Create a deep copy of default values to populate
      const formData = JSON.parse(JSON.stringify(defaultValues));
      
      // Helper function to convert text-based activities to structured activities
      const parseActivitiesFromText = (text: string, includeAssistance = false): any[] => {
        if (!text) return [];
        
        const activities = text.split('\n').filter(line => line.trim());
        return activities.map(activity => {
          const timePart = activity.match(/^(\d{1,2}:\d{2}(?:\s*[AP]M)?)/i);
          const time = timePart ? timePart[1] : '';
          const description = timePart ? activity.substring(timePart[0].length).trim() : activity.trim();
          
          if (includeAssistance) {
            return {
              specificTime: time,
              description: description,
              assistance: '',
              limitations: ''
            };
          } else {
            return {
              specificTime: time,
              description: description
            };
          }
        });
      };
      
      // Map pre-accident routine if available
      if (contextData.preAccident && contextData.preAccident.dailyRoutine) {
        try {
          const preRoutine = contextData.preAccident.dailyRoutine;
          
          // Map each time period
          if (preRoutine.morningActivities) {
            formData.typicalDay.preAccident.dailyRoutine.earlyMorning = 
              parseActivitiesFromText(preRoutine.morningActivities);
          }
          
          if (preRoutine.afternoonActivities) {
            formData.typicalDay.preAccident.dailyRoutine.afternoon = 
              parseActivitiesFromText(preRoutine.afternoonActivities);
          }
          
          if (preRoutine.eveningActivities) {
            formData.typicalDay.preAccident.dailyRoutine.evening = 
              parseActivitiesFromText(preRoutine.eveningActivities);
          }
          
          // Map sleep schedule
          if (preRoutine.sleepSchedule) {
            if (preRoutine.sleepSchedule.wakeTime) {
              formData.typicalDay.preAccident.sleepSchedule.wakeTime = preRoutine.sleepSchedule.wakeTime;
            }
            
            if (preRoutine.sleepSchedule.bedTime) {
              formData.typicalDay.preAccident.sleepSchedule.bedTime = preRoutine.sleepSchedule.bedTime;
            }
            
            if (preRoutine.sleepSchedule.sleepQuality) {
              formData.typicalDay.preAccident.sleepSchedule.sleepQuality = preRoutine.sleepSchedule.sleepQuality;
            }
          }
        } catch (error) {
          console.error("Error mapping pre-accident routine:", error);
        }
      }
      
      // Map post-accident routine if available
      if (contextData.postAccident && contextData.postAccident.dailyRoutine) {
        try {
          const postRoutine = contextData.postAccident.dailyRoutine;
          
          // Map each time period with assistance and limitations
          if (postRoutine.morningActivities) {
            formData.typicalDay.postAccident.dailyRoutine.earlyMorning = 
              parseActivitiesFromText(postRoutine.morningActivities, true);
          }
          
          if (postRoutine.afternoonActivities) {
            formData.typicalDay.postAccident.dailyRoutine.afternoon = 
              parseActivitiesFromText(postRoutine.afternoonActivities, true);
          }
          
          if (postRoutine.eveningActivities) {
            formData.typicalDay.postAccident.dailyRoutine.evening = 
              parseActivitiesFromText(postRoutine.eveningActivities, true);
          }
          
          // Map assistance and limitations if available
          if (postRoutine.assistanceRequirements) {
            const activities = formData.typicalDay.postAccident.dailyRoutine;
            Object.keys(activities).forEach(timeOfDay => {
              activities[timeOfDay].forEach(activity => {
                if (activity.description && postRoutine.assistanceRequirements) {
                  // Try to find relevant assistance for this activity
                  activity.assistance = postRoutine.assistanceRequirements;
                }
              });
            });
          }
          
          if (postRoutine.limitations) {
            const activities = formData.typicalDay.postAccident.dailyRoutine;
            Object.keys(activities).forEach(timeOfDay => {
              activities[timeOfDay].forEach(activity => {
                if (activity.description && postRoutine.limitations) {
                  // Try to find relevant limitations for this activity
                  activity.limitations = postRoutine.limitations;
                }
              });
            });
          }
          
          // Map sleep schedule
          if (postRoutine.sleepSchedule) {
            if (postRoutine.sleepSchedule.wakeTime) {
              formData.typicalDay.postAccident.sleepSchedule.wakeTime = postRoutine.sleepSchedule.wakeTime;
            }
            
            if (postRoutine.sleepSchedule.bedTime) {
              formData.typicalDay.postAccident.sleepSchedule.bedTime = postRoutine.sleepSchedule.bedTime;
            }
            
            if (postRoutine.sleepSchedule.sleepQuality) {
              formData.typicalDay.postAccident.sleepSchedule.sleepQuality = postRoutine.sleepSchedule.sleepQuality;
            }
          }
        } catch (error) {
          console.error("Error mapping post-accident routine:", error);
        }
      }
      
      return formData;
    } catch (error) {
      console.error("Error in mapContextDataToForm:", error);
      return defaultValues;
    }
  };

  // Initialize form with mapped context data if available
  const methods = useForm<TypicalDayFormData>({
    resolver: zodResolver(typicalDaySchema),
    defaultValues: mapContextDataToForm(),
    mode: 'onChange',
  });

  // Update form when context data changes
  useEffect(() => {
    try {
      if (contextData && Object.keys(contextData).length > 0) {
        console.log("Typical day context data changed:", contextData);
        const formData = mapContextDataToForm();
        methods.reset(formData);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error updating form from context:", error);
    }
  }, [contextData]);

  // Use the form persistence hook to keep form state
  useFormPersistence(methods, 'typicalDay');
  
  // Convert structured activities to text for the context
  const convertActivitiesToText = (activities) => {
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return '';
    }
    
    return activities
      .filter(activity => activity.specificTime || activity.description)
      .map(activity => {
        if (activity.specificTime && activity.description) {
          return `${activity.specificTime} ${activity.description}`;
        } else {
          return activity.specificTime || activity.description;
        }
      })
      .join('\n');
  };
  
  // Handle form submission
  const onSubmit = (formData: TypicalDayFormData) => {
    try {
      // Convert form data to the structure expected by the context
      const typicalDayData = {
        preAccident: {
          dailyRoutine: {
            morningActivities: convertActivitiesToText([
              ...formData.typicalDay.preAccident.dailyRoutine.earlyMorning,
              ...formData.typicalDay.preAccident.dailyRoutine.morning
            ]),
            afternoonActivities: convertActivitiesToText(
              formData.typicalDay.preAccident.dailyRoutine.afternoon
            ),
            eveningActivities: convertActivitiesToText([
              ...formData.typicalDay.preAccident.dailyRoutine.evening,
              ...formData.typicalDay.preAccident.dailyRoutine.night
            ]),
            sleepSchedule: {
              wakeTime: formData.typicalDay.preAccident.sleepSchedule.wakeTime,
              bedTime: formData.typicalDay.preAccident.sleepSchedule.bedTime,
              sleepQuality: formData.typicalDay.preAccident.sleepSchedule.sleepQuality
            }
          }
        },
        postAccident: {
          dailyRoutine: {
            morningActivities: convertActivitiesToText([
              ...formData.typicalDay.postAccident.dailyRoutine.earlyMorning,
              ...formData.typicalDay.postAccident.dailyRoutine.morning
            ]),
            afternoonActivities: convertActivitiesToText(
              formData.typicalDay.postAccident.dailyRoutine.afternoon
            ),
            eveningActivities: convertActivitiesToText([
              ...formData.typicalDay.postAccident.dailyRoutine.evening,
              ...formData.typicalDay.postAccident.dailyRoutine.night
            ]),
            sleepSchedule: {
              wakeTime: formData.typicalDay.postAccident.sleepSchedule.wakeTime,
              bedTime: formData.typicalDay.postAccident.sleepSchedule.bedTime,
              sleepQuality: formData.typicalDay.postAccident.sleepSchedule.sleepQuality
            },
            assistanceRequirements: extractUniqueValues([
              ...formData.typicalDay.postAccident.dailyRoutine.earlyMorning,
              ...formData.typicalDay.postAccident.dailyRoutine.morning,
              ...formData.typicalDay.postAccident.dailyRoutine.afternoon,
              ...formData.typicalDay.postAccident.dailyRoutine.evening,
              ...formData.typicalDay.postAccident.dailyRoutine.night
            ], 'assistance'),
            limitations: extractUniqueValues([
              ...formData.typicalDay.postAccident.dailyRoutine.earlyMorning,
              ...formData.typicalDay.postAccident.dailyRoutine.morning,
              ...formData.typicalDay.postAccident.dailyRoutine.afternoon,
              ...formData.typicalDay.postAccident.dailyRoutine.evening,
              ...formData.typicalDay.postAccident.dailyRoutine.night
            ], 'limitations')
          }
        }
      };
      
      // Update the context
      updateSection('typicalDay', typicalDayData);
    } catch (error) {
      console.error("Error preparing data for context update:", error);
    }
  };
  
  // Helper function to extract unique values from an array of objects
  const extractUniqueValues = (items, field) => {
    const values = items
      .filter(item => item && item[field])
      .map(item => item[field]);
    
    return [...new Set(values)].join('\n');
  };

  return (
    <>
      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Daily routine information has been pre-populated from previous assessments. You can review and modify the data as needed.
          </AlertDescription>
        </Alert>
      )}
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <TypicalDayForm />
        </form>
      </FormProvider>
    </>
  );
};

export { TypicalDayIntegrated };
export default TypicalDayIntegrated;