"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { 
  saveAssessment, 
  loadAssessment, 
  updateAssessmentSection,
  createNewAssessment,
  saveSessionState,
  getLastSessionState,
  clearLastSessionState,
  StorageResult
} from '@/services/enhanced-storage-service';

// Status types for UI feedback
export type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

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
    version?: string;
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
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  setAutoSaveInterval: (interval: number) => void;
  checkForRecovery: () => { hasRecovery: boolean; assessmentId: string | null; route: string | null };
  recoverSession: (assessmentId: string) => boolean;
  dismissRecovery: () => void;
  isLoading: boolean;
}

// Create a context to emulate the standard AssessmentContext interface
const AssessmentContext = React.createContext<any>(null);

// Create the enhanced context
const EnhancedAssessmentContext = React.createContext<AssessmentContextType>({
  data: {},
  currentAssessmentId: null,
  updateSection: () => {},
  setAssessmentData: () => {},
  updateReferral: () => {},
  saveCurrentAssessment: () => false,
  loadAssessmentById: () => false,
  createAssessment: () => "",
  hasUnsavedChanges: false,
  saveStatus: 'idle',
  lastSaved: null,
  setAutoSaveInterval: () => {},
  checkForRecovery: () => ({ hasRecovery: false, assessmentId: null, route: null }),
  recoverSession: () => false,
  dismissRecovery: () => {},
  isLoading: false
});

export function EnhancedAssessmentProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [data, setData] = useState<AssessmentData>({});
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSavedData, setLastSavedData] = useState<string>("");
  const [autoSaveInterval, setAutoSaveInterval] = useState<number>(30000); // 30 seconds default
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Effect for tracking browser closing/navigation
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // If we have unsaved changes, prompt the user
      if (hasUnsavedChanges && currentAssessmentId) {
        saveCurrentAssessment();
        saveSessionState(currentAssessmentId, router.asPath);
        
        // For modern browsers
        event.preventDefault();
        // For older browsers
        event.returnValue = '';
        return '';
      }
    };
    
    const handleRouteChange = () => {
      // Save state on route change
      if (currentAssessmentId) {
        saveSessionState(currentAssessmentId, router.asPath);
        
        // If we have unsaved changes, save the assessment
        if (hasUnsavedChanges) {
          saveCurrentAssessment();
        }
      }
    };
    
    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    if (router && router.events) {
      router.events.on('routeChangeStart', handleRouteChange);
    }
    
    // Add listener for custom beforeunload event for forms
    const handleAppBeforeUnload = () => {
      if (currentAssessmentId) {
        saveCurrentAssessment();
      }
    };
    window.addEventListener('app-beforeunload', handleAppBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (router && router.events) {
        router.events.off('routeChangeStart', handleRouteChange);
      }
      window.removeEventListener('app-beforeunload', handleAppBeforeUnload);
    };
  }, [hasUnsavedChanges, currentAssessmentId, router]);
  
  // Auto-save effect when data changes
  useEffect(() => {
    if (!currentAssessmentId || !hasUnsavedChanges) return;
    
    const timeoutId = setTimeout(() => {
      setSaveStatus('saving');
      const success = saveCurrentAssessment();
      setSaveStatus(success ? 'success' : 'error');
      
      // Clear success status after 3 seconds
      if (success) {
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    }, autoSaveInterval);
    
    return () => clearTimeout(timeoutId);
  }, [currentAssessmentId, hasUnsavedChanges, autoSaveInterval]);
  
  // Function to check for changes
  const checkForChanges = useCallback((newData: AssessmentData) => {
    try {
      const currentDataString = JSON.stringify(newData);
      const hasChanges = currentDataString !== lastSavedData;
      setHasUnsavedChanges(hasChanges);
    } catch (error) {
      console.error("Error checking for changes:", error);
      setHasUnsavedChanges(true); // Assume changes if we can't compare
    }
  }, [lastSavedData]);

  const updateSection = useCallback((section: keyof AssessmentData, newData: any) => {
    console.log(`Updating section ${String(section)}`);
    
    // Check for nested structure issues and fix them
    let processedData = newData;
    
    if (section === 'typicalDay' && newData.typicalDay) {
      console.log("Fixed nested typicalDay structure");
      processedData = newData.typicalDay;
    }
    
    if (section === 'symptomsAssessment' && newData.symptomsAssessment) {
      console.log("Fixed nested symptomsAssessment structure");
      processedData = newData.symptomsAssessment;
    }
    
    setData(prev => {
      const updated = {
        ...prev,
        [section]: processedData
      };
      
      checkForChanges(updated);
      return updated;
    });
    
    // Set save status to indicate pending save
    setSaveStatus('saving');
    
    // If we have a current assessment ID, update the section in storage
    if (currentAssessmentId) {
      try {
        const result = updateAssessmentSection(currentAssessmentId, section.toString(), processedData);
        
        if (result.success) {
          setLastSaved(new Date());
          setSaveStatus('success');
          // Update the lastSavedData to prevent unnecessary saves
          setData(prev => {
            const updated = { ...prev, [section]: processedData };
            setLastSavedData(JSON.stringify(updated));
            setHasUnsavedChanges(false);
            
            // Clear success status after 3 seconds
            setTimeout(() => setSaveStatus('idle'), 3000);
            
            return updated;
          });
        } else {
          console.error(`Error updating section ${String(section)}:`, result.error);
          setSaveStatus('error');
        }
      } catch (error) {
        console.error(`Error updating section ${String(section)}:`, error);
        setSaveStatus('error');
      }
    }
  }, [currentAssessmentId, checkForChanges]);

  // Special handler for referral data that includes processing and mapping
  const updateReferral = useCallback((referralData: any) => {
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
  }, [data, updateSection]);

  const setAssessmentData = useCallback((newData: AssessmentData) => {
    console.log("Setting complete assessment data");
    setSaveStatus('saving');
    
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
        assessmentDate: new Date().toISOString(),
        version: '1.0'
      };
    }
    
    setData(fixedData);
    checkForChanges(fixedData);
    
    // If we have a current assessment ID, save the entire assessment
    if (currentAssessmentId) {
      try {
        const result = saveAssessment(currentAssessmentId, fixedData);
        
        if (result.success) {
          setLastSavedData(JSON.stringify(fixedData));
          setHasUnsavedChanges(false);
          setLastSaved(new Date());
          setSaveStatus('success');
          
          // Clear success status after 3 seconds
          setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
          console.error("Error saving assessment data:", result.error);
          setSaveStatus('error');
        }
      } catch (error) {
        console.error("Error saving assessment data:", error);
        setSaveStatus('error');
      }
    }
  }, [currentAssessmentId, checkForChanges]);
  
  const saveCurrentAssessment = useCallback(() => {
    if (!currentAssessmentId) {
      console.error("Cannot save: No current assessment ID");
      return false;
    }
    
    try {
      setSaveStatus('saving');
      
      // Ensure we have metadata with updated lastSaved timestamp
      const assessmentToSave = {
        ...data,
        metadata: {
          ...(data.metadata || {}),
          id: currentAssessmentId,
          lastSaved: new Date().toISOString(),
          assessmentDate: data.metadata?.assessmentDate || new Date().toISOString(),
          version: '1.0'
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
      
      const result = saveAssessment(currentAssessmentId, assessmentToSave);
      
      if (result.success) {
        setLastSavedData(JSON.stringify(assessmentToSave));
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        setSaveStatus('success');
        
        // Force a context update to ensure components see the latest data
        setData({...assessmentToSave});
        
        console.log("Assessment saved successfully");
        
        // Clear success status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
        
        return true;
      } else {
        console.error("Failed to save assessment:", result.error);
        setSaveStatus('error');
        return false;
      }
    } catch (error) {
      console.error("Error in saveCurrentAssessment:", error);
      setSaveStatus('error');
      return false;
    }
  }, [currentAssessmentId, data]);
  
  const loadAssessmentById = useCallback((assessmentId: string) => {
    try {
      setIsLoading(true);
      setSaveStatus('idle');
      
      const result = loadAssessment(assessmentId);
      
      if (!result.success || !result.data) {
        console.error(`Failed to load assessment with ID: ${assessmentId}`);
        setIsLoading(false);
        return false;
      }
      
      setData(result.data);
      setCurrentAssessmentId(assessmentId);
      setLastSavedData(JSON.stringify(result.data));
      setHasUnsavedChanges(false);
      setLastSaved(new Date(result.data.metadata?.lastSaved || new Date().toISOString()));
      
      console.log(`Assessment ${assessmentId} loaded successfully`);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error(`Error loading assessment ${assessmentId}:`, error);
      setIsLoading(false);
      return false;
    }
  }, []);
  
  const createAssessment = useCallback(() => {
    try {
      setIsLoading(true);
      // Save any existing assessment first
      if (currentAssessmentId && hasUnsavedChanges) {
        saveCurrentAssessment();
      }
      
      // Create a new assessment
      const result = createNewAssessment();
      
      if (!result.success || !result.id) {
        console.error("Failed to create new assessment");
        setIsLoading(false);
        return "";
      }
      
      const newAssessmentId = result.id;
      setCurrentAssessmentId(newAssessmentId);
      
      // Reset the form
      const initialData = {
        metadata: {
          id: newAssessmentId,
          created: new Date().toISOString(),
          lastSaved: new Date().toISOString(),
          assessmentDate: new Date().toISOString(),
          version: '1.0'
        }
      };
      
      setData(initialData);
      setLastSavedData(JSON.stringify(initialData));
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      setSaveStatus('idle');
      setIsLoading(false);
      
      return newAssessmentId;
    } catch (error) {
      console.error("Error creating new assessment:", error);
      setIsLoading(false);
      return "";
    }
  }, [currentAssessmentId, hasUnsavedChanges, saveCurrentAssessment]);
  
  // Functions for session recovery
  const checkForRecovery = useCallback(() => {
    try {
      const lastSession = getLastSessionState();
      
      if (!lastSession.success || !lastSession.data) {
        return { hasRecovery: false, assessmentId: null, route: null };
      }
      
      const { assessmentId, route, timestamp } = lastSession.data;
      
      // Check if the session is recent (less than 24 hours old)
      const sessionTime = new Date(timestamp).getTime();
      const currentTime = new Date().getTime();
      const hoursDiff = (currentTime - sessionTime) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        clearLastSessionState();
        return { hasRecovery: false, assessmentId: null, route: null };
      }
      
      return {
        hasRecovery: true,
        assessmentId,
        route
      };
    } catch (error) {
      console.error("Error checking for recovery:", error);
      return { hasRecovery: false, assessmentId: null, route: null };
    }
  }, []);
  
  const recoverSession = useCallback((assessmentId: string) => {
    try {
      const success = loadAssessmentById(assessmentId);
      
      if (success) {
        // Get the route from the session
        const lastSession = getLastSessionState();
        
        if (lastSession.success && lastSession.data && lastSession.data.route) {
          // We'll let the calling component handle navigation
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error recovering session:", error);
      return false;
    }
  }, [loadAssessmentById]);
  
  const dismissRecovery = useCallback(() => {
    clearLastSessionState();
  }, []);

  // Create the standard context value for compatibility
  const standardContextValue = {
    data,
    currentAssessmentId,
    updateSection,
    setAssessmentData,
    updateReferral,
    saveCurrentAssessment,
    loadAssessmentById,
    createAssessment,
    hasUnsavedChanges
  };

  // Create the enhanced context value
  const enhancedContextValue = {
    data,
    currentAssessmentId,
    updateSection,
    setAssessmentData,
    updateReferral,
    saveCurrentAssessment,
    loadAssessmentById,
    createAssessment,
    hasUnsavedChanges,
    saveStatus,
    lastSaved,
    setAutoSaveInterval,
    checkForRecovery,
    recoverSession,
    dismissRecovery,
    isLoading
  };

  return (
    // Provide both contexts to ensure compatibility with existing code
    <AssessmentContext.Provider value={standardContextValue}>
      <EnhancedAssessmentContext.Provider value={enhancedContextValue}>
        {children}
      </EnhancedAssessmentContext.Provider>
    </AssessmentContext.Provider>
  );
}

// Export original AssessmentContext hooks for compatibility with existing components
export const useAssessmentContext = () => {
  const context = React.useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessmentContext must be used within an EnhancedAssessmentProvider');
  }
  return context;
};

// Export enhanced assessment hook for new components
export function useEnhancedAssessment() {
  const context = React.useContext(EnhancedAssessmentContext);
  if (context === undefined) {
    throw new Error('useEnhancedAssessment must be used within an EnhancedAssessmentProvider');
  }
  return context;
}
