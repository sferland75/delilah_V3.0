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
  // Add other section data types as needed
}

interface AssessmentContextType {
  data: AssessmentData;
  updateSection: (section: keyof AssessmentData, data: any) => void;
  setAssessmentData: (data: AssessmentData) => void;
}

const AssessmentContext = React.createContext<AssessmentContextType>({
  data: {},
  updateSection: () => {},
  setAssessmentData: () => {},
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
    <AssessmentContext.Provider value={{ data, updateSection, setAssessmentData }}>
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
