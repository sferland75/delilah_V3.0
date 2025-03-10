'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export function SimpleManualMuscle() {
  // Local state to manage expanded muscle groups
  const [expandedGroups, setExpandedGroups] = useState({});
  
  // Toggle a muscle group's expanded state
  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  // Check if a muscle group is expanded
  const isExpanded = (group) => expandedGroups[group] || false;
  
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Manual Muscle Testing</h3>
        <p className="text-sm text-blue-700 mt-1">
          This section allows you to record manual muscle testing results for different body regions.
        </p>
      </div>
      
      <div className="bg-blue-50 rounded-md p-4 mb-6">
        <h3 className="font-semibold text-lg mb-2">Manual Muscle Testing Grade Scale</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
          <li className="flex items-center space-x-1">
            <span className="font-semibold">0:</span>
            <span>No contraction</span>
          </li>
          <li className="flex items-center space-x-1">
            <span className="font-semibold">1:</span>
            <span>Trace contraction</span>
          </li>
          <li className="flex items-center space-x-1">
            <span className="font-semibold">2:</span>
            <span>Poor - Movement with gravity eliminated</span>
          </li>
          <li className="flex items-center space-x-1">
            <span className="font-semibold">3:</span>
            <span>Fair - Movement against gravity</span>
          </li>
          <li className="flex items-center space-x-1">
            <span className="font-semibold">4:</span>
            <span>Good - Movement against resistance</span>
          </li>
          <li className="flex items-center space-x-1">
            <span className="font-semibold">5:</span>
            <span>Normal strength</span>
          </li>
        </ul>
      </div>
      
      {/* Example muscle group boxes */}
      {["Shoulder", "Elbow", "Wrist", "Hip", "Knee", "Ankle"].map((group) => (
        <div key={group} className="border rounded-md p-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id={`group-${group}`}
              checked={isExpanded(group)}
              onChange={() => toggleGroup(group)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="space-y-0.5">
              <label htmlFor={`group-${group}`} className="text-lg font-semibold">
                {group}
              </label>
              <p className="text-sm text-gray-500">
                Check to assess this muscle group
              </p>
            </div>
          </div>
          
          {isExpanded(group) && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Flexion', 'Extension', 'Abduction', 'Adduction'].slice(0, group === "Elbow" ? 2 : 4).map(movement => (
                  <div key={movement} className="border rounded p-3">
                    <h4 className="font-medium mb-3">{movement}</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="text-sm block mb-1">Right Side</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          {[0, 1, '2-', 2, '2+', '3-', 3, '3+', '4-', 4, '4+', 5].map(grade => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm block mb-1">Left Side</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          {[0, 1, '2-', 2, '2+', '3-', 3, '3+', '4-', 4, '4+', 5].map(grade => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id={`${group}-${movement}-pain`}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`${group}-${movement}-pain`} className="text-sm font-normal">
                        Pain With Resistance
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block font-medium mb-1">Notes for {group}</label>
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
        <label className="block text-lg font-medium mb-1">General MMT Assessment Notes</label>
        <textarea
          className="w-full p-2 border rounded-md min-h-[120px]"
          placeholder="Enter overall findings and strength assessment observations..."
        />
      </div>
    </div>
  );
}

export default SimpleManualMuscle;