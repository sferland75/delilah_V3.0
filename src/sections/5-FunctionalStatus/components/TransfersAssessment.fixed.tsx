'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function TransfersAssessment() {
  const form = useFormContext();
  
  if (!form) {
    return (
      <div className="p-4 border rounded-md bg-red-50 text-red-500">
        Form context is missing. Please ensure this component is used within a FormProvider.
      </div>
    );
  }
  
  const { setValue, watch } = form;
  
  // Basic transfers
  const basicTransfers = [
    { id: 'bedMobility', title: 'Bed Mobility', description: 'Rolling, scooting, bridging in bed' },
    { id: 'supineToSit', title: 'Supine to Sit', description: 'Moving from lying to sitting position' },
    { id: 'sitToStand', title: 'Sit to Stand', description: 'Rising from sitting to standing' },
    { id: 'standToSit', title: 'Stand to Sit', description: 'Controlled lowering to sitting position' }
  ];
  
  // Functional transfers
  const functionalTransfers = [
    { id: 'chairToChair', title: 'Chair to Chair Transfer', description: 'Moving between two chairs/surfaces' },
    { id: 'toiletTransfer', title: 'Toilet Transfer', description: 'Transfers to/from toilet' },
    { id: 'carTransfer', title: 'Car Transfer', description: 'Entering/exiting a vehicle' },
    { id: 'tub', title: 'Tub/Shower Transfer', description: 'Entering/exiting tub or shower' }
  ];
  
  // Specialty transfers
  const specialtyTransfers = [
    { id: 'floorToChair', title: 'Floor to Chair', description: 'Rising from floor to chair' },
    { id: 'bedToWC', title: 'Bed to Wheelchair', description: 'Transfer between bed and wheelchair' },
    { id: 'slidingBoard', title: 'Sliding Board Transfer', description: 'Using a sliding board for transfers' },
    { id: 'dependentLift', title: 'Dependent Lift Transfer', description: 'Transfer using mechanical lift' }
  ];
  
  // Transfer independence levels
  const independenceLevels = [
    { value: 'independent', label: 'Independent - Requires no assistance or supervision' },
    { value: 'setup', label: 'Setup Only - Needs equipment setup but performs transfer independently' },
    { value: 'supervision', label: 'Supervision - Requires standby supervision/verbal cueing' },
    { value: 'minimalAssist', label: 'Minimal Assist (25%) - Requires minimal physical assistance' },
    { value: 'moderateAssist', label: 'Moderate Assist (50%) - Requires moderate physical assistance' },
    { value: 'maximalAssist', label: 'Maximal Assist (75%) - Performs some elements but requires significant assistance' },
    { value: 'dependent', label: 'Dependent (100%) - Unable to participate or requires total assistance' },
    { value: 'notAssessed', label: 'Not Assessed - Transfer not evaluated' }
  ];
  
  // Common limiting factors
  const limitingFactors = [
    { id: 'pain', label: 'Pain' },
    { id: 'strength', label: 'Decreased Strength' },
    { id: 'balance', label: 'Poor Balance' },
    { id: 'coordination', label: 'Impaired Coordination' },
    { id: 'endurance', label: 'Limited Endurance' },
    { id: 'cognition', label: 'Cognitive Impairment' },
    { id: 'fear', label: 'Fear/Anxiety' },
    { id: 'rangeOfMotion', label: 'Limited Range of Motion' }
  ];

  const renderTransferCategory = (category, title, items) => {
    const isExpanded = watch(`data.transfers.${category}.isExpanded`);
    const checkboxId = `data.transfers.${category}.isExpanded`;
    
    return (
      <Card className="mb-6 border">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={checkboxId}
              checked={isExpanded || false}
              onChange={(e) => setValue(`data.transfers.${category}.isExpanded`, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Check to assess this category of transfers
          </p>
        </CardHeader>
        
        {isExpanded && (
          <CardContent>
            <div className="space-y-6">
              {items.map((item) => {
                const itemPath = `data.transfers.${category}.${item.id}`;
                
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
                        <label htmlFor={`${itemPath}.independence`} className="block mb-2">Level of Independence</label>
                        <select 
                          id={`${itemPath}.independence`}
                          value={watch(`${itemPath}.independence`) || ''}
                          onChange={(e) => setValue(`${itemPath}.independence`, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select level</option>
                          {independenceLevels.map((level) => (
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
                      
                      <div>
                        <label htmlFor={`${itemPath}.assistiveDevice`} className="block mb-2">
                          Assistive Device / Equipment Needed
                        </label>
                        <input 
                          type="text"
                          id={`${itemPath}.assistiveDevice`}
                          value={watch(`${itemPath}.assistiveDevice`) || ''}
                          onChange={(e) => setValue(`${itemPath}.assistiveDevice`, e.target.value)}
                          placeholder="e.g., grab bars, transfer board, etc."
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`${itemPath}.assistRequired`} className="block mb-2">
                          Assistance Required
                        </label>
                        <input 
                          type="text"
                          id={`${itemPath}.assistRequired`}
                          value={watch(`${itemPath}.assistRequired`) || ''}
                          onChange={(e) => setValue(`${itemPath}.assistRequired`, e.target.value)}
                          placeholder="Describe number of assistants and type of assistance"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`${itemPath}.notes`} className="block mb-2">Notes</label>
                        <textarea
                          id={`${itemPath}.notes`}
                          value={watch(`${itemPath}.notes`) || ''}
                          onChange={(e) => setValue(`${itemPath}.notes`, e.target.value)}
                          placeholder="Technique used, safety concerns, etc."
                          className="min-h-[80px] w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div>
                <label htmlFor={`data.transfers.${category}.generalNotes`} className="block font-medium mb-2">
                  General Notes for {title}
                </label>
                <textarea
                  id={`data.transfers.${category}.generalNotes`}
                  value={watch(`data.transfers.${category}.generalNotes`) || ''}
                  onChange={(e) => setValue(`data.transfers.${category}.generalNotes`, e.target.value)}
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
        <h3 className="font-semibold text-lg mb-2">Transfers Assessment</h3>
        <p className="text-sm mb-1">This section assesses the client's ability to perform various transfers required for daily activities.</p>
        <p className="text-sm">Expand each category to document specific transfer abilities, limitations, and required assistance/equipment.</p>
      </div>
      
      {renderTransferCategory('basic', 'Basic Bed & Chair Transfers', basicTransfers)}
      {renderTransferCategory('functional', 'Functional Transfers', functionalTransfers)}
      {renderTransferCategory('specialty', 'Specialty Transfers', specialtyTransfers)}
    </div>
  );
}