'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

// Simple fallback component that will work in all cases and allows expansion
export function SimpleRangeOfMotion() {
  // Local state to manage expanded regions
  const [expandedRegions, setExpandedRegions] = useState({});
  
  // Toggle a region's expanded state
  const toggleRegion = (region) => {
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };
  
  // Check if a region is expanded
  const isExpanded = (region) => expandedRegions[region] || false;
  
  return (
    <div className="space-y-8">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Range of Motion Assessment</h3>
        <p className="text-sm text-blue-700 mt-1">
          This section allows you to record range of motion measurements for different body regions.
        </p>
      </div>
      
      {['Cervical Spine', 'Shoulder', 'Elbow', 'Wrist', 'Thoracic & Lumbar Spine'].map((region) => (
        <div key={region} className="border rounded-md p-4">
          <div className="flex items-center space-x-2 mb-4">
            <input 
              type="checkbox"
              id={`region-${region}`}
              checked={isExpanded(region)}
              onChange={() => toggleRegion(region)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="space-y-0.5">
              <label htmlFor={`region-${region}`} className="text-lg font-semibold">
                {region}
              </label>
              <p className="text-sm text-gray-500">
                Check to record measurements for this region
              </p>
            </div>
          </div>
          
          {isExpanded(region) && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Flexion', 'Extension', 'Rotation Left', 'Rotation Right'].map(movement => (
                  <div key={movement} className="border rounded p-3">
                    <label className="block font-medium mb-2">{movement}</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Degrees"
                        className="w-full p-2 border rounded-md"
                      />
                      <span className="text-sm">°</span>
                    </div>
                    <div className="mt-2">
                      <label className="text-sm block mb-1">Limitation Type</label>
                      <select className="w-full rounded-md border p-2 text-sm">
                        <option value="">None</option>
                        <option value="pain">Pain Limited</option>
                        <option value="mechanical">Mechanically Limited</option>
                        <option value="weakness">Weakness Limited</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block font-medium mb-1">Notes for {region}</label>
                <textarea
                  placeholder="Add clinical observations or notes..."
                  className="w-full p-2 border rounded-md min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="mt-6 border-t pt-4">
        <label className="block text-lg font-medium mb-1">General ROM Assessment Notes</label>
        <textarea
          className="w-full p-2 border rounded-md min-h-[120px]"
          placeholder="Enter overall findings, patterns, or compensatory movements observed..."
        />
      </div>
    </div>
  );
}

export default SimpleRangeOfMotion;