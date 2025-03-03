"use client";

import React from 'react';

interface AssessmentData {
  demographics?: any;
  medicalHistory?: any;
  symptomsAssessment?: any;
  functionalStatus?: any;
  typicalDay?: any;
  environmentalAssessment?: any;
  activitiesDailyLiving?: any;
  attendantCare?: any;
  referral?: any; // Add referral data type
  purposeAndMethodology?: any; // For purpose section
  // Add other section data types as needed
}

interface AssessmentContextType {
  data: AssessmentData;
  updateSection: (section: keyof AssessmentData, data: any) => void;
  setAssessmentData: (data: AssessmentData) => void;
  updateReferral: (data: any) => void; // Add specific referral updater
}

const AssessmentContext = React.createContext<AssessmentContextType>({
  data: {},
  updateSection: () => {},
  setAssessmentData: () => {},
  updateReferral: () => {},
});

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<AssessmentData>({});

  console.log("*** ULTRA DEBUG *** AssessmentProvider initial data:", data);

  const updateSection = (section: keyof AssessmentData, newData: any) => {
    console.log(`*** ULTRA DEBUG *** updateSection called for ${section}:`, newData);
    
    // Check if the data is being structured correctly
    if (section === 'medicalHistory') {
      console.log("*** ULTRA DEBUG *** Medical History keys:", Object.keys(newData));
      if (newData.pastMedicalHistory) {
        console.log("*** ULTRA DEBUG *** Past Medical History conditions:", 
          newData.pastMedicalHistory.conditions || 'None found');
      } else {
        console.log("*** ULTRA DEBUG *** No pastMedicalHistory key!");
      }
    }
    
    // Check for nested structure issue (typicalDay: {typicalDay: {...}})
    if (section === 'typicalDay' && newData.typicalDay) {
      console.log("*** ULTRA DEBUG *** FOUND EXTRA NESTING IN typicalDay!");
      console.log("*** ULTRA DEBUG *** typicalDay structure:", Object.keys(newData));
      console.log("*** ULTRA DEBUG *** typicalDay.typicalDay structure:", Object.keys(newData.typicalDay));
      
      // Automatically fix the nesting issue
      console.log("*** ULTRA DEBUG *** Auto-fixing nested typicalDay structure");
      newData = newData.typicalDay;
      console.log("*** ULTRA DEBUG *** Fixed structure:", Object.keys(newData));
    }
    
    // Check for nested structure issue (symptomsAssessment: {symptomsAssessment: {...}})
    if (section === 'symptomsAssessment' && newData.symptomsAssessment) {
      console.log("*** ULTRA DEBUG *** FOUND EXTRA NESTING IN symptomsAssessment!");
      console.log("*** ULTRA DEBUG *** symptomsAssessment structure:", Object.keys(newData));
      console.log("*** ULTRA DEBUG *** symptomsAssessment.symptomsAssessment structure:", Object.keys(newData.symptomsAssessment));
      
      // Automatically fix the nesting issue
      console.log("*** ULTRA DEBUG *** Auto-fixing nested symptomsAssessment structure");
      newData = newData.symptomsAssessment;
      console.log("*** ULTRA DEBUG *** Fixed structure:", Object.keys(newData));
    }
    
    setData(prev => {
      const updated = {
        ...prev,
        [section]: newData
      };
      console.log(`*** ULTRA DEBUG *** Updated data after ${section} update:`, updated);
      return updated;
    });
  };

  // Special handler for referral data that includes processing and mapping
  const updateReferral = (referralData: any) => {
    console.log("*** ULTRA DEBUG *** updateReferral called with:", referralData);
    
    if (!referralData || !referralData.referral) {
      console.log("*** ULTRA DEBUG *** No valid referral data provided");
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
            console.log("*** ULTRA DEBUG *** Syncing client info to demographics:", demographicsData);
            // Only update demographics if we don't already have data
            if (!data.demographics || Object.keys(data.demographics).length === 0) {
              updateSection('demographics', demographicsData);
            }
          }
        }).catch(err => {
          console.error("*** ULTRA DEBUG *** Error importing referralMapper:", err);
        });
      } catch (error) {
        console.error("*** ULTRA DEBUG *** Error syncing client info to demographics:", error);
      }
    }
    
    // If the referral contains assessment requirements, we can update the purpose section
    if (referral.assessmentTypes || referral.specificRequirements || referral.domains) {
      try {
        // Import the mapper to extract assessment requirements
        import('@/services/referralMapper').then(({ getAssessmentRequirements }) => {
          const requirementsText = getAssessmentRequirements(referral);
          if (requirementsText) {
            console.log("*** ULTRA DEBUG *** Adding assessment requirements to purpose section");
            // We'll append this to any existing purpose data
            const purposeData = data.purposeAndMethodology || {};
            const updatedPurpose = {
              ...purposeData,
              referralRequirements: requirementsText
            };
            updateSection('purposeAndMethodology', updatedPurpose);
          }
        }).catch(err => {
          console.error("*** ULTRA DEBUG *** Error importing referralMapper:", err);
        });
      } catch (error) {
        console.error("*** ULTRA DEBUG *** Error adding requirements to purpose:", error);
      }
    }
  };

  const setAssessmentData = (newData: AssessmentData) => {
    console.log("*** ULTRA DEBUG *** setAssessmentData called with:", newData);
    
    // Deep log each section for debugging
    if (newData.medicalHistory) {
      console.log("*** ULTRA DEBUG *** Medical History:", newData.medicalHistory);
      if (newData.medicalHistory.pastMedicalHistory) {
        console.log("*** ULTRA DEBUG *** Past Medical History:", newData.medicalHistory.pastMedicalHistory);
        console.log("*** ULTRA DEBUG *** Conditions:", newData.medicalHistory.pastMedicalHistory.conditions);
      }
    } else {
      console.log("*** ULTRA DEBUG *** No Medical History found in data!");
    }
    
    if (newData.symptomsAssessment) {
      console.log("*** ULTRA DEBUG *** Symptoms Assessment:", newData.symptomsAssessment);
      console.log("*** ULTRA DEBUG *** Emotional Symptoms:", newData.symptomsAssessment.emotionalSymptoms);
    } else {
      console.log("*** ULTRA DEBUG *** No Symptoms Assessment found in data!");
    }
    
    if (newData.typicalDay) {
      console.log("*** ULTRA DEBUG *** Typical Day:", newData.typicalDay);
      console.log("*** ULTRA DEBUG *** Morning Routine:", newData.typicalDay.morningRoutine);
      
      // Check for nested typicalDay (common issue)
      if (newData.typicalDay.typicalDay) {
        console.log("*** ULTRA DEBUG *** NESTED typicalDay FOUND! This is likely causing issues.");
        console.log("*** ULTRA DEBUG *** Inner typicalDay:", newData.typicalDay.typicalDay);
      }
    } else {
      console.log("*** ULTRA DEBUG *** No Typical Day found in data!");
    }
    
    // Check for referral data
    if (newData.referral) {
      console.log("*** ULTRA DEBUG *** Referral data found:", newData.referral);
    }
    
    // Check all top-level keys
    console.log("*** ULTRA DEBUG *** All top-level keys:", Object.keys(newData));
    
    // Make sure the data is not nested incorrectly
    const fixedData = { ...newData };
    let anyFixes = false;
    
    // Check for double-nesting and fix
    if (fixedData.typicalDay && fixedData.typicalDay.typicalDay) {
      console.log("*** ULTRA DEBUG *** Fixing double-nested typicalDay");
      fixedData.typicalDay = fixedData.typicalDay.typicalDay;
      anyFixes = true;
    }
    
    if (fixedData.medicalHistory && fixedData.medicalHistory.medicalHistory) {
      console.log("*** ULTRA DEBUG *** Fixing double-nested medicalHistory");
      fixedData.medicalHistory = fixedData.medicalHistory.medicalHistory;
      anyFixes = true;
    }
    
    if (fixedData.symptomsAssessment && fixedData.symptomsAssessment.symptomsAssessment) {
      console.log("*** ULTRA DEBUG *** Fixing double-nested symptomsAssessment");
      fixedData.symptomsAssessment = fixedData.symptomsAssessment.symptomsAssessment;
      anyFixes = true;
    }
    
    if (anyFixes) {
      console.log("*** ULTRA DEBUG *** Fixed nested data structure:", fixedData);
      setData(fixedData);
    } else {
      setData(newData);
    }
    
    console.log("*** ULTRA DEBUG *** Assessment data loaded successfully");
  };

  return (
    <AssessmentContext.Provider value={{ data, updateSection, setAssessmentData, updateReferral }}>
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
