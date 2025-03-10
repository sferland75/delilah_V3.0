'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export function SimplePosturalTolerances() {
  // Local state for tracking values
  const [toleranceValues, setToleranceValues] = useState({
    sitting: { level: '', duration: '', unit: 'minutes' },
    standing: { level: '', duration: '', unit: 'minutes' },
    walking: { level: '', duration: '', unit: 'minutes' },
    stairs: { level: '', flights: '', device: '' }
  });
  
  // Handle value changes
  const handleChange = (activity, field, value) => {
    setToleranceValues(prev => ({
      ...prev,
      [activity]: {
        ...prev[activity],
        [field]: value
      }
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Postural Tolerances Assessment</h3>
        <p className="text-sm text-blue-700 mt-1">
          This section evaluates the patient's ability to maintain static and dynamic postures.
        </p>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-semibold text-lg mb-4">Static Tolerances</h3>
        
        {/* Sitting Tolerance */}
        <div className="mb-6 pb-6 border-b">
          <h4 className="font-medium mb-3">Sitting Tolerance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tolerance Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={toleranceValues.sitting.level}
                onChange={(e) => handleChange('sitting', 'level', e.target.value)}
              >
                <option value="">Select level</option>
                <option value="normal">Normal</option>
                <option value="slightlyLimited">Slightly Limited</option>
                <option value="moderatelyLimited">Moderately Limited</option>
                <option value="severelyLimited">Severely Limited</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Duration</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter duration"
                min="0"
                value={toleranceValues.sitting.duration}
                onChange={(e) => handleChange('sitting', 'duration', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Unit</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={toleranceValues.sitting.unit}
                onChange={(e) => handleChange('sitting', 'unit', e.target.value)}
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Add observations about sitting tolerance..."
            />
          </div>
        </div>
        
        {/* Standing Tolerance */}
        <div>
          <h4 className="font-medium mb-3">Standing Tolerance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tolerance Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={toleranceValues.standing.level}
                onChange={(e) => handleChange('standing', 'level', e.target.value)}
              >
                <option value="">Select level</option>
                <option value="normal">Normal</option>
                <option value="slightlyLimited">Slightly Limited</option>
                <option value="moderatelyLimited">Moderately Limited</option>
                <option value="severelyLimited">Severely Limited</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Duration</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter duration"
                min="0"
                value={toleranceValues.standing.duration}
                onChange={(e) => handleChange('standing', 'duration', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Unit</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={toleranceValues.standing.unit}
                onChange={(e) => handleChange('standing', 'unit', e.target.value)}
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Add observations about standing tolerance..."
            />
          </div>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-semibold text-lg mb-4">Dynamic Tolerances</h3>
        
        {/* Walking Tolerance */}
        <div className="mb-6 pb-6 border-b">
          <h4 className="font-medium mb-3">Walking Tolerance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tolerance Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={toleranceValues.walking.level}
                onChange={(e) => handleChange('walking', 'level', e.target.value)}
              >
                <option value="">Select level</option>
                <option value="normal">Normal</option>
                <option value="slightlyLimited">Slightly Limited</option>
                <option value="moderatelyLimited">Moderately Limited</option>
                <option value="severelyLimited">Severely Limited</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Distance/Duration</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter value"
                min="0"
                value={toleranceValues.walking.duration}
                onChange={(e) => handleChange('walking', 'duration', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Unit</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={toleranceValues.walking.unit}
                onChange={(e) => handleChange('walking', 'unit', e.target.value)}
              >
                <option value="meters">Meters</option>
                <option value="minutes">Minutes</option>
                <option value="blocks">Blocks</option>
              </select>
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Add observations about walking tolerance..."
            />
          </div>
        </div>
        
        {/* Stairs Tolerance */}
        <div>
          <h4 className="font-medium mb-3">Stairs Tolerance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tolerance Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={toleranceValues.stairs.level}
                onChange={(e) => handleChange('stairs', 'level', e.target.value)}
              >
                <option value="">Select level</option>
                <option value="normal">Normal</option>
                <option value="slightlyLimited">Slightly Limited</option>
                <option value="moderatelyLimited">Moderately Limited</option>
                <option value="severelyLimited">Severely Limited</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Number of Flights</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-md" 
                placeholder="Enter number"
                min="0"
                value={toleranceValues.stairs.flights}
                onChange={(e) => handleChange('stairs', 'flights', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Assistive Device</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                placeholder="e.g., Handrail, Cane"
                value={toleranceValues.stairs.device}
                onChange={(e) => handleChange('stairs', 'device', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Add observations about stairs tolerance..."
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-t pt-4">
        <label className="block text-lg font-medium mb-1">General Postural Tolerance Notes</label>
        <textarea
          className="w-full p-2 border rounded-md min-h-[120px]"
          placeholder="Enter overall observations about postural tolerances..."
        />
      </div>
    </div>
  );
}

export default SimplePosturalTolerances;