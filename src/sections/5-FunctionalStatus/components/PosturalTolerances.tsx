'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function PosturalTolerances() {
  const form = useFormContext();
  
  if (!form) {
    return (
      <div className="p-4 border rounded-md bg-red-50 text-red-500">
        Form context is missing. Please ensure this component is used within a FormProvider.
      </div>
    );
  }
  
  const { getValues, watch, register } = form;
  
  // Create a local state to manage the component data
  const [localData, setLocalData] = useState({});
  
  // Initialize from form values
  useEffect(() => {
    // Get the current form values
    const formValues = getValues();
    if (formValues?.data?.posturalTolerances) {
      setLocalData(formValues.data.posturalTolerances);
    }
  }, [getValues]);
  
  // Basic static postures
  const staticPostures = [
    { id: 'sitting', title: 'Sitting', description: 'Ability to maintain seated position' },
    { id: 'standing', title: 'Standing', description: 'Ability to maintain standing position' },
    { id: 'squatting', title: 'Squatting', description: 'Ability to maintain squatting position' },
    { id: 'kneeling', title: 'Kneeling', description: 'Ability to maintain kneeling position' }
  ];
  
  // Complex dynamic postures
  const dynamicPostures = [
    { id: 'walking', title: 'Walking', description: 'Ability to walk on level surfaces' },
    { id: 'stairClimbing', title: 'Stair Climbing', description: 'Ability to ascend/descend stairs' },
    { id: 'uneven', title: 'Uneven Surfaces', description: 'Ability to navigate uneven terrain' },
    { id: 'carrying', title: 'Carrying Objects', description: 'Ability to carry objects while walking' }
  ];
  
  // Positional changes
  const posturalTransitions = [
    { id: 'sitToStand', title: 'Sit to Stand', description: 'Ability to transition from sitting to standing' },
    { id: 'standToSit', title: 'Stand to Sit', description: 'Ability to transition from standing to sitting' },
    { id: 'floorToStand', title: 'Floor to Stand', description: 'Ability to get up from the floor' },
    { id: 'supineToSit', title: 'Supine to Sit', description: 'Ability to move from lying to sitting' }
  ];
  
  // Common limiting factors
  const limitingFactors = [
    { id: 'pain', label: 'Pain' },
    { id: 'fatigue', label: 'Fatigue' },
    { id: 'weakness', label: 'Weakness' },
    { id: 'balance', label: 'Balance' },
    { id: 'endurance', label: 'Endurance' },
    { id: 'dizziness', label: 'Dizziness' },
    { id: 'breathlessness', label: 'Shortness of breath' },
    { id: 'fear', label: 'Fear/anxiety' }
  ];
  
  // Tolerance levels
  const toleranceLevels = [
    { value: 'normal', label: 'Normal - No limitations' },
    { value: 'mildlyLimited', label: 'Mildly Limited - Can maintain/perform for extended periods with minimal difficulty' },
    { value: 'moderatelyLimited', label: 'Moderately Limited - Can maintain/perform for moderate periods with some difficulty' },
    { value: 'severelyLimited', label: 'Severely Limited - Can only maintain/perform for brief periods with significant difficulty' },
    { value: 'unableToPerform', label: 'Unable to Perform - Cannot maintain/perform even with assistance' }
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
      
      // Ensure posturalTolerances object exists
      if (!newValues.data.posturalTolerances) {
        newValues.data.posturalTolerances = {};
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
      form.reset(newValues);
      
      // Also update our local state
      setLocalData(newValues.data.posturalTolerances);
    } catch (error) {
      console.error(`Error updating form data at path ${path}:`, error);
    }
  };

  const renderPostureCategory = (category, title, items) => {
    // Get the expanded state from local data
    const isExpanded = localData[category]?.isExpanded || false;
    const checkboxId = `data.posturalTolerances.${category}.isExpanded`;
    
    const handleExpandChange = (e) => {
      updateFormData(`data.posturalTolerances.${category}.isExpanded`, e.target.checked);
    };
    
    return (
      <Card className="mb-6 border">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={checkboxId}
              checked={isExpanded}
              onChange={handleExpandChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Check to assess this category of postural tolerance
          </p>
        </CardHeader>
        
        {isExpanded && (
          <CardContent>
            <div className="space-y-6">
              {items.map((item) => {
                const itemBasePath = `data.posturalTolerances.${category}.${item.id}`;
                
                // Get values from local data
                const itemData = localData[category]?.[item.id] || {};
                
                return (
                  <div key={item.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-md">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor={`${itemBasePath}.toleranceLevel`} className="block mb-2">Tolerance Level</label>
                        <select 
                          id={`${itemBasePath}.toleranceLevel`}
                          value={itemData.toleranceLevel || ''}
                          onChange={(e) => updateFormData(`${itemBasePath}.toleranceLevel`, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select tolerance level</option>
                          {toleranceLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block mb-1">Limiting Factors</label>
                        <div className="grid grid-cols-2 gap-2">
                          {limitingFactors.map((factor) => {
                            const factorPath = `${itemBasePath}.limitingFactors.${factor.id}`;
                            const isChecked = itemData.limitingFactors?.[factor.id] || false;
                            
                            return (
                              <div key={factor.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={factorPath}
                                  checked={isChecked}
                                  onChange={(e) => 
                                    updateFormData(factorPath, e.target.checked)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={factorPath} className="text-sm font-normal">
                                  {factor.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`${itemBasePath}.duration`} className="block mb-2">Duration</label>
                          <input 
                            type="text"
                            id={`${itemBasePath}.duration`}
                            value={itemData.duration || ''}
                            onChange={(e) => updateFormData(`${itemBasePath}.duration`, e.target.value)}
                            placeholder="Enter duration"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`${itemBasePath}.unit`} className="block mb-2">Unit</label>
                          <select 
                            id={`${itemBasePath}.unit`}
                            value={itemData.unit || ''}
                            onChange={(e) => updateFormData(`${itemBasePath}.unit`, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select unit</option>
                            <option value="seconds">Seconds</option>
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="repetitions">Repetitions</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor={`${itemBasePath}.assistiveDevice`} className="block mb-2">
                          Assistive Device / Modification Needed
                        </label>
                        <input 
                          type="text"
                          id={`${itemBasePath}.assistiveDevice`}
                          value={itemData.assistiveDevice || ''}
                          onChange={(e) => updateFormData(`${itemBasePath}.assistiveDevice`, e.target.value)}
                          placeholder="e.g., walker, cane, chair modification, etc."
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`${itemBasePath}.notes`} className="block mb-2">Notes</label>
                        <textarea
                          id={`${itemBasePath}.notes`}
                          value={itemData.notes || ''}
                          onChange={(e) => updateFormData(`${itemBasePath}.notes`, e.target.value)}
                          placeholder="Additional observations..."
                          className="min-h-[80px] w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div>
                <label htmlFor={`data.posturalTolerances.${category}.generalNotes`} className="block font-medium mb-2">
                  General Notes for {title}
                </label>
                <textarea
                  id={`data.posturalTolerances.${category}.generalNotes`}
                  value={localData[category]?.generalNotes || ''}
                  onChange={(e) => updateFormData(`data.posturalTolerances.${category}.generalNotes`, e.target.value)}
                  placeholder={`Add general observations about ${title.toLowerCase()}...`}
                  className="min-h-[100px] w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-md p-4 mb-6">
        <h3 className="font-semibold text-lg mb-2">Postural & Mobility Assessment</h3>
        <p className="text-sm mb-1">This section assesses the client's ability to maintain various postures and perform functional movements.</p>
        <p className="text-sm">Expand each category to document specific tolerances, limitations, and required accommodations.</p>
      </div>
      
      {renderPostureCategory('static', 'Static Postures', staticPostures)}
      {renderPostureCategory('dynamic', 'Dynamic Mobility', dynamicPostures)}
      {renderPostureCategory('transitions', 'Postural Transitions', posturalTransitions)}
    </div>
  );
}