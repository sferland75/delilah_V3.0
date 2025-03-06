// Constants
const STORAGE_KEY = 'delilah_assessments';

// Assessment interface
interface Assessment {
  id: string;
  created: string;
  lastSaved: string;
  clientName: string; // Added clientName field
  assessmentDate: string; // Added assessmentDate field
  data: any;
}

/**
 * Save an assessment to local storage
 * @param id Assessment ID
 * @param data Assessment data
 * @returns Success status
 */
export function saveAssessment(id: string, data: any): boolean {
  try {
    // Get current assessments
    const assessments = getAllAssessments();
    
    // Extract client name from demographics data if available
    let clientName = 'Untitled';
    if (data.demographics?.personalInfo?.firstName || data.demographics?.personalInfo?.lastName) {
      const firstName = data.demographics?.personalInfo?.firstName || '';
      const lastName = data.demographics?.personalInfo?.lastName || '';
      clientName = `${lastName}, ${firstName}`.trim();
      if (clientName === ',') clientName = 'Untitled';
      
      // Also update the metadata title if it exists
      if (data.metadata) {
        data.metadata.title = clientName;
      }
    }
    
    // Extract assessment date if available
    const assessmentDate = data.metadata?.assessmentDate || new Date().toISOString();
    
    // Find if this assessment already exists
    const index = assessments.findIndex(a => a.id === id);
    
    const updatedAssessment = {
      id,
      created: index >= 0 ? assessments[index].created : new Date().toISOString(),
      lastSaved: new Date().toISOString(),
      clientName, // Add client name to stored assessment
      assessmentDate, // Add assessment date to stored assessment
      data
    };
    
    // Update or add the assessment
    if (index >= 0) {
      assessments[index] = updatedAssessment;
    } else {
      assessments.push(updatedAssessment);
    }
    
    // Save to local storage with a forceful approach to ensure writes
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
    
    console.log("Saved assessment with client name:", clientName);
    
    return true;
  } catch (error) {
    console.error('Error saving assessment:', error);
    return false;
  }
}

/**
 * Update a specific section of an assessment
 * @param id Assessment ID
 * @param section Section name
 * @param sectionData Section data
 */
export function updateAssessmentSection(id: string, section: string, sectionData: any): void {
  try {
    // Load the assessment
    const assessmentData = loadAssessment(id);
    
    if (!assessmentData) {
      throw new Error(`Assessment with ID ${id} not found`);
    }
    
    // Update the section
    assessmentData[section] = sectionData;
    
    // Save the updated assessment
    saveAssessment(id, assessmentData);
  } catch (error) {
    console.error('Error updating assessment section:', error);
    throw error;
  }
}

/**
 * Load an assessment from local storage
 * @param id Assessment ID
 * @returns Assessment data or null if not found
 */
export function loadAssessment(id: string): any | null {
  try {
    // Get all assessments
    const assessments = getAllAssessments();
    
    // Find the requested assessment
    const assessment = assessments.find(a => a.id === id);
    
    return assessment ? assessment.data : null;
  } catch (error) {
    console.error('Error loading assessment:', error);
    return null;
  }
}

/**
 * Get all saved assessments
 * @returns Array of assessments
 */
export function getAllAssessments(): Assessment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting assessments:', error);
    return [];
  }
}

/**
 * Delete an assessment from local storage
 * @param id Assessment ID
 * @returns Success status
 */
export function deleteAssessment(id: string): boolean {
  try {
    // Get current assessments
    const assessments = getAllAssessments();
    
    // Filter out the assessment to delete
    const updatedAssessments = assessments.filter(a => a.id !== id);
    
    // Save the updated list
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAssessments));
    
    return true;
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return false;
  }
}

/**
 * Create a new assessment with a unique ID
 * @returns New assessment ID
 */
export function createNewAssessment(): string {
  const id = `assessment_${Date.now()}`;
  
  // Create initial assessment with metadata
  const initialData = {
    metadata: {
      id,
      created: new Date().toISOString(),
      lastSaved: new Date().toISOString(),
      assessmentDate: new Date().toISOString()
    }
  };
  
  // Save the new assessment
  saveAssessment(id, initialData);
  
  return id;
}