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

  const updateSection = (section: keyof AssessmentData, newData: any) => {
    console.log(`[DEBUG] Updating section ${section}:`, newData);
    setData(prev => {
      const updated = {
        ...prev,
        [section]: newData
      };
      console.log(`[DEBUG] Updated data:`, updated);
      return updated;
    });
  };

  const setAssessmentData = (newData: AssessmentData) => {
    console.log("[DEBUG] Setting assessment data:", newData);
    
    // Check medical history specifically
    if (newData.medicalHistory) {
      console.log("[DEBUG] Medical History data:", newData.medicalHistory);
      console.log("[DEBUG] Medical History conditions:", 
        newData.medicalHistory.pastMedicalHistory?.conditions || "No conditions found");
    }
    
    // Check symptoms assessment specifically
    if (newData.symptomsAssessment) {
      console.log("[DEBUG] Symptoms Assessment data:", newData.symptomsAssessment);
      console.log("[DEBUG] Emotional symptoms:", 
        newData.symptomsAssessment.emotionalSymptoms || "No emotional symptoms found");
    }
    
    // Check typical day specifically
    if (newData.typicalDay) {
      console.log("[DEBUG] Typical Day data:", newData.typicalDay);
      console.log("[DEBUG] Morning routine:", 
        newData.typicalDay.morningRoutine || "No morning routine found");
    }
    
    setData(newData);
    console.log("[DEBUG] Assessment data loaded successfully");
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
