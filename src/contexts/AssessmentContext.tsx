"use client";

import React, { useEffect } from 'react';
import { 
  saveAssessment, 
  loadAssessment, 
  updateAssessmentSection as updateStoredSection,
  createNewAssessment
} from '@/services/assessment-storage-service';

interface AssessmentData {
  demographics?: any;
  medicalHistory?: any;
  symptomsAssessment?: any;
  functionalStatus?: any;
  typicalDay?: any;
  environmentalAssessment?: any;
  activitiesDailyLiving?: any;
  attendantCare?: any;
  referral?: any;
  purposeAndMethodology?: any;
  metadata?: {
    id: string;
    created: string;
    lastSaved: string;
    assessmentDate?: string;
    title?: string;
  };
}

interface AssessmentContextType {
  data: AssessmentData;
  currentAssessmentId: string | null;
  updateSection: (section: keyof AssessmentData, data: any) => void;
  setAssessmentData: (data: AssessmentData) => void;
  updateReferral: (data: any) => void;
  saveCurrentAssessment: () => boolean;
  loadAssessmentById: (assessmentId: string) => boolean;
  createAssessment: () => string;
  hasUnsavedChanges: boolean;
}

const AssessmentContext = React.createContext<AssessmentContextType>({
  data: {},
  currentAssessmentId: null,
  updateSection: () => {},
  setAssessmentData: () => {},
  updateReferral: () => {},
  saveCurrentAssessment: () => false,
  loadAssessmentById: () => false,
  createAssessment: () => "",
  hasUnsavedChanges: false,
});

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<AssessmentData>({});
  const [currentAssessmentId, setCurrentAssessmentId] = React.useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState<boolean>(false);
  const [lastSavedData, setLastSavedData] = React.useState<string>("");
  
  // Auto-save effect when data changes
  useEffect(() => {
    if (!currentAssessmentId || !hasUnsavedChanges) return;
    
    // Create a debounced save function
    const timeoutId = setTimeout(() => {
      saveCurrentAssessment();
    }, 2000); // Auto-save 2 seconds after changes stop
    
    return () => clearTimeout(timeoutId);
  }, [data, hasUnsavedChanges, currentAssessmentId]);
  
  // Function to check for changes
  const checkForChanges = (newData: AssessmentData) => {
    try {
      const currentDataString = JSON.stringify(newData);
      const hasChanges = currentDataString !== lastSavedData;
      setHasUnsavedChanges(hasChanges);
    } catch (error) {
      console.error("Error checking for changes:", error);
      setHasUnsavedChanges(true); // Assume changes if we can't compare
    }
  };

  const updateSection = (section: keyof AssessmentData, newData: any) => {
    console.log(`Updating section ${String(section)}`);
    
    // Check for nested structure issue (typicalDay: {typicalDay: {...}})
    if (section === 'typicalDay' && newData.typicalDay) {
      console.log("Fixed nested typicalDay structure");
      newData = newData.typicalDay;
    }
    
    // Check for nested structure issue (symptomsAssessment: {symptomsAssessment: {...}})
    if (section === 'symptomsAssessment' && newData.symptomsAssessment) {
      console.log("Fixed nested symptomsAssessment structure");
      newData = newData.symptomsAssessment;
    }
    
    setData(prev => {
      const updated = {
        ...prev,
        [section]: newData
      };
      
      checkForChanges(updated);
      return updated;
    });
    
    // If we have a current assessment ID, update the section in storage
    if (currentAssessmentId) {
      try {
        updateStoredSection(currentAssessmentId, section.toString(), newData);
      } catch (error) {
        console.error(`Error updating section ${String(section)}:`, error);
      }
    }
  };

  // Special handler for referral data that includes processing and mapping
  const updateReferral = (referralData: any) => {
    if (!referralData || !referralData.referral) {
      console.log("No valid referral data provided");
      return;
    }
    
    // Extract the referral part from the data
    const referral = referralData.referral;
    
    // Update the referral section in the assessment data
    updateSection('referral', referral);
    
    // If the referral contains client info, we can also update the demographics
    if (referral.client && Object.keys(referral.client).length > 0) {
      try {
        // Import the mapper to convert client info to demographics
        import('@/services/referralMapper').then(({ syncClientToDemographics }) => {
          const demographicsData = syncClientToDemographics(referral);
          if (demographicsData) {
            console.log("Syncing client info to demographics");
            // Only update demographics if we don't already have data
            if (!data.demographics || Object.keys(data.demographics).length === 0) {
              updateSection('demographics', demographicsData);
            }
          }
        }).catch(err => {
          console.error("Error importing referralMapper:", err);
        });
      } catch (error) {
        console.error("Error syncing client info to demographics:", error);
      }
    }
    
    // If the referral contains assessment requirements, we can update the purpose section
    if (referral.assessmentTypes || referral.specificRequirements || referral.domains) {
      try {
        // Import the mapper to extract assessment requirements
        import('@/services/referralMapper').then(({ getAssessmentRequirements }) => {
          const requirementsText = getAssessmentRequirements(referral);
          if (requirementsText) {
            console.log("Adding assessment requirements to purpose section");
            // We'll append this to any existing purpose data
            const purposeData = data.purposeAndMethodology || {};
            const updatedPurpose = {
              ...purposeData,
              referralRequirements: requirementsText
            };
            updateSection('purposeAndMethodology', updatedPurpose);
          }
        }).catch(err => {
          console.error("Error importing referralMapper:", err);
        });
      } catch (error) {
        console.error("Error adding requirements to purpose:", error);
      }
    }
  };

  const setAssessmentData = (newData: AssessmentData) => {
    console.log("Setting complete assessment data");
    
    // Make sure the data is not nested incorrectly
    const fixedData = { ...newData };
    
    // Check for double-nesting and fix
    if (fixedData.typicalDay && fixedData.typicalDay.typicalDay) {
      console.log("Fixing double-nested typicalDay");
      fixedData.typicalDay = fixedData.typicalDay.typicalDay;
    }
    
    if (fixedData.medicalHistory && fixedData.medicalHistory.medicalHistory) {
      console.log("Fixing double-nested medicalHistory");
      fixedData.medicalHistory = fixedData.medicalHistory.medicalHistory;
    }
    
    if (fixedData.symptomsAssessment && fixedData.symptomsAssessment.symptomsAssessment) {
      console.log("Fixing double-nested symptomsAssessment");
      fixedData.symptomsAssessment = fixedData.symptomsAssessment.symptomsAssessment;
    }
    
    // Add metadata if not present
    if (!fixedData.metadata && currentAssessmentId) {
      fixedData.metadata = {
        id: currentAssessmentId,
        created: new Date().toISOString(),
        lastSaved: new Date().toISOString(),
        assessmentDate: new Date().toISOString()
      };
    }
    
    setData(fixedData);
    checkForChanges(fixedData);
    
    // If we have a current assessment ID, save the entire assessment
    if (currentAssessmentId) {
      try {
        saveAssessment(currentAssessmentId, fixedData);
        setLastSavedData(JSON.stringify(fixedData));
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Error saving assessment data:", error);
      }
    }
  };
  
  const saveCurrentAssessment = () => {
    if (!currentAssessmentId) {
      console.error("Cannot save: No current assessment ID");
      return false;
    }
    
    try {
      // Ensure we have metadata with updated lastSaved timestamp
      const assessmentToSave = {
        ...data,
        metadata: {
          ...(data.metadata || {}),
          id: currentAssessmentId,
          lastSaved: new Date().toISOString(),
          assessmentDate: data.metadata?.assessmentDate || new Date().toISOString()
        }
      };
      
      // If we have demographics data, update the metadata title
      if (assessmentToSave.demographics?.personalInfo) {
        const firstName = assessmentToSave.demographics.personalInfo.firstName || '';
        const lastName = assessmentToSave.demographics.personalInfo.lastName || '';
        const clientName = `${lastName}, ${firstName}`.trim();
        
        if (clientName !== ',') {
          assessmentToSave.metadata.title = clientName;
        }
      }
      
      console.log("Saving assessment:", assessmentToSave);
      
      const success = saveAssessment(currentAssessmentId, assessmentToSave);
      
      if (success) {
        setLastSavedData(JSON.stringify(assessmentToSave));
        setHasUnsavedChanges(false);
        
        // Force a context update to ensure components see the latest data
        setData({...assessmentToSave});
        
        console.log("Assessment saved successfully");
      } else {
        console.error("Failed to save assessment");
      }
      
      return success;
    } catch (error) {
      console.error("Error in saveCurrentAssessment:", error);
      return false;
    }
  };
  
  const loadAssessmentById = (assessmentId: string) => {
    try {
      const loadedData = loadAssessment(assessmentId);
      
      if (!loadedData) {
        console.error(`Failed to load assessment with ID: ${assessmentId}`);
        return false;
      }
      
      setData(loadedData);
      setCurrentAssessmentId(assessmentId);
      setLastSavedData(JSON.stringify(loadedData));
      setHasUnsavedChanges(false);
      console.log(`Assessment ${assessmentId} loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Error loading assessment ${assessmentId}:`, error);
      return false;
    }
  };
  
  const createAssessment = () => {
    try {
      // Save any existing assessment first
      if (currentAssessmentId && hasUnsavedChanges) {
        saveCurrentAssessment();
      }
      
      // Create a new assessment
      const newAssessmentId = createNewAssessment();
      setCurrentAssessmentId(newAssessmentId);
      
      // Reset the form
      const initialData = {
        metadata: {
          id: newAssessmentId,
          created: new Date().toISOString(),
          lastSaved: new Date().toISOString(),
          assessmentDate: new Date().toISOString()
        }
      };
      
      setData(initialData);
      setLastSavedData(JSON.stringify(initialData));
      setHasUnsavedChanges(false);
      
      return newAssessmentId;
    } catch (error) {
      console.error("Error creating new assessment:", error);
      return "";
    }
  };

  return (
    <AssessmentContext.Provider value={{ 
      data, 
      currentAssessmentId,
      updateSection, 
      setAssessmentData, 
      updateReferral,
      saveCurrentAssessment,
      loadAssessmentById,
      createAssessment,
      hasUnsavedChanges
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = React.useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}

// Also export for use in the LoadAssessment component
export const useAssessmentContext = useAssessment;