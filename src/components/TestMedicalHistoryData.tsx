'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/AssessmentContext';

export default function TestMedicalHistoryData() {
  const { updateSection } = useAssessment();
  
  const addTestData = () => {
    // Create test medical history data in the correct format
    const medicalHistoryData = {
      pastMedicalHistory: {
        conditions: [
          {
            condition: "Hypertension",
            diagnosisDate: "2020-01-15",
            currentStatus: "Active",
            notes: "Controlled with medication"
          },
          {
            condition: "Type 2 Diabetes",
            diagnosisDate: "2019-06-10",
            currentStatus: "Active",
            notes: "Diet controlled"
          }
        ],
        surgeries: [
          {
            procedure: "Appendectomy",
            date: "2015-03-22",
            reason: "Acute appendicitis",
            complications: "None",
            notes: "Fully recovered"
          }
        ],
        medications: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            reason: "Hypertension",
            prescriber: "Dr. Smith",
            startDate: "2020-01-20",
            endDate: "",
            status: "current"
          }
        ],
        allergies: ["Penicillin", "Sulfa drugs"],
        preExistingConditions: "Patient has a history of hypertension and type 2 diabetes, both diagnosed prior to the accident."
      },
      
      // Add injury details
      injuryDetails: {
        diagnosisDate: "2024-01-15",
        mechanism: "Motor Vehicle Accident",
        description: "Patient was involved in a rear-end collision while stopped at a traffic light.",
        position: "Driver's seat, wearing seatbelt",
        time: "Approximately 2:30 PM",
        preparedForImpact: "No, impact was unexpected",
        immediateResponse: "Felt immediate pain in neck and upper back",
        vehicleDamage: "Moderate damage to rear bumper and trunk",
        subsequentCare: "Visited ER same day, referred to physical therapy",
        initialTreatment: "Pain medication and muscle relaxants prescribed in ER",
        complications: ["Neck pain", "Upper back pain", "Headaches"]
      },
      
      // Add treatment history
      treatmentHistory: {
        rehabilitationServices: [
          {
            type: "Physical Therapy",
            provider: "City Rehabilitation Center",
            facility: "City Rehabilitation Center",
            frequency: "3 times per week",
            startDate: "2024-01-20",
            endDate: "",
            goals: ["Reduce pain", "Improve range of motion", "Return to normal activities"]
          }
        ],
        hospitalizations: []
      }
    };
    
    // Update the context with medical history data
    updateSection('medicalHistory', medicalHistoryData);
    
    // Also add to pastMedicalHistory for the component to find
    updateSection('pastMedicalHistory', medicalHistoryData.pastMedicalHistory);
    
    alert("Test medical history data added to context!");
  };
  
  return (
    <div className="p-4">
      <Button onClick={addTestData}>Add Test Medical History Data</Button>
    </div>
  );
}
