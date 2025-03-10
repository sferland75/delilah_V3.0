'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export function SimpleBergBalance() {
  // Track scores for each task
  const [scores, setScores] = useState({});
  
  // Calculate the total score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + (parseInt(score) || 0), 0);
  
  // Handle score change
  const handleScoreChange = (taskIndex, value) => {
    setScores(prev => ({
      ...prev,
      [taskIndex]: value
    }));
  };
  
  // Berg Balance tasks
  const bergTasks = [
    "Sitting to standing",
    "Standing unsupported",
    "Sitting unsupported",
    "Standing to sitting",
    "Transfers",
    "Standing with eyes closed",
    "Standing with feet together",
    "Reaching forward with outstretched arm",
    "Retrieving object from floor",
    "Turning to look behind",
    "Turning 360 degrees",
    "Placing alternate foot on stool",
    "Standing with one foot in front",
    "Standing on one foot"
  ];
  
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-blue-50">
        <h3 className="font-medium text-blue-800">Berg Balance Scale</h3>
        <p className="text-sm text-blue-700 mt-1">
          This standardized assessment measures balance in older adults through 14 functional tasks.
        </p>
      </div>
      
      <div className="bg-blue-50 rounded-md p-4 mb-6">
        <h3 className="font-semibold text-lg mb-2">Scoring Scale</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <li className="flex items-center space-x-1">
            <span className="font-semibold">0:</span>
            <span>Unable to perform task</span>
          </li>
          <li className="flex items-center space-x-1">
            <span className="font-semibold">1:</span>
            <span>Requires significant assistance</span>
          </li>
          <li className="flex items-center space-x-1">
            <span className="font-semibold">2:</span>
            <span>Requires moderate assistance</span>
          </li>
          <li className="flex items-center space-x-1">
            <span className="font-semibold">3:</span>
            <span>Requires minimal assistance</span>
          </li>
          <li className="flex items-center space-x-1">
            <span className="font-semibold">4:</span>
            <span>Completely independent</span>
          </li>
        </ul>
      </div>
      
      <div className="space-y-4">
        {bergTasks.map((task, index) => (
          <div key={task} className="border rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{index + 1}. {task}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Rate patient's performance on this task
                </p>
              </div>
              <select 
                className="ml-2 border border-gray-300 rounded-md p-1"
                value={scores[index] || ''}
                onChange={(e) => handleScoreChange(index, e.target.value)}
              >
                <option value="">Select score</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="mt-2">
              <textarea
                className="w-full p-2 border rounded-md text-sm"
                rows={2}
                placeholder="Notes for this task..."
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-lg font-medium">Total Score:</label>
          <div className="text-xl font-semibold px-4 py-2 border rounded-md bg-gray-50">
            {totalScore}/56
          </div>
        </div>
        
        <div>
          <label className="block text-lg font-medium mb-1">General Balance Assessment Notes</label>
          <textarea
            className="w-full p-2 border rounded-md min-h-[120px]"
            placeholder="Enter general observations about balance performance..."
          />
        </div>
      </div>
    </div>
  );
}

export default SimpleBergBalance;