'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export function SimpleTransfersAssessment() {
  // Local state for form values
  const [transferValues, setTransferValues] = useState({
    bedMobility: { independence: '', assistiveDevice: '', notes: '' },
    sitToStand: { independence: '', assistiveDevice: '', notes: '' },
    chairToToilet: { independence: '', assistiveDevice: '', notes: '' },
    chairToBed: { independence: '', assistiveDevice: '', notes: '' },
    carTransfer: { independence: '', assistiveDevice: '', notes: '' }
  });
  
  // Handle value changes
  const handleChange = (transfer, field, value) => {
    setTransferValues(prev => ({
      ...prev,
      [transfer]: {
        ...prev[transfer],
        [field]: value
      }
    }));
  };
  
  // Independence level options
  const independenceLevels = [
    { value: 'independent', label: 'Independent' },
    { value: 'supervision', label: 'Supervision' },
    { value: 'setup', label: 'Setup' },
    { value: 'minimalAssist', label: 'Minimal Assist' },
    { value: 'moderateAssist', label: 'Moderate Assist' },
    { value: 'maximalAssist', label: 'Maximal Assist' },
    { value: 'dependent', label: 'Dependent' },
    { value: 'notAssessed', label: 'Not Assessed' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Transfers Assessment</h3>
        <p className="text-sm text-blue-700 mt-1">
          This section evaluates the patient's ability to transfer between different positions.
        </p>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-semibold text-lg mb-4">Basic Transfers</h3>
        
        {/* Bed Mobility */}
        <div className="mb-6 pb-6 border-b">
          <h4 className="font-medium mb-3">Bed Mobility</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Independence Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={transferValues.bedMobility.independence}
                onChange={(e) => handleChange('bedMobility', 'independence', e.target.value)}
              >
                <option value="">Select level</option>
                {independenceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Assistive Device</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter assistive device if any"
                value={transferValues.bedMobility.assistiveDevice}
                onChange={(e) => handleChange('bedMobility', 'assistiveDevice', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Add observations about bed mobility..."
              value={transferValues.bedMobility.notes}
              onChange={(e) => handleChange('bedMobility', 'notes', e.target.value)}
            />
          </div>
        </div>
        
        {/* Sit to Stand */}
        <div className="mb-6 pb-6 border-b">
          <h4 className="font-medium mb-3">Sit to Stand</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Independence Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={transferValues.sitToStand.independence}
                onChange={(e) => handleChange('sitToStand', 'independence', e.target.value)}
              >
                <option value="">Select level</option>
                {independenceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Assistive Device</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter assistive device if any"
                value={transferValues.sitToStand.assistiveDevice}
                onChange={(e) => handleChange('sitToStand', 'assistiveDevice', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Add observations about sit to stand transfer..."
              value={transferValues.sitToStand.notes}
              onChange={(e) => handleChange('sitToStand', 'notes', e.target.value)}
            />
          </div>
        </div>
        
        {/* Chair to Toilet */}
        <div>
          <h4 className="font-medium mb-3">Chair to Toilet</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Independence Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={transferValues.chairToToilet.independence}
                onChange={(e) => handleChange('chairToToilet', 'independence', e.target.value)}
              >
                <option value="">Select level</option>
                {independenceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Assistive Device</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter assistive device if any"
                value={transferValues.chairToToilet.assistiveDevice}
                onChange={(e) => handleChange('chairToToilet', 'assistiveDevice', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Add observations about chair to toilet transfer..."
              value={transferValues.chairToToilet.notes}
              onChange={(e) => handleChange('chairToToilet', 'notes', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-semibold text-lg mb-4">Functional Transfers</h3>
        
        {/* Chair to Bed */}
        <div className="mb-6 pb-6 border-b">
          <h4 className="font-medium mb-3">Chair to Bed</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Independence Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={transferValues.chairToBed.independence}
                onChange={(e) => handleChange('chairToBed', 'independence', e.target.value)}
              >
                <option value="">Select level</option>
                {independenceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Assistive Device</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter assistive device if any"
                value={transferValues.chairToBed.assistiveDevice}
                onChange={(e) => handleChange('chairToBed', 'assistiveDevice', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Add observations about chair to bed transfer..."
              value={transferValues.chairToBed.notes}
              onChange={(e) => handleChange('chairToBed', 'notes', e.target.value)}
            />
          </div>
        </div>
        
        {/* Car Transfer */}
        <div>
          <h4 className="font-medium mb-3">Car Transfer</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Independence Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={transferValues.carTransfer.independence}
                onChange={(e) => handleChange('carTransfer', 'independence', e.target.value)}
              >
                <option value="">Select level</option>
                {independenceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Assistive Device</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter assistive device if any"
                value={transferValues.carTransfer.assistiveDevice}
                onChange={(e) => handleChange('carTransfer', 'assistiveDevice', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Add observations about car transfer..."
              value={transferValues.carTransfer.notes}
              onChange={(e) => handleChange('carTransfer', 'notes', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-t pt-4">
        <label className="block text-lg font-medium mb-1">General Transfer Assessment Notes</label>
        <textarea
          className="w-full p-2 border rounded-md min-h-[120px]"
          placeholder="Enter overall observations about transfers and mobility..."
        />
      </div>
    </div>
  );
}

export default SimpleTransfersAssessment;