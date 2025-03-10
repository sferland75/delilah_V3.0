'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export default function ManualMuscleContent() {
  try {
    // Safely access form context with error handling
    const form = useFormContext();
    
    if (!form) {
      return (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
          <InfoIcon className="h-4 w-4 text-red-800" />
          <AlertDescription>
            Form context is missing. Please ensure this component is used within a FormProvider.
          </AlertDescription>
        </Alert>
      );
    }
    
    const { getValues, reset } = form;
    
    if (!getValues || !reset) {
      return (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
          <InfoIcon className="h-4 w-4 text-red-800" />
          <AlertDescription>
            Form control functions are missing. Please ensure the form context is properly initialized.
          </AlertDescription>
        </Alert>
      );
    }
    
    // Create a local state to manage the component data
    const [localData, setLocalData] = useState({});
    
    // Initialize from form values
    useEffect(() => {
      try {
        // Get the current form values
        const formValues = getValues();
        if (formValues?.data?.manualMuscle) {
          setLocalData(formValues.data.manualMuscle);
        }
      } catch (error) {
        console.error("Error initializing ManualMuscle component:", error);
        setLocalData({});
      }
    }, [getValues]);
    
    const muscleGroups = [
      {
        group: 'shoulder',
        title: 'Shoulder',
        muscles: [
          { name: 'flexion', label: 'Flexion' },
          { name: 'extension', label: 'Extension' },
          { name: 'abduction', label: 'Abduction' },
          { name: 'adduction', label: 'Adduction' },
          { name: 'internalRotation', label: 'Internal Rotation' },
          { name: 'externalRotation', label: 'External Rotation' }
        ]
      },
      {
        group: 'elbow',
        title: 'Elbow',
        muscles: [
          { name: 'flexion', label: 'Flexion' },
          { name: 'extension', label: 'Extension' },
          { name: 'pronation', label: 'Pronation' },
          { name: 'supination', label: 'Supination' }
        ]
      },
      {
        group: 'wrist',
        title: 'Wrist',
        muscles: [
          { name: 'flexion', label: 'Flexion' },
          { name: 'extension', label: 'Extension' },
          { name: 'radialDeviation', label: 'Radial Deviation' },
          { name: 'ulnarDeviation', label: 'Ulnar Deviation' }
        ]
      },
      {
        group: 'hand',
        title: 'Hand & Fingers',
        muscles: [
          { name: 'gripStrength', label: 'Grip Strength' },
          { name: 'pinchStrength', label: 'Pinch Strength' },
          { name: 'fingerFlexion', label: 'Finger Flexion' },
          { name: 'fingerExtension', label: 'Finger Extension' },
          { name: 'thumbOpposition', label: 'Thumb Opposition' }
        ]
      },
      {
        group: 'hip',
        title: 'Hip',
        muscles: [
          { name: 'flexion', label: 'Flexion' },
          { name: 'extension', label: 'Extension' },
          { name: 'abduction', label: 'Abduction' },
          { name: 'adduction', label: 'Adduction' },
          { name: 'internalRotation', label: 'Internal Rotation' },
          { name: 'externalRotation', label: 'External Rotation' }
        ]
      },
      {
        group: 'knee',
        title: 'Knee',
        muscles: [
          { name: 'flexion', label: 'Flexion' },
          { name: 'extension', label: 'Extension' }
        ]
      },
      {
        group: 'ankle',
        title: 'Ankle & Foot',
        muscles: [
          { name: 'dorsiflexion', label: 'Dorsiflexion' },
          { name: 'plantarflexion', label: 'Plantarflexion' },
          { name: 'inversion', label: 'Inversion' },
          { name: 'eversion', label: 'Eversion' },
          { name: 'toeFlexion', label: 'Toe Flexion' },
          { name: 'toeExtension', label: 'Toe Extension' }
        ]
      },
      {
        group: 'trunk',
        title: 'Trunk & Core',
        muscles: [
          { name: 'flexion', label: 'Trunk Flexion' },
          { name: 'extension', label: 'Trunk Extension' },
          { name: 'rotation', label: 'Trunk Rotation' },
          { name: 'lateralFlexion', label: 'Lateral Flexion' }
        ]
      }
    ];

    // Function to safely update form data without direct mutation
    const updateFormData = (path, value) => {
      try {
        // Create a new form values object by cloning the current values
        const currentValues = getValues();
        const newValues = JSON.parse(JSON.stringify(currentValues));
        
        // Ensure data object exists
        if (!newValues.data) {
          newValues.data = {};
        }
        
        // Ensure manualMuscle object exists
        if (!newValues.data.manualMuscle) {
          newValues.data.manualMuscle = {};
        }
        
        // Parse the path and update the value
        const pathParts = path.split('.');
        let current = newValues;
        
        // Navigate to the parent object
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        
        // Set the value on the last part
        current[pathParts[pathParts.length - 1]] = value;
        
        // Update the form with the modified values
        reset(newValues, { keepDirty: true });
        
        // Also update our local state
        setLocalData(newValues.data.manualMuscle);
      } catch (error) {
        console.error(`Error updating form data at path ${path}:`, error);
      }
    };

    // Manual muscle test grading scale
    const mmtGrades = [
      { value: '0', label: '0 - No contraction' },
      { value: '1', label: '1 - Trace contraction' },
      { value: '2-', label: '2- - Partial movement with gravity eliminated' },
      { value: '2', label: '2 - Full movement with gravity eliminated' },
      { value: '2+', label: '2+ - Partial movement against gravity' },
      { value: '3-', label: '3- - Moves against gravity, partial range' },
      { value: '3', label: '3 - Moves against gravity, full range' },
      { value: '3+', label: '3+ - Completes range against mild resistance' },
      { value: '4-', label: '4- - Completes range against moderate resistance' },
      { value: '4', label: '4 - Completes range against strong resistance' },
      { value: '4+', label: '4+ - Completes range against very strong resistance' },
      { value: '5', label: '5 - Normal strength' }
    ];

    // Safe access to localData
    const getSafeValue = (path, defaultValue = null) => {
      try {
        const parts = path.split('.');
        let current = localData;
        
        for (const part of parts) {
          if (current === undefined || current === null) {
            return defaultValue;
          }
          current = current[part];
        }
        
        return current !== undefined ? current : defaultValue;
      } catch (error) {
        console.error(`Error accessing path ${path} in localData:`, error);
        return defaultValue;
      }
    };

    return (
      <div className="space-y-8">
        <div className="bg-blue-50 rounded-md p-4 mb-6">
          <h3 className="font-semibold text-lg mb-2">Manual Muscle Testing Grade Scale</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
            {mmtGrades.map((grade) => (
              <li key={grade.value} className="flex items-center space-x-1">
                <span className="font-semibold">{grade.value}:</span>
                <span>{grade.label.substring(grade.label.indexOf('-') + 2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {muscleGroups.map((muscleGroup) => {
          const groupKey = `data.manualMuscle.${muscleGroup.group}`;
          const isExpanded = getSafeValue(`${muscleGroup.group}.isExpanded`, false);
          const checkboxId = `${groupKey}.isExpanded`;
          
          return (
            <ErrorBoundary key={muscleGroup.group}>
              <div className="border rounded-md p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex flex-row items-center space-x-2">
                    <input 
                      type="checkbox"
                      id={checkboxId}
                      checked={isExpanded}
                      onChange={(e) => updateFormData(`${groupKey}.isExpanded`, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-0.5">
                      <label htmlFor={checkboxId} className="text-lg font-semibold">
                        {muscleGroup.title}
                      </label>
                      <p className="text-sm text-gray-500">
                        Check to assess this muscle group
                      </p>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {muscleGroup.muscles.map((muscle) => {
                        const musclePath = `${muscleGroup.group}.${muscle.name}`;
                        const rightValue = getSafeValue(`${musclePath}.right`, '5');
                        const leftValue = getSafeValue(`${musclePath}.left`, '5');
                        const isPainWithResistance = getSafeValue(`${musclePath}.painWithResistance`, false);
                        const notes = getSafeValue(`${musclePath}.notes`, '');
                        
                        const rightPath = `${groupKey}.${muscle.name}.right`;
                        const leftPath = `${groupKey}.${muscle.name}.left`;
                        const painPath = `${groupKey}.${muscle.name}.painWithResistance`;
                        const notesPath = `${groupKey}.${muscle.name}.notes`;
                        
                        return (
                          <div key={muscle.name} className="border rounded-md p-3">
                            <h4 className="font-medium mb-3">{muscle.label}</h4>
                            
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="text-sm block mb-2">Right Side</label>
                                <select 
                                  value={rightValue}
                                  onChange={(e) => updateFormData(rightPath, e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                  {mmtGrades.map((grade) => (
                                    <option key={grade.value} value={grade.value}>
                                      {grade.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="text-sm block mb-2">Left Side</label>
                                <select 
                                  value={leftValue}
                                  onChange={(e) => updateFormData(leftPath, e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                  {mmtGrades.map((grade) => (
                                    <option key={grade.value} value={grade.value}>
                                      {grade.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-2">
                              <input
                                type="checkbox"
                                id={painPath}
                                checked={isPainWithResistance}
                                onChange={(e) => updateFormData(painPath, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor={painPath} className="text-sm font-normal">
                                Pain With Resistance
                              </label>
                            </div>
                            
                            <div>
                              <label htmlFor={notesPath} className="text-sm block mb-2">Notes</label>
                              <textarea
                                id={notesPath}
                                value={notes}
                                onChange={(e) => updateFormData(notesPath, e.target.value)}
                                placeholder="Additional observations..."
                                className="min-h-[60px] text-sm w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor={`${groupKey}.generalNotes`} className="font-medium block mb-2">
                        General Notes for {muscleGroup.title}
                      </label>
                      <textarea
                        id={`${groupKey}.generalNotes`}
                        value={getSafeValue(`${muscleGroup.group}.generalNotes`, '')}
                        onChange={(e) => updateFormData(`${groupKey}.generalNotes`, e.target.value)}
                        placeholder="Add general observations for this muscle group..."
                        className="min-h-[100px] w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            </ErrorBoundary>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error("Error rendering ManualMuscle component:", error);
    return (
      <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
        <InfoIcon className="h-4 w-4 text-red-800" />
        <AlertDescription>
          An error occurred while rendering the Manual Muscle Testing component. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }
}