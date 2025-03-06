'use client';

import React from 'react';
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
  
  const { setValue, watch } = form;
  
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

  const renderPostureCategory = (category, title, items) => {
    const isExpanded = watch(`data.posturalTolerances.${category}.isExpanded`);
    const checkboxId = `data.posturalTolerances.${category}.isExpanded`;
    
    return (
      <Card className="mb-6 border">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={checkboxId}
              checked={isExpanded || false}
              onChange={(e) => setValue(`data.posturalTolerances.${category}.isExpanded`, e.target.checked)}
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
                const itemPath = `data.posturalTolerances.${category}.${item.id}`;
                
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
                        <label htmlFor={`${itemPath}.toleranceLevel`} className="block mb-2">Tolerance Level</label>
                        <select 
                          id={`${itemPath}.toleranceLevel`}
                          value={watch(`${itemPath}.toleranceLevel`) || ''}
                          onChange={(e) => setValue(`${itemPath}.toleranceLevel`, e.target.value)}
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
                            const factorId = `${itemPath}.limitingFactors.${factor.id}`;
                            return (
                              <div key={factor.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={factorId}
                                  checked={watch(factorId) || false}
                                  onChange={(e) => setValue(factorId, e.target.checked)}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={factorId} className="text-sm font-normal">
                                  {factor.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`${itemPath}.duration`} className="block mb-2">Duration</label>
                          <input 
                            type="text"
                            id={`${itemPath}.duration`}
                            value={watch(`${itemPath}.duration`) || ''}
                            onChange={(e) => setValue(`${itemPath}.duration`, e.target.value)}
                            placeholder="Enter duration"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`${itemPath}.unit`} className="block mb-2">Unit</label>
                          <select 
                            id={`${itemPath}.unit`}
                            value={watch(`${itemPath}.unit`) || ''}
                            onChange={(e) => setValue(`${itemPath}.unit`, e.target.value)}
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
                        <label htmlFor={`${itemPath}.assistiveDevice`} className="block mb-2">
                          Assistive Device / Modification Needed
                        </label>
                        <input 
                          type="text"
                          id={`${itemPath}.assistiveDevice`}
                          value={watch(`${itemPath}.assistiveDevice`) || ''}
                          onChange={(e) => setValue(`${itemPath}.assistiveDevice`, e.target.value)}
                          placeholder="e.g., walker, cane, chair modification, etc."
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`${itemPath}.notes`} className="block mb-2">Notes</label>
                        <textarea
                          id={`${itemPath}.notes`}
                          value={watch(`${itemPath}.notes`) || ''}
                          onChange={(e) => setValue(`${itemPath}.notes`, e.target.value)}
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
                  value={watch(`data.posturalTolerances.${category}.generalNotes`) || ''}
                  onChange={(e) => setValue(`data.posturalTolerances.${category}.generalNotes`, e.target.value)}
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