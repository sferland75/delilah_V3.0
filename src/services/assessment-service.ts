/**
 * Assessment Data Service
 * 
 * Provides functions to retrieve and manipulate assessment data from the backend or local storage.
 */

import { clientAssessmentSchema } from '@/lib/schemas/client-assessment-schema';
import { getClientById } from './client-service';

// Cache assessment data in memory to avoid redundant fetches
let cachedAssessmentData: any = null;
let assessmentDataTimestamp: number = 0;
const CACHE_EXPIRY_MS = 60000; // 1 minute

/**
 * Get the full assessment data for the current client
 */
export async function getAssessmentData(): Promise<any> {
  // Check if we have valid cached data
  const now = Date.now();
  if (cachedAssessmentData && (now - assessmentDataTimestamp < CACHE_EXPIRY_MS)) {
    return cachedAssessmentData;
  }

  try {
    // Get the current client ID
    const clientId = getCurrentClientId();
    
    if (!clientId) {
      throw new Error('No client ID available');
    }
    
    // First try to fetch from the backend
    const response = await fetch(`/api/assessments/${clientId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch assessment data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the data
    cachedAssessmentData = data;
    assessmentDataTimestamp = now;
    
    return data;
  } catch (error) {
    console.warn('Failed to fetch assessment data from API, attempting local storage fallback:', error);
    
    try {
      // Try to fetch from localStorage
      const savedData = localStorage.getItem('currentAssessment');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Cache the data
        cachedAssessmentData = parsedData;
        assessmentDataTimestamp = now;
        
        return parsedData;
      }
    } catch (localStorageError) {
      console.error('Failed to retrieve assessment data from localStorage:', localStorageError);
    }
    
    // If all else fails, return a mock or empty assessment object
    return getMockAssessmentData();
  }
}

/**
 * Get a specific section of the assessment data
 */
export async function getAssessmentSection(sectionId: string): Promise<any> {
  const assessmentData = await getAssessmentData();
  
  // Map sectionId to the corresponding assessment data structure
  switch (sectionId) {
    case 'initial-assessment':
      return {
        ...assessmentData.demographics,
        ...assessmentData.initialAssessment
      };
    case 'medical-history':
      return assessmentData.medicalHistory || {};
    case 'symptoms-assessment':
      return assessmentData.symptoms || {};
    case 'functional-status':
      return assessmentData.functional || {};
    case 'typical-day':
      return assessmentData.typicalDay || {};
    case 'environmental-assessment':
      return assessmentData.environment || {};
    case 'activities-daily-living':
      return assessmentData.adl || {};
    case 'attendant-care':
      return assessmentData.attendantCare || {};
    default:
      return {};
  }
}

/**
 * Update assessment data (combines with existing data)
 */
export async function updateAssessmentData(sectionId: string, data: any): Promise<boolean> {
  try {
    const clientId = getCurrentClientId();
    
    if (!clientId) {
      throw new Error('No client ID available');
    }

    // Update on backend
    const response = await fetch(`/api/assessments/${clientId}/${sectionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update assessment data: ${response.statusText}`);
    }
    
    // Update cache if we have it
    if (cachedAssessmentData) {
      cachedAssessmentData = {
        ...cachedAssessmentData,
        [getSectionDataKey(sectionId)]: {
          ...cachedAssessmentData[getSectionDataKey(sectionId)],
          ...data
        }
      };
    }
    
    // Also update localStorage as backup
    try {
      const savedData = localStorage.getItem('currentAssessment');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        localStorage.setItem('currentAssessment', JSON.stringify({
          ...parsedData,
          [getSectionDataKey(sectionId)]: {
            ...parsedData[getSectionDataKey(sectionId)],
            ...data
          }
        }));
      }
    } catch (localStorageError) {
      console.warn('Failed to update localStorage:', localStorageError);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update assessment data:', error);
    
    // Try to update localStorage as fallback
    try {
      const savedData = localStorage.getItem('currentAssessment');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        localStorage.setItem('currentAssessment', JSON.stringify({
          ...parsedData,
          [getSectionDataKey(sectionId)]: {
            ...parsedData[getSectionDataKey(sectionId)],
            ...data
          }
        }));
        
        // Update cache if we have it
        if (cachedAssessmentData) {
          cachedAssessmentData = {
            ...cachedAssessmentData,
            [getSectionDataKey(sectionId)]: {
              ...cachedAssessmentData[getSectionDataKey(sectionId)],
              ...data
            }
          };
        }
        
        return true;
      }
    } catch (localStorageError) {
      console.error('Failed to update localStorage:', localStorageError);
    }
    
    return false;
  }
}

/**
 * Clear the assessment data cache
 */
export function clearAssessmentDataCache(): void {
  cachedAssessmentData = null;
  assessmentDataTimestamp = 0;
}

/**
 * Get the correct data key for the given section ID
 */
function getSectionDataKey(sectionId: string): string {
  // Map section IDs to the corresponding data keys in the assessment object
  const sectionToDataKeyMap: Record<string, string> = {
    'initial-assessment': 'initialAssessment',
    'medical-history': 'medicalHistory',
    'symptoms-assessment': 'symptoms',
    'functional-status': 'functional',
    'typical-day': 'typicalDay',
    'environmental-assessment': 'environment',
    'activities-daily-living': 'adl',
    'attendant-care': 'attendantCare'
  };
  
  return sectionToDataKeyMap[sectionId] || sectionId;
}

/**
 * Get the current client ID from application state
 */
function getCurrentClientId(): string | null {
  // This should come from your app's state management
  // For now, returning a placeholder
  return 'current-client-id';
  
  // In a real implementation, you might do something like:
  // return store.getState().clients.currentClientId;
}

/**
 * Get mock assessment data for fallback/development purposes
 */
function getMockAssessmentData(): any {
  return {
    demographics: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-01-01',
      address: '123 Main St, Anytown, CA',
      phone: '555-123-4567',
      email: 'john.smith@example.com'
    },
    initialAssessment: {
      referralSource: 'Dr. Jane Williams, Neurologist',
      referralReason: 'Multiple Sclerosis management',
      referralDate: '2025-02-01',
      assessmentDate: '2025-02-24'
    },
    medicalHistory: {
      conditions: [
        'Multiple Sclerosis (relapsing-remitting), diagnosed 2015',
        'Hypertension, well-controlled with medication',
        'Depression, mild'
      ],
      medications: [
        'Tecfidera (dimethyl fumarate) 240mg twice daily',
        'Lisinopril 10mg daily',
        'Escitalopram 10mg daily'
      ],
      allergies: ['Penicillin', 'Sulfa drugs'],
      surgeries: ['Appendectomy, 2010']
    },
    symptoms: {
      painLevel: 4,
      painLocations: ['Lower back', 'Right leg'],
      fatigue: 'Moderate, worse in afternoons',
      sleep: 'Disrupted, wakes 2-3 times nightly',
      cognition: 'Occasional word-finding difficulties and mild short-term memory issues'
    },
    functional: {
      mobility: 'Independent with cane for longer distances',
      transfers: 'Independent',
      balance: 'Mild impairment, occasional loss of balance',
      endurance: 'Limited, requires rest after 30 minutes of activity',
      strength: 'Decreased in lower extremities, 4/5 in right leg, 4+/5 in left'
    },
    typicalDay: {
      morningRoutine: 'Wakes at 7am, completes self-care independently but at slower pace',
      afternoonActivities: 'Works from home, takes 30-minute rest after lunch',
      eveningRoutine: 'Light meal preparation, watches TV, in bed by 10pm'
    },
    environment: {
      homeLayout: 'Single-level home with 3 steps at entry',
      accessIssues: 'Bathroom doorway too narrow for walker',
      safetyRisks: 'Area rugs creating trip hazard',
      modifications: 'Grab bars installed in shower, shower chair in use'
    },
    adl: {
      selfCare: 'Independent with setup for lower body dressing',
      homeManagement: 'Needs assistance with heavier cleaning tasks',
      mealPreparation: 'Independent with simple meals, difficulty with prolonged standing',
      community: 'Independent with driving for short distances'
    },
    attendantCare: {
      currentSupport: 'Spouse assists with heavy housework and some meal preparation',
      supportHours: '6 hours weekly from family, no paid support',
      recommendedHours: '8 hours weekly',
      careActivities: 'Home maintenance, laundry, shopping, meal preparation'
    }
  };
}
