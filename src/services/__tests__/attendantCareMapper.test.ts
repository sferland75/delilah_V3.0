/**
 * Attendant Care Mapper Service Tests
 * 
 * Tests for the bidirectional mapping functionality between
 * context data and form data structures for the Attendant Care section.
 */

import { 
  mapContextToForm, 
  mapFormToContext,
  estimateCareMinutes,
  exportAttendantCareToJson,
  importAttendantCareFromJson
} from '../attendantCareMapper';

// Mock console methods to avoid cluttering test output
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Attendant Care Mapper Service', () => {
  // Define default mock data structures
  const mockInitialFormState = {
    data: {
      level1Care: {
        activities: []
      },
      level2Care: {
        activities: []
      },
      level3Care: {
        activities: []
      },
      recommendedHours: {
        level1Total: 0,
        level2Total: 0,
        level3Total: 0,
        grandTotal: 0,
        notes: ''
      },
      careProviders: []
    }
  };

  const mockContextData = {
    attendantCare: {
      level1Care: [
        {
          activity: 'Meal preparation',
          frequency: 'Daily, 3 times per day',
          duration: '20 minutes per meal',
          weeklyMinutes: 420,
          details: 'Simple meal preparation including breakfast, lunch, and dinner. Client requires meals to be prepared and plated.',
          assistance: 'Meal selection, preparation, and plating',
          recommendations: 'Prepare extra portions for leftovers when possible'
        },
        {
          activity: 'Light housekeeping',
          frequency: '3 times per week',
          duration: '30 minutes per session',
          weeklyMinutes: 90,
          details: 'Dusting, sweeping, and general tidying of main living areas',
          assistance: 'Setup of cleaning supplies and completion of tasks',
          recommendations: 'Focus on high-traffic areas and frequently used surfaces'
        },
        {
          activity: 'Laundry',
          frequency: 'Twice weekly',
          duration: '45 minutes per session',
          weeklyMinutes: 90,
          details: 'Washing, drying, folding, and putting away clothing and linens',
          assistance: 'All aspects of laundry tasks',
          recommendations: 'Sort clothing in advance to streamline process'
        }
      ],
      level2Care: [
        {
          activity: 'Bathing',
          frequency: 'Daily',
          duration: '30 minutes per session',
          weeklyMinutes: 210,
          details: 'Full body bathing in walk-in shower with shower chair',
          assistance: 'Setup, direct assistance with washing difficult-to-reach areas, monitoring for safety',
          recommendations: 'Schedule for mornings when energy levels are higher'
        },
        {
          activity: 'Dressing',
          frequency: 'Twice daily',
          duration: '15 minutes per session',
          weeklyMinutes: 210,
          details: 'Morning dressing and evening preparation for bed',
          assistance: 'Help with lower body dressing, fasteners, and footwear',
          recommendations: 'Lay out clothing in advance for efficiency'
        },
        {
          activity: 'Toileting',
          frequency: '4-6 times daily',
          duration: '10 minutes per session',
          weeklyMinutes: 350,
          details: 'Assistance with toileting throughout the day',
          assistance: 'Transfer to/from toilet, adjustment of clothing, hygiene assistance',
          recommendations: 'Ensure grab bars and toilet riser are properly installed'
        },
        {
          activity: 'Transfers',
          frequency: '8-10 times daily',
          duration: '5 minutes per transfer',
          weeklyMinutes: 315,
          details: 'Bed to chair, chair to toilet, etc.',
          assistance: 'Standby or minimal physical assistance for safety',
          recommendations: 'Ensure clear pathways and properly positioned furniture'
        }
      ],
      level3Care: [
        {
          activity: 'Medication management',
          frequency: '3 times daily',
          duration: '5 minutes per session',
          weeklyMinutes: 105,
          details: 'Supervision and assistance with medication administration',
          assistance: 'Reminder, preparation, and documentation of medication intake',
          recommendations: 'Use pill organizer and medication log'
        },
        {
          activity: 'Medical appointments',
          frequency: 'Average 2 per week',
          duration: '120 minutes per appointment',
          weeklyMinutes: 240,
          details: 'Transportation to/from and attendance at medical appointments',
          assistance: 'Transportation, physical assistance, and information gathering',
          recommendations: 'Schedule appointments on same day when possible to minimize trips'
        },
        {
          activity: 'Exercise program',
          frequency: 'Daily',
          duration: '20 minutes per session',
          weeklyMinutes: 140,
          details: 'Assistance with prescribed home exercise program',
          assistance: 'Setup, demonstration, monitoring, and encouragement',
          recommendations: 'Follow therapist's detailed exercise plan'
        }
      ],
      careRecommendations: {
        level1Weekly: 600,
        level2Weekly: 1085,
        level3Weekly: 485,
        totalWeekly: 2170,
        justification: 'Client requires significant assistance with personal care tasks due to limited mobility and reduced strength following stroke. Support with home management tasks is essential to maintain safe living environment. Medication management and supervision for therapeutic activities are critical for recovery and health maintenance.',
        additionalNotes: 'Care needs are expected to decrease over next 3-6 months as client progresses with rehabilitation.'
      },
      currentProviders: [
        {
          name: 'ABC Home Health Agency',
          type: 'Professional caregiving agency',
          schedule: 'Daily, 4 hours in morning and 2 hours in evening',
          services: 'All personal care and home management tasks',
          contactInfo: 'Jane Smith, Care Coordinator - (555) 123-4567',
          notes: 'Providing care since hospital discharge 3 months ago'
        },
        {
          name: 'John Doe',
          type: 'Family member (son)',
          schedule: 'Weekends and emergency backup',
          services: 'Transportation, shopping, social support',
          contactInfo: '(555) 987-6543',
          notes: 'Lives nearby and provides regular assistance'
        }
      ]
    }
  };

  // Test mapping from context to form
  describe('mapContextToForm', () => {
    it('should correctly map context data to form structure', () => {
      const { formData, hasData } = mapContextToForm(mockContextData, mockInitialFormState);
      
      // Check hasData flag
      expect(hasData).toBe(true);
      
      // Check Level 1 Care mapping
      expect(formData.data.level1Care.activities.length).toBe(3);
      
      const mealPrep = formData.data.level1Care.activities.find(act => act.name === 'Meal preparation');
      expect(mealPrep).toBeDefined();
      expect(mealPrep.frequency).toBe('Daily, 3 times per day');
      expect(mealPrep.duration).toBe('20 minutes per meal');
      expect(mealPrep.weeklyMinutes).toBe(420);
      expect(mealPrep.details).toContain('Simple meal preparation including breakfast');
      
      const housekeeping = formData.data.level1Care.activities.find(act => act.name === 'Light housekeeping');
      expect(housekeeping).toBeDefined();
      expect(housekeeping.frequency).toBe('3 times per week');
      expect(housekeeping.weeklyMinutes).toBe(90);
      
      // Check Level 2 Care mapping
      expect(formData.data.level2Care.activities.length).toBe(4);
      
      const bathing = formData.data.level2Care.activities.find(act => act.name === 'Bathing');
      expect(bathing).toBeDefined();
      expect(bathing.frequency).toBe('Daily');
      expect(bathing.duration).toBe('30 minutes per session');
      expect(bathing.weeklyMinutes).toBe(210);
      
      const transfers = formData.data.level2Care.activities.find(act => act.name === 'Transfers');
      expect(transfers).toBeDefined();
      expect(transfers.frequency).toBe('8-10 times daily');
      expect(transfers.weeklyMinutes).toBe(315);
      
      // Check Level 3 Care mapping
      expect(formData.data.level3Care.activities.length).toBe(3);
      
      const medicationMgmt = formData.data.level3Care.activities.find(act => act.name === 'Medication management');
      expect(medicationMgmt).toBeDefined();
      expect(medicationMgmt.frequency).toBe('3 times daily');
      expect(medicationMgmt.weeklyMinutes).toBe(105);
      
      const medicalAppts = formData.data.level3Care.activities.find(act => act.name === 'Medical appointments');
      expect(medicalAppts).toBeDefined();
      expect(medicalAppts.frequency).toBe('Average 2 per week');
      expect(medicalAppts.weeklyMinutes).toBe(240);
      
      // Check care recommendations mapping
      expect(formData.data.recommendedHours.level1Total).toBe(10);  // 600 minutes / 60 = 10 hours
      expect(formData.data.recommendedHours.level2Total).toBe(18.08); // 1085 minutes / 60 ≈ 18.08 hours
      expect(formData.data.recommendedHours.level3Total).toBe(8.08); // 485 minutes / 60 ≈ 8.08 hours
      expect(formData.data.recommendedHours.grandTotal).toBe(36.16); // 2170 minutes / 60 ≈ 36.16 hours
      expect(formData.data.recommendedHours.notes).toContain('Client requires significant assistance');
      
      // Check care providers mapping
      expect(formData.data.careProviders.length).toBe(2);
      expect(formData.data.careProviders[0].name).toBe('ABC Home Health Agency');
      expect(formData.data.careProviders[0].type).toBe('Professional caregiving agency');
      expect(formData.data.careProviders[0].schedule).toBe('Daily, 4 hours in morning and 2 hours in evening');
      
      expect(formData.data.careProviders[1].name).toBe('John Doe');
      expect(formData.data.careProviders[1].type).toBe('Family member (son)');
      expect(formData.data.careProviders[1].contactInfo).toBe('(555) 987-6543');
    });
    
    it('should return empty form data when context data is empty', () => {
      const { formData, hasData } = mapContextToForm({}, mockInitialFormState);
      
      expect(hasData).toBe(false);
      expect(formData).toEqual(mockInitialFormState);
    });
    
    it('should handle missing sections gracefully', () => {
      const partialContextData = {
        attendantCare: {
          level1Care: [
            {
              activity: 'Meal preparation',
              frequency: 'Daily',
              weeklyMinutes: 210,
              details: 'Simple meal preparation'
            }
          ]
          // Missing other sections
        }
      };
      
      const { formData, hasData } = mapContextToForm(partialContextData, mockInitialFormState);
      
      expect(hasData).toBe(true);
      expect(formData.data.level1Care.activities.length).toBe(1);
      
      // Other sections should be initialized with defaults
      expect(formData.data.level2Care.activities).toEqual([]);
      expect(formData.data.level3Care.activities).toEqual([]);
    });
    
    it('should handle malformed data without crashing', () => {
      const malformedData = {
        attendantCare: {
          level1Care: "Not an array" // Incorrect type
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
          level1Care: {
            activities: [
              {
                name: 'Grocery shopping',
                frequency: 'Weekly',
                duration: '90 minutes per session',
                weeklyMinutes: 90,
                details: 'Shopping for groceries and household supplies',
                assistance: 'Transportation, carrying groceries, item selection',
                recommendations: 'Create shopping list in advance'
              },
              {
                name: 'Meal preparation',
                frequency: 'Daily, 2 times per day',
                duration: '30 minutes per session',
                weeklyMinutes: 420,
                details: 'Preparation of breakfast and dinner',
                assistance: 'All aspects of meal preparation',
                recommendations: 'Prepare extra portions for leftovers'
              }
            ]
          },
          level2Care: {
            activities: [
              {
                name: 'Bathing',
                frequency: 'Daily',
                duration: '30 minutes per session',
                weeklyMinutes: 210,
                details: 'Shower with seated bath chair',
                assistance: 'Setup, washing difficult areas, drying',
                recommendations: 'Schedule for evenings when caregiver available'
              },
              {
                name: 'Dressing',
                frequency: 'Twice daily',
                duration: '20 minutes per session',
                weeklyMinutes: 280,
                details: 'Morning dressing and evening preparation for bed',
                assistance: 'Full assistance with all aspects of dressing',
                recommendations: 'Prepare clothing in advance'
              }
            ]
          },
          level3Care: {
            activities: [
              {
                name: 'Medication management',
                frequency: '4 times daily',
                duration: '5 minutes per session',
                weeklyMinutes: 140,
                details: 'Administration of multiple medications',
                assistance: 'Dispensing, monitoring, documentation',
                recommendations: 'Use pill organizer with alarms'
              }
            ]
          },
          recommendedHours: {
            level1Total: 8.5,
            level2Total: 8.17,
            level3Total: 2.33,
            grandTotal: 19,
            notes: 'Client requires assistance with home management and personal care tasks due to cognitive impairment and physical limitations. Current care plan is focused on maintaining safety and supporting daily routines.'
          },
          careProviders: [
            {
              name: 'Home Care Agency',
              type: 'Professional caregivers',
              schedule: 'Weekdays, 4 hours daily',
              services: 'Personal care, medication management',
              contactInfo: '(555) 123-4567',
              notes: 'Current provider, reliable service'
            }
          ]
        }
      };
      
      const contextData = mapFormToContext(formData);
      
      // Check Level 1 Care mapping
      expect(contextData.attendantCare.level1Care.length).toBe(2);
      
      const groceryShopping = contextData.attendantCare.level1Care.find(act => act.activity === 'Grocery shopping');
      expect(groceryShopping).toBeDefined();
      expect(groceryShopping.frequency).toBe('Weekly');
      expect(groceryShopping.duration).toBe('90 minutes per session');
      expect(groceryShopping.weeklyMinutes).toBe(90);
      expect(groceryShopping.details).toBe('Shopping for groceries and household supplies');
      
      const mealPrep = contextData.attendantCare.level1Care.find(act => act.activity === 'Meal preparation');
      expect(mealPrep).toBeDefined();
      expect(mealPrep.frequency).toBe('Daily, 2 times per day');
      expect(mealPrep.weeklyMinutes).toBe(420);
      
      // Check Level 2 Care mapping
      expect(contextData.attendantCare.level2Care.length).toBe(2);
      
      const bathing = contextData.attendantCare.level2Care.find(act => act.activity === 'Bathing');
      expect(bathing).toBeDefined();
      expect(bathing.frequency).toBe('Daily');
      expect(bathing.duration).toBe('30 minutes per session');
      expect(bathing.weeklyMinutes).toBe(210);
      
      const dressing = contextData.attendantCare.level2Care.find(act => act.activity === 'Dressing');
      expect(dressing).toBeDefined();
      expect(dressing.frequency).toBe('Twice daily');
      expect(dressing.weeklyMinutes).toBe(280);
      
      // Check Level 3 Care mapping
      expect(contextData.attendantCare.level3Care.length).toBe(1);
      
      const medicationMgmt = contextData.attendantCare.level3Care.find(act => act.activity === 'Medication management');
      expect(medicationMgmt).toBeDefined();
      expect(medicationMgmt.frequency).toBe('4 times daily');
      expect(medicationMgmt.weeklyMinutes).toBe(140);
      
      // Check care recommendations mapping
      expect(contextData.attendantCare.careRecommendations.level1Weekly).toBe(510); // 8.5 hours * 60 minutes
      expect(contextData.attendantCare.careRecommendations.level2Weekly).toBe(490); // 8.17 hours * 60 minutes (rounded)
      expect(contextData.attendantCare.careRecommendations.level3Weekly).toBe(140); // 2.33 hours * 60 minutes (rounded)
      expect(contextData.attendantCare.careRecommendations.totalWeekly).toBe(1140); // 19 hours * 60 minutes
      expect(contextData.attendantCare.careRecommendations.justification).toContain('Client requires assistance with home management');
      
      // Check care providers mapping
      expect(contextData.attendantCare.currentProviders.length).toBe(1);
      expect(contextData.attendantCare.currentProviders[0].name).toBe('Home Care Agency');
      expect(contextData.attendantCare.currentProviders[0].type).toBe('Professional caregivers');
      expect(contextData.attendantCare.currentProviders[0].schedule).toBe('Weekdays, 4 hours daily');
    });
    
    it('should preserve existing context data not covered by the form', () => {
      const existingContextData = {
        attendantCare: {
          assessmentDate: '2023-05-01',
          assessor: 'Jane Smith, OT',
          fundingSource: 'Private insurance',
          followupDate: '2023-11-01'
        },
        customField: 'This should be preserved'
      };
      
      const formData = {
        data: {
          level1Care: {
            activities: [
              {
                name: 'Meal preparation',
                frequency: 'Daily',
                duration: '30 minutes',
                weeklyMinutes: 210,
                details: 'Breakfast and dinner preparation',
                assistance: 'Full meal preparation',
                recommendations: ''
              }
            ]
          },
          level2Care: {
            activities: []
          },
          level3Care: {
            activities: []
          },
          recommendedHours: {
            level1Total: 3.5,
            level2Total: 0,
            level3Total: 0,
            grandTotal: 3.5,
            notes: 'Minimal assistance needed'
          },
          careProviders: []
        }
      };
      
      const contextData = mapFormToContext(formData, existingContextData);
      
      // Check that existing data is preserved
      expect(contextData.attendantCare.assessmentDate).toBe('2023-05-01');
      expect(contextData.attendantCare.assessor).toBe('Jane Smith, OT');
      expect(contextData.attendantCare.fundingSource).toBe('Private insurance');
      expect(contextData.attendantCare.followupDate).toBe('2023-11-01');
      expect(contextData.customField).toBe('This should be preserved');
      
      // Check that new data is added
      expect(contextData.attendantCare.level1Care.length).toBe(1);
      expect(contextData.attendantCare.level1Care[0].activity).toBe('Meal preparation');
      expect(contextData.attendantCare.careRecommendations.level1Weekly).toBe(210);
    });
    
    it('should handle empty form data gracefully', () => {
      const emptyFormData = {
        data: {
          level1Care: {
            activities: []
          },
          level2Care: {
            activities: []
          },
          level3Care: {
            activities: []
          },
          recommendedHours: {
            level1Total: 0,
            level2Total: 0,
            level3Total: 0,
            grandTotal: 0,
            notes: ''
          },
          careProviders: []
        }
      };
      
      const existingContextData = { someField: 'value' };
      const contextData = mapFormToContext(emptyFormData, existingContextData);
      
      // Should still return a properly structured object
      expect(contextData.attendantCare).toBeDefined();
      expect(contextData.attendantCare.level1Care).toEqual([]);
      expect(contextData.attendantCare.level2Care).toEqual([]);
      expect(contextData.attendantCare.level3Care).toEqual([]);
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
      expect(contextData.attendantCare).toBeDefined();
      expect(contextData.attendantCare.level1Care).toBeDefined();
      expect(contextData.attendantCare.level2Care).toBeDefined();
      expect(contextData.attendantCare.level3Care).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test estimateCareMinutes utility
  describe('estimateCareMinutes', () => {
    it('should correctly estimate care minutes from descriptive text', () => {
      // Meal preparation
      expect(estimateCareMinutes('Daily meal preparation, 3 meals per day', 'Meal preparation')).toBe(420); // 20 min x 3 meals x 7 days
      
      // Bathing
      expect(estimateCareMinutes('Daily shower with assistance', 'Bathing')).toBe(210); // 30 min x 7 days
      
      // Dressing
      expect(estimateCareMinutes('Help with dressing morning and evening', 'Dressing')).toBe(210); // 15 min x 2 times x 7 days
      
      // Toileting
      expect(estimateCareMinutes('Toileting assistance throughout the day', 'Toileting')).toBe(350); // Approximately 5 times daily x 10 min
      
      // Medication management
      expect(estimateCareMinutes('Medication reminders 3 times daily', 'Medication management')).toBe(105); // 5 min x 3 times x 7 days
      
      // Housekeeping
      expect(estimateCareMinutes('Weekly light housekeeping', 'Housekeeping')).toBe(60); // 60 min once per week
    });
    
    it('should handle ambiguous descriptions with reasonable defaults', () => {
      expect(estimateCareMinutes('Some assistance required', 'Meal preparation')).toBeGreaterThan(0); 
      expect(estimateCareMinutes('Needs help with this task', 'Bathing')).toBeGreaterThan(0);
      expect(estimateCareMinutes('', 'Laundry')).toBeGreaterThan(0);
    });
    
    it('should handle activity-specific frequency words', () => {
      expect(estimateCareMinutes('Daily full bath', 'Bathing')).toBe(210); // 30 min x 7 days
      expect(estimateCareMinutes('Weekly sponge baths', 'Bathing')).toBe(30); // 30 min x 1 day
      
      expect(estimateCareMinutes('Weekly grocery shopping', 'Shopping')).toBe(90); // 90 min once per week
      expect(estimateCareMinutes('Biweekly grocery shopping', 'Shopping')).toBe(45); // 90 min x 0.5 per week
    });
  });
  
  // Test JSON import/export functionality
  describe('JSON import/export', () => {
    it('should properly export context data to JSON', () => {
      const jsonString = exportAttendantCareToJson(mockContextData);
      
      // Should be a valid JSON string
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      // Should contain the original data
      const parsedData = JSON.parse(jsonString);
      expect(parsedData.attendantCare.level1Care[0].activity).toBe('Meal preparation');
      expect(parsedData.attendantCare.careRecommendations.totalWeekly).toBe(2170);
    });
    
    it('should properly import JSON to context data', () => {
      const jsonString = JSON.stringify(mockContextData);
      const importedData = importAttendantCareFromJson(jsonString);
      
      // Should match the original data
      expect(importedData).toEqual(mockContextData);
    });
    
    it('should handle invalid JSON during import', () => {
      const invalidJsonString = '{ this is not valid JSON }';
      
      // Should return null for invalid JSON
      const importedData = importAttendantCareFromJson(invalidJsonString);
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
      
      // Check level1Care
      expect(mappedContextData.attendantCare.level1Care.length).toBe(
        mockContextData.attendantCare.level1Care.length
      );
      
      const origMealPrep = mockContextData.attendantCare.level1Care.find(act => act.activity === 'Meal preparation');
      const mappedMealPrep = mappedContextData.attendantCare.level1Care.find(act => act.activity === 'Meal preparation');
      
      expect(mappedMealPrep.weeklyMinutes).toBe(origMealPrep.weeklyMinutes);
      expect(mappedMealPrep.details).toBe(origMealPrep.details);
      
      // Check level2Care
      expect(mappedContextData.attendantCare.level2Care.length).toBe(
        mockContextData.attendantCare.level2Care.length
      );
      
      const origBathing = mockContextData.attendantCare.level2Care.find(act => act.activity === 'Bathing');
      const mappedBathing = mappedContextData.attendantCare.level2Care.find(act => act.activity === 'Bathing');
      
      expect(mappedBathing.weeklyMinutes).toBe(origBathing.weeklyMinutes);
      expect(mappedBathing.details).toBe(origBathing.details);
      
      // Check level3Care
      expect(mappedContextData.attendantCare.level3Care.length).toBe(
        mockContextData.attendantCare.level3Care.length
      );
      
      // Check careRecommendations
      expect(mappedContextData.attendantCare.careRecommendations.level1Weekly).toBe(
        mockContextData.attendantCare.careRecommendations.level1Weekly
      );
      
      expect(mappedContextData.attendantCare.careRecommendations.level2Weekly).toBe(
        mockContextData.attendantCare.careRecommendations.level2Weekly
      );
      
      expect(mappedContextData.attendantCare.careRecommendations.level3Weekly).toBe(
        mockContextData.attendantCare.careRecommendations.level3Weekly
      );
      
      expect(mappedContextData.attendantCare.careRecommendations.totalWeekly).toBe(
        mockContextData.attendantCare.careRecommendations.totalWeekly
      );
      
      // Check careProviders
      expect(mappedContextData.attendantCare.currentProviders.length).toBe(
        mockContextData.attendantCare.currentProviders.length
      );
      
      expect(mappedContextData.attendantCare.currentProviders[0].name).toBe(
        mockContextData.attendantCare.currentProviders[0].name
      );
    });
  });
});
