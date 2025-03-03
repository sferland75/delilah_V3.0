/**
 * Typical Day Mapper Service Tests
 * 
 * Tests for the bidirectional mapping functionality between
 * context data and form data structures for the Typical Day section.
 */

import { 
  mapContextToForm, 
  mapFormToContext,
  convertTextToActivities,
  convertActivitiesToText,
  exportTypicalDayToJson,
  importTypicalDayFromJson
} from '../typicalDayMapper';

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Typical Day Mapper Service', () => {
  // Define default mock data structures
  const mockInitialFormState = {
    data: {
      sleepSchedule: {
        bedtime: '',
        waketime: '',
        sleepQuality: '',
        factors: [],
        notes: ''
      },
      morningRoutine: '',
      afternoonRoutine: '',
      eveningRoutine: '',
      activities: []
    }
  };

  const mockContextData = {
    dailySchedule: {
      sleep: {
        bedtime: '22:30',
        waketime: '07:00',
        averageHours: 8.5,
        quality: 'Fair',
        disturbances: [
          'Wakes 1-2 times per night',
          'Occasional difficulty falling asleep'
        ],
        factors: [
          'Screen time before bed',
          'Caffeine consumption'
        ],
        adaptations: 'Uses white noise machine'
      },
      morning: {
        routine: [
          {
            time: '07:00 - 07:30',
            activity: 'Personal care and hygiene',
            notes: 'Requires extra time for dressing'
          },
          {
            time: '07:30 - 08:00',
            activity: 'Breakfast',
            notes: 'Usually cereal or toast'
          },
          {
            time: '08:00 - 09:00',
            activity: 'News and email review',
            notes: 'On tablet'
          }
        ],
        challenges: 'Morning stiffness affecting mobility',
        assistance: 'Independent but slower pace'
      },
      afternoon: {
        routine: [
          {
            time: '12:00 - 13:00',
            activity: 'Lunch preparation and meal',
            notes: 'Simple meals'
          },
          {
            time: '13:00 - 15:00',
            activity: 'Rest period',
            notes: 'Usually lies down'
          },
          {
            time: '15:00 - 16:30',
            activity: 'Light housework or errands',
            notes: 'Avoids heavy lifting'
          }
        ],
        challenges: 'Fatigue increases throughout day',
        assistance: 'Occasional help with errands'
      },
      evening: {
        routine: [
          {
            time: '17:30 - 18:30',
            activity: 'Dinner preparation and meal',
            notes: 'Often meal prepped earlier'
          },
          {
            time: '18:30 - 20:30',
            activity: 'Television or reading',
            notes: 'Sitting with proper support'
          },
          {
            time: '20:30 - 22:30',
            activity: 'Evening routine and preparation for bed',
            notes: 'Takes medication at 21:00'
          }
        ],
        challenges: 'Increased pain by evening',
        assistance: 'Sometimes needs help with meal preparation'
      },
      weekendVariations: 'More social activities, longer rest periods',
      seasonalVariations: 'More outdoor activities in summer months'
    }
  };

  // Test mapping from context to form
  describe('mapContextToForm', () => {
    it('should correctly map context data to form structure', () => {
      const { formData, hasData } = mapContextToForm(mockContextData, mockInitialFormState);
      
      // Check hasData flag
      expect(hasData).toBe(true);
      
      // Check sleep schedule mapping
      expect(formData.data.sleepSchedule.bedtime).toBe('22:30');
      expect(formData.data.sleepSchedule.waketime).toBe('07:00');
      expect(formData.data.sleepSchedule.sleepQuality).toBe('Fair');
      expect(formData.data.sleepSchedule.factors).toContain('Screen time before bed');
      expect(formData.data.sleepSchedule.factors).toContain('Caffeine consumption');
      expect(formData.data.sleepSchedule.notes).toContain('Wakes 1-2 times per night');
      expect(formData.data.sleepSchedule.notes).toContain('Uses white noise machine');
      
      // Check routine mappings
      // The text based routines should contain the activities
      expect(formData.data.morningRoutine).toContain('07:00 - 07:30: Personal care and hygiene');
      expect(formData.data.morningRoutine).toContain('Requires extra time for dressing');
      expect(formData.data.morningRoutine).toContain('Morning stiffness affecting mobility');
      
      expect(formData.data.afternoonRoutine).toContain('12:00 - 13:00: Lunch preparation and meal');
      expect(formData.data.afternoonRoutine).toContain('13:00 - 15:00: Rest period');
      expect(formData.data.afternoonRoutine).toContain('Fatigue increases throughout day');
      
      expect(formData.data.eveningRoutine).toContain('17:30 - 18:30: Dinner preparation and meal');
      expect(formData.data.eveningRoutine).toContain('20:30 - 22:30: Evening routine and preparation for bed');
      expect(formData.data.eveningRoutine).toContain('Increased pain by evening');
      
      // Check activities array mapping (structured activities)
      expect(formData.data.activities.length).toBeGreaterThan(0);
      
      // Verify morning activities
      const morningActivities = formData.data.activities.filter(a => a.period === 'morning');
      expect(morningActivities.length).toBe(3);
      expect(morningActivities[0].time).toBe('07:00 - 07:30');
      expect(morningActivities[0].activity).toBe('Personal care and hygiene');
      expect(morningActivities[0].notes).toBe('Requires extra time for dressing');
      
      // Verify afternoon activities
      const afternoonActivities = formData.data.activities.filter(a => a.period === 'afternoon');
      expect(afternoonActivities.length).toBe(3);
      expect(afternoonActivities[1].time).toBe('13:00 - 15:00');
      expect(afternoonActivities[1].activity).toBe('Rest period');
      
      // Verify evening activities
      const eveningActivities = formData.data.activities.filter(a => a.period === 'evening');
      expect(eveningActivities.length).toBe(3);
      expect(eveningActivities[2].time).toBe('20:30 - 22:30');
      expect(eveningActivities[2].activity).toBe('Evening routine and preparation for bed');
    });
    
    it('should return empty form data when context data is empty', () => {
      const { formData, hasData } = mapContextToForm({}, mockInitialFormState);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(mockInitialFormState);
    });
    
    it('should handle missing sections gracefully', () => {
      const partialContextData = {
        dailySchedule: {
          sleep: {
            bedtime: '23:00',
            waketime: '06:30',
            quality: 'Good'
          }
          // Missing other sections
        }
      };
      
      const { formData, hasData } = mapContextToForm(partialContextData, mockInitialFormState);
      
      expect(hasData).toBe(true);
      expect(formData.data.sleepSchedule.bedtime).toBe('23:00');
      expect(formData.data.sleepSchedule.waketime).toBe('06:30');
      expect(formData.data.sleepSchedule.sleepQuality).toBe('Good');
      
      // Other sections should be initialized with defaults
      expect(formData.data.morningRoutine).toBe('');
      expect(formData.data.activities).toEqual([]);
    });
    
    it('should handle malformed data without crashing', () => {
      const malformedData = {
        dailySchedule: {
          sleep: "Not an object" // Incorrect type
        }
      };
      
      // Should not throw an error
      const { formData, hasData } = mapContextToForm(malformedData, mockInitialFormState);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(mockInitialFormState);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test mapping from form to context
  describe('mapFormToContext', () => {
    it('should correctly map form data to context structure', () => {
      const formData = {
        data: {
          sleepSchedule: {
            bedtime: '23:00',
            waketime: '06:00',
            sleepQuality: 'Good',
            factors: ['Stress', 'Room temperature'],
            notes: 'Sleeps through the night mostly. Uses sleep mask.'
          },
          morningRoutine: 
            "06:00 - 06:30: Wake up and personal care\n" +
            "06:30 - 07:00: Breakfast and medication\n" +
            "07:00 - 08:00: Light exercise and stretching\n" +
            "Challenge: Needs more time for stretching due to stiffness",
          afternoonRoutine:
            "12:00 - 13:00: Lunch\n" +
            "13:00 - 14:00: Household tasks\n" +
            "14:00 - 16:00: Computer work and appointments\n" +
            "Challenge: Fatigue by mid-afternoon",
          eveningRoutine:
            "18:00 - 19:00: Dinner\n" +
            "19:00 - 21:00: Family time and TV\n" +
            "21:00 - 23:00: Wind down routine and preparation for bed\n" +
            "Note: Takes medications at 10pm",
          activities: [
            {
              period: 'morning',
              time: '06:00 - 06:30',
              activity: 'Wake up and personal care',
              notes: 'Needs extra time'
            },
            {
              period: 'morning',
              time: '06:30 - 07:00',
              activity: 'Breakfast and medication',
              notes: 'Takes pain medication with food'
            },
            {
              period: 'morning',
              time: '07:00 - 08:00',
              activity: 'Light exercise and stretching',
              notes: 'Follows PT program'
            },
            {
              period: 'afternoon',
              time: '12:00 - 13:00',
              activity: 'Lunch',
              notes: 'Usually a light meal'
            },
            {
              period: 'afternoon',
              time: '13:00 - 14:00',
              activity: 'Household tasks',
              notes: 'Paces activities'
            },
            {
              period: 'afternoon',
              time: '14:00 - 16:00',
              activity: 'Computer work and appointments',
              notes: 'Uses ergonomic setup'
            },
            {
              period: 'evening',
              time: '18:00 - 19:00',
              activity: 'Dinner',
              notes: 'Family meal'
            },
            {
              period: 'evening',
              time: '19:00 - 21:00',
              activity: 'Family time and TV',
              notes: 'Relaxes on couch'
            },
            {
              period: 'evening',
              time: '21:00 - 23:00',
              activity: 'Wind down routine and preparation for bed',
              notes: 'Takes medications at 10pm'
            }
          ]
        }
      };
      
      const contextData = mapFormToContext(formData);
      
      // Check sleep mapping
      expect(contextData.dailySchedule.sleep.bedtime).toBe('23:00');
      expect(contextData.dailySchedule.sleep.waketime).toBe('06:00');
      expect(contextData.dailySchedule.sleep.quality).toBe('Good');
      expect(contextData.dailySchedule.sleep.factors).toContain('Stress');
      expect(contextData.dailySchedule.sleep.factors).toContain('Room temperature');
      expect(contextData.dailySchedule.sleep.adaptations).toContain('Uses sleep mask');
      
      // Check morning routine mapping
      expect(contextData.dailySchedule.morning.routine.length).toBe(3);
      expect(contextData.dailySchedule.morning.routine[0].time).toBe('06:00 - 06:30');
      expect(contextData.dailySchedule.morning.routine[0].activity).toBe('Wake up and personal care');
      expect(contextData.dailySchedule.morning.routine[0].notes).toBe('Needs extra time');
      expect(contextData.dailySchedule.morning.challenges).toBe('Needs more time for stretching due to stiffness');
      
      // Check afternoon routine mapping
      expect(contextData.dailySchedule.afternoon.routine.length).toBe(3);
      expect(contextData.dailySchedule.afternoon.routine[1].time).toBe('13:00 - 14:00');
      expect(contextData.dailySchedule.afternoon.routine[1].activity).toBe('Household tasks');
      expect(contextData.dailySchedule.afternoon.challenges).toBe('Fatigue by mid-afternoon');
      
      // Check evening routine mapping
      expect(contextData.dailySchedule.evening.routine.length).toBe(3);
      expect(contextData.dailySchedule.evening.routine[2].time).toBe('21:00 - 23:00');
      expect(contextData.dailySchedule.evening.routine[2].activity).toBe('Wind down routine and preparation for bed');
      expect(contextData.dailySchedule.evening.routine[2].notes).toBe('Takes medications at 10pm');
    });
    
    it('should preserve existing context data not covered by the form', () => {
      const existingContextData = {
        dailySchedule: {
          weekendVariations: 'More outdoor activities',
          seasonalVariations: 'More swimming in summer',
          adaptations: 'Uses adaptive equipment for meals'
        },
        customField: 'This should be preserved'
      };
      
      const formData = {
        data: {
          sleepSchedule: {
            bedtime: '22:00',
            waketime: '07:00',
            sleepQuality: '',
            factors: [],
            notes: ''
          },
          morningRoutine: '',
          afternoonRoutine: '',
          eveningRoutine: '',
          activities: []
        }
      };
      
      const contextData = mapFormToContext(formData, existingContextData);
      
      // Check that existing data is preserved
      expect(contextData.dailySchedule.weekendVariations).toBe('More outdoor activities');
      expect(contextData.dailySchedule.seasonalVariations).toBe('More swimming in summer');
      expect(contextData.dailySchedule.adaptations).toBe('Uses adaptive equipment for meals');
      expect(contextData.customField).toBe('This should be preserved');
      
      // Check that new data is added
      expect(contextData.dailySchedule.sleep.bedtime).toBe('22:00');
      expect(contextData.dailySchedule.sleep.waketime).toBe('07:00');
    });
    
    it('should handle empty form data gracefully', () => {
      const emptyFormData = {
        data: {
          sleepSchedule: {
            bedtime: '',
            waketime: '',
            sleepQuality: '',
            factors: [],
            notes: ''
          },
          morningRoutine: '',
          afternoonRoutine: '',
          eveningRoutine: '',
          activities: []
        }
      };
      
      const existingContextData = { someField: 'value' };
      const contextData = mapFormToContext(emptyFormData, existingContextData);
      
      // Should still return a properly structured object
      expect(contextData.dailySchedule).toBeDefined();
      expect(contextData.dailySchedule.sleep).toBeDefined();
      expect(contextData.dailySchedule.morning).toBeDefined();
      expect(contextData.someField).toBe('value');
    });
    
    it('should handle malformed form data without crashing', () => {
      const malformedFormData = {
        data: {
          // Missing required fields
        }
      };
      
      // Should not throw an error
      const contextData = mapFormToContext(malformedFormData);
      
      // Should return a minimal valid object
      expect(contextData.dailySchedule).toBeDefined();
      expect(contextData.dailySchedule.sleep).toBeDefined();
      expect(contextData.dailySchedule.morning).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test text <-> activities conversion utilities
  describe('Text to Activities conversion', () => {
    it('should convert formatted text to activity objects', () => {
      const textRoutine = 
        "07:00 - 07:30: Morning hygiene\n" +
        "07:30 - 08:00: Breakfast\n" +
        "08:00 - 09:00: Reading newspaper\n" +
        "Challenge: Difficulty with morning routine\n" +
        "Note: Requires extra time";
      
      const activities = convertTextToActivities(textRoutine, 'morning');
      
      expect(activities.length).toBe(3);
      expect(activities[0].period).toBe('morning');
      expect(activities[0].time).toBe('07:00 - 07:30');
      expect(activities[0].activity).toBe('Morning hygiene');
      
      expect(activities[1].time).toBe('07:30 - 08:00');
      expect(activities[1].activity).toBe('Breakfast');
      
      expect(activities[2].time).toBe('08:00 - 09:00');
      expect(activities[2].activity).toBe('Reading newspaper');
      
      // Challenges and notes are not converted to activities
      const hasChallenge = activities.some(a => a.activity.includes('Challenge:'));
      expect(hasChallenge).toBe(false);
    });
    
    it('should handle various time formats', () => {
      const textWithVariousFormats = 
        "7:00-7:30: Activity 1\n" +
        "7:30 to 8:00: Activity 2\n" +
        "8:00 - 9:00: Activity 3\n" +
        "9am-10am: Activity 4\n" +
        "10:00: Activity 5";
      
      const activities = convertTextToActivities(textWithVariousFormats, 'morning');
      
      expect(activities.length).toBe(5);
      expect(activities[0].time).toBe('7:00-7:30');
      expect(activities[1].time).toBe('7:30 to 8:00');
      expect(activities[2].time).toBe('8:00 - 9:00');
      expect(activities[3].time).toBe('9am-10am');
      expect(activities[4].time).toBe('10:00');
    });
    
    it('should handle text without properly formatted times', () => {
      const textWithoutTimes = 
        "First I do morning hygiene\n" +
        "Then I have breakfast\n" +
        "After that I read the newspaper";
      
      const activities = convertTextToActivities(textWithoutTimes, 'morning');
      
      // Should still create activities but with empty time fields
      expect(activities.length).toBe(3);
      expect(activities[0].time).toBe('');
      expect(activities[0].activity).toBe('First I do morning hygiene');
      
      expect(activities[1].time).toBe('');
      expect(activities[1].activity).toBe('Then I have breakfast');
    });
    
    it('should handle empty or malformed text', () => {
      const emptyText = '';
      const activities = convertTextToActivities(emptyText, 'morning');
      
      expect(activities).toEqual([]);
      
      const malformedText = null;
      const activitiesFromMalformed = convertTextToActivities(malformedText, 'morning');
      
      expect(activitiesFromMalformed).toEqual([]);
    });
  });
  
  describe('Activities to Text conversion', () => {
    it('should convert activity objects to formatted text', () => {
      const activities = [
        {
          period: 'morning',
          time: '07:00 - 07:30',
          activity: 'Morning hygiene',
          notes: 'Takes longer than before'
        },
        {
          period: 'morning',
          time: '07:30 - 08:00',
          activity: 'Breakfast',
          notes: 'With family'
        },
        {
          period: 'morning',
          time: '08:00 - 09:00',
          activity: 'Reading newspaper',
          notes: ''
        }
      ];
      
      const additionalInfo = {
        challenges: 'Difficulty with morning routine',
        assistance: 'Independent but slower'
      };
      
      const textRoutine = convertActivitiesToText(activities, 'morning', additionalInfo);
      
      expect(textRoutine).toContain('07:00 - 07:30: Morning hygiene');
      expect(textRoutine).toContain('Takes longer than before');
      expect(textRoutine).toContain('07:30 - 08:00: Breakfast');
      expect(textRoutine).toContain('With family');
      expect(textRoutine).toContain('08:00 - 09:00: Reading newspaper');
      expect(textRoutine).toContain('Challenge: Difficulty with morning routine');
      expect(textRoutine).toContain('Assistance: Independent but slower');
    });
    
    it('should handle activities without notes', () => {
      const activities = [
        {
          period: 'afternoon',
          time: '12:00 - 13:00',
          activity: 'Lunch',
          notes: ''
        },
        {
          period: 'afternoon',
          time: '13:00 - 15:00',
          activity: 'Rest',
          notes: ''
        }
      ];
      
      const textRoutine = convertActivitiesToText(activities, 'afternoon');
      
      expect(textRoutine).toContain('12:00 - 13:00: Lunch');
      expect(textRoutine).toContain('13:00 - 15:00: Rest');
      // Should not contain empty notes lines
      expect(textRoutine.match(/\n\n/g)).toBeFalsy();
    });
    
    it('should handle empty activities array', () => {
      const activities = [];
      const textRoutine = convertActivitiesToText(activities, 'morning');
      
      expect(textRoutine).toBe('');
    });
    
    it('should filter activities by period', () => {
      const activities = [
        {
          period: 'morning',
          time: '07:00 - 08:00',
          activity: 'Breakfast',
          notes: ''
        },
        {
          period: 'afternoon',
          time: '12:00 - 13:00',
          activity: 'Lunch',
          notes: ''
        },
        {
          period: 'evening',
          time: '18:00 - 19:00',
          activity: 'Dinner',
          notes: ''
        }
      ];
      
      const morningRoutine = convertActivitiesToText(activities, 'morning');
      expect(morningRoutine).toContain('07:00 - 08:00: Breakfast');
      expect(morningRoutine).not.toContain('12:00 - 13:00: Lunch');
      expect(morningRoutine).not.toContain('18:00 - 19:00: Dinner');
      
      const afternoonRoutine = convertActivitiesToText(activities, 'afternoon');
      expect(afternoonRoutine).not.toContain('07:00 - 08:00: Breakfast');
      expect(afternoonRoutine).toContain('12:00 - 13:00: Lunch');
      expect(afternoonRoutine).not.toContain('18:00 - 19:00: Dinner');
    });
  });
  
  // Test JSON import/export functionality
  describe('JSON import/export', () => {
    it('should properly export context data to JSON', () => {
      const jsonString = exportTypicalDayToJson(mockContextData);
      
      // Should be a valid JSON string
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      // Should contain the original data
      const parsedData = JSON.parse(jsonString);
      expect(parsedData.dailySchedule.sleep.bedtime).toBe('22:30');
      expect(parsedData.dailySchedule.morning.routine[0].activity).toBe('Personal care and hygiene');
    });
    
    it('should properly import JSON to context data', () => {
      const jsonString = JSON.stringify(mockContextData);
      const importedData = importTypicalDayFromJson(jsonString);
      
      // Should match the original data
      expect(importedData).toEqual(mockContextData);
    });
    
    it('should handle invalid JSON during import', () => {
      const invalidJsonString = '{ this is not valid JSON }';
      
      // Should return null for invalid JSON
      const importedData = importTypicalDayFromJson(invalidJsonString);
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
      expect(mappedContextData.dailySchedule.sleep.bedtime).toBe(
        mockContextData.dailySchedule.sleep.bedtime
      );
      
      expect(mappedContextData.dailySchedule.sleep.waketime).toBe(
        mockContextData.dailySchedule.sleep.waketime
      );
      
      // Check morning routine for data preservation
      expect(mappedContextData.dailySchedule.morning.routine.length).toBe(
        mockContextData.dailySchedule.morning.routine.length
      );
      
      expect(mappedContextData.dailySchedule.morning.routine[0].time).toBe(
        mockContextData.dailySchedule.morning.routine[0].time
      );
      
      expect(mappedContextData.dailySchedule.morning.routine[0].activity).toBe(
        mockContextData.dailySchedule.morning.routine[0].activity
      );
      
      // Check afternoon routine for data preservation
      expect(mappedContextData.dailySchedule.afternoon.routine.length).toBe(
        mockContextData.dailySchedule.afternoon.routine.length
      );
      
      // Check evening routine for data preservation
      expect(mappedContextData.dailySchedule.evening.routine.length).toBe(
        mockContextData.dailySchedule.evening.routine.length
      );
    });
  });
});
