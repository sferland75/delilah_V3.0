// Enhanced storage service with compression and fallback mechanisms for field trials

// Import compression library
// Note: This depends on lz-string being installed
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

// Constants
const STORAGE_KEY_PREFIX = 'delilah_v3_';
const ASSESSMENTS_KEY = `${STORAGE_KEY_PREFIX}assessments`;
const LAST_SESSION_KEY = `${STORAGE_KEY_PREFIX}last_session`;
const STORAGE_VERSION = '1.0';

// Types
export interface AssessmentMetadata {
  id: string;
  created: string;
  lastSaved: string;
  clientName: string;
  assessmentDate: string;
  title?: string;
  version: string;
}

export interface Assessment {
  id: string;
  metadata: AssessmentMetadata;
  data: any;
}

export interface StorageResult {
  success: boolean;
  error?: string;
  usedFallback?: boolean;
}

/**
 * Save an assessment with compression and fallback mechanisms
 */
export function saveAssessment(id: string, data: any): StorageResult {
  try {
    // Get current assessments
    const assessments = getAllAssessments().data;
    
    // Extract client name from demographics data if available
    let clientName = 'Untitled';
    if (data.demographics?.personalInfo?.firstName || data.demographics?.personalInfo?.lastName) {
      const firstName = data.demographics?.personalInfo?.firstName || '';
      const lastName = data.demographics?.personalInfo?.lastName || '';
      clientName = `${lastName}, ${firstName}`.trim();
      if (clientName === ',') clientName = 'Untitled';
    }
    
    // Extract assessment date if available
    const assessmentDate = data.metadata?.assessmentDate || new Date().toISOString();
    
    // Create or update metadata
    const metadata: AssessmentMetadata = {
      id,
      created: data.metadata?.created || new Date().toISOString(),
      lastSaved: new Date().toISOString(),
      clientName,
      assessmentDate,
      title: data.metadata?.title || clientName,
      version: STORAGE_VERSION
    };
    
    // Find if this assessment already exists
    const index = assessments.findIndex(a => a.id === id);
    
    const updatedAssessment: Assessment = {
      id,
      metadata,
      data
    };
    
    // Update or add the assessment
    let updatedAssessments;
    if (index >= 0) {
      updatedAssessments = [
        ...assessments.slice(0, index),
        updatedAssessment,
        ...assessments.slice(index + 1)
      ];
    } else {
      updatedAssessments = [...assessments, updatedAssessment];
    }
    
    // Try primary storage (localStorage with compression)
    try {
      const compressed = compressToUTF16(JSON.stringify(updatedAssessments));
      localStorage.removeItem(ASSESSMENTS_KEY);
      localStorage.setItem(ASSESSMENTS_KEY, compressed);
      
      // Also save this assessment individually for easier recovery
      const individualKey = `${STORAGE_KEY_PREFIX}assessment_${id}`;
      const compressedIndividual = compressToUTF16(JSON.stringify(updatedAssessment));
      localStorage.setItem(individualKey, compressedIndividual);
      
      return { success: true };
    } catch (primaryError) {
      console.error('Error in primary storage:', primaryError);
      
      // Try fallback storage (sessionStorage without compression)
      try {
        sessionStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(updatedAssessments));
        return { success: true, usedFallback: true };
      } catch (fallbackError) {
        throw new Error(`Primary and fallback storage failed: ${fallbackError}`);
      }
    }
  } catch (error) {
    console.error('Error saving assessment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving assessment'
    };
  }
}

/**
 * Update a specific section of an assessment
 */
export function updateAssessmentSection(id: string, section: string, sectionData: any): StorageResult {
  try {
    // Load the assessment
    const { data: assessmentData, success } = loadAssessment(id);
    
    if (!success || !assessmentData) {
      throw new Error(`Assessment with ID ${id} not found`);
    }
    
    // Update the section
    assessmentData[section] = sectionData;
    
    // Save the updated assessment
    return saveAssessment(id, assessmentData);
  } catch (error) {
    console.error('Error updating assessment section:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error updating section'
    };
  }
}

/**
 * Load an assessment with fallback mechanisms
 */
export function loadAssessment(id: string): { success: boolean; data: any | null; usedFallback?: boolean } {
  try {
    // First, try to load from the individual assessment storage
    const individualKey = `${STORAGE_KEY_PREFIX}assessment_${id}`;
    
    try {
      const compressedData = localStorage.getItem(individualKey);
      if (compressedData) {
        const assessment = JSON.parse(decompressFromUTF16(compressedData));
        return { success: true, data: assessment.data };
      }
    } catch (individualError) {
      console.warn('Could not load from individual storage, trying main storage', individualError);
    }
    
    // Try from main storage
    const { data: assessments, success, usedFallback } = getAllAssessments();
    
    if (!success) {
      throw new Error('Failed to load assessments');
    }
    
    // Find the requested assessment
    const assessment = assessments.find(a => a.id === id);
    
    return { 
      success: !!assessment, 
      data: assessment ? assessment.data : null,
      usedFallback
    };
  } catch (error) {
    console.error('Error loading assessment:', error);
    return { 
      success: false, 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error loading assessment'
    };
  }
}

/**
 * Get all saved assessments with fallback mechanisms
 */
export function getAllAssessments(): { success: boolean; data: Assessment[]; usedFallback?: boolean } {
  try {
    // Try primary storage (localStorage with compression)
    try {
      const compressedData = localStorage.getItem(ASSESSMENTS_KEY);
      
      if (!compressedData) {
        return { success: true, data: [] };
      }
      
      const decompressed = decompressFromUTF16(compressedData);
      if (!decompressed) {
        throw new Error('Decompression failed');
      }
      
      return { success: true, data: JSON.parse(decompressed) };
    } catch (primaryError) {
      console.warn('Error in primary storage, trying fallback:', primaryError);
      
      // Try fallback storage (sessionStorage without compression)
      try {
        const sessionData = sessionStorage.getItem(ASSESSMENTS_KEY);
        return { 
          success: true, 
          data: sessionData ? JSON.parse(sessionData) : [],
          usedFallback: true
        };
      } catch (fallbackError) {
        // Try individual assessments as last resort
        try {
          const assessments: Assessment[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${STORAGE_KEY_PREFIX}assessment_`)) {
              try {
                const compressedItem = localStorage.getItem(key);
                if (compressedItem) {
                  const assessment = JSON.parse(decompressFromUTF16(compressedItem));
                  assessments.push(assessment);
                }
              } catch (itemError) {
                console.warn(`Couldn't decode item ${key}`, itemError);
              }
            }
          }
          
          if (assessments.length > 0) {
            return { 
              success: true, 
              data: assessments,
              usedFallback: true
            };
          }
          
          throw new Error('All storage methods failed');
        } catch (lastResortError) {
          throw new Error(`All storage methods failed: ${lastResortError}`);
        }
      }
    }
  } catch (error) {
    console.error('Error getting assessments:', error);
    return { 
      success: false, 
      data: [], 
      error: error instanceof Error ? error.message : 'Unknown error getting assessments'
    };
  }
}

/**
 * Delete an assessment with proper cleanup
 */
export function deleteAssessment(id: string): StorageResult {
  try {
    // Get current assessments
    const { data: assessments, success } = getAllAssessments();
    
    if (!success) {
      throw new Error('Failed to load current assessments');
    }
    
    // Filter out the assessment to delete
    const updatedAssessments = assessments.filter(a => a.id !== id);
    
    // Remove individual storage
    try {
      const individualKey = `${STORAGE_KEY_PREFIX}assessment_${id}`;
      localStorage.removeItem(individualKey);
    } catch (individualError) {
      console.warn('Could not remove individual storage', individualError);
    }
    
    // Try primary storage (localStorage with compression)
    try {
      const compressed = compressToUTF16(JSON.stringify(updatedAssessments));
      localStorage.removeItem(ASSESSMENTS_KEY);
      localStorage.setItem(ASSESSMENTS_KEY, compressed);
      return { success: true };
    } catch (primaryError) {
      console.error('Error in primary storage:', primaryError);
      
      // Try fallback storage (sessionStorage without compression)
      try {
        sessionStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(updatedAssessments));
        return { success: true, usedFallback: true };
      } catch (fallbackError) {
        throw new Error(`Primary and fallback storage failed: ${fallbackError}`);
      }
    }
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error deleting assessment'
    };
  }
}

/**
 * Create a new assessment with a unique ID
 */
export function createNewAssessment(): { success: boolean; id: string } {
  try {
    const id = `assessment_${Date.now()}`;
    
    // Create initial metadata
    const metadata: AssessmentMetadata = {
      id,
      created: new Date().toISOString(),
      lastSaved: new Date().toISOString(),
      clientName: 'Untitled',
      assessmentDate: new Date().toISOString(),
      version: STORAGE_VERSION
    };
    
    // Create initial assessment with metadata
    const initialData = {
      metadata
    };
    
    // Save the new assessment
    const saveResult = saveAssessment(id, initialData);
    
    if (!saveResult.success) {
      throw new Error(`Failed to create assessment: ${saveResult.error}`);
    }
    
    return { success: true, id };
  } catch (error) {
    console.error('Error creating new assessment:', error);
    return { 
      success: false, 
      id: '', 
      error: error instanceof Error ? error.message : 'Unknown error creating assessment'
    };
  }
}

/**
 * Save current session state for recovery
 */
export function saveSessionState(assessmentId: string, route: string): StorageResult {
  try {
    const sessionState = {
      assessmentId,
      route,
      timestamp: new Date().toISOString()
    };
    
    // Try localStorage first
    try {
      localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(sessionState));
      return { success: true };
    } catch (primaryError) {
      // Try sessionStorage as fallback
      try {
        sessionStorage.setItem(LAST_SESSION_KEY, JSON.stringify(sessionState));
        return { success: true, usedFallback: true };
      } catch (fallbackError) {
        throw new Error('Both storage methods failed');
      }
    }
  } catch (error) {
    console.error('Error saving session state:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving session state'
    };
  }
}

/**
 * Get last session state for recovery
 */
export function getLastSessionState(): { 
  success: boolean; 
  data: { assessmentId: string; route: string; timestamp: string } | null;
} {
  try {
    // Try localStorage first
    try {
      const data = localStorage.getItem(LAST_SESSION_KEY);
      if (data) {
        return { success: true, data: JSON.parse(data) };
      }
    } catch (primaryError) {
      console.warn('Error reading session from localStorage:', primaryError);
    }
    
    // Try sessionStorage as fallback
    try {
      const data = sessionStorage.getItem(LAST_SESSION_KEY);
      if (data) {
        return { success: true, data: JSON.parse(data) };
      }
    } catch (fallbackError) {
      console.warn('Error reading session from sessionStorage:', fallbackError);
    }
    
    return { success: true, data: null };
  } catch (error) {
    console.error('Error getting session state:', error);
    return { 
      success: false, 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error getting session state'
    };
  }
}

/**
 * Clear last session state after recovery
 */
export function clearLastSessionState(): StorageResult {
  try {
    localStorage.removeItem(LAST_SESSION_KEY);
    sessionStorage.removeItem(LAST_SESSION_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error clearing session state:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error clearing session state'
    };
  }
}
