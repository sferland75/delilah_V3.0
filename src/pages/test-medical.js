import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Ultra simple test for the Add Condition button
export default function TestMedical() {
  const [conditions, setConditions] = useState([]);
  
  const addCondition = () => {
    console.log("Adding condition");
    setConditions([...conditions, { name: 'New Condition' }]);
  };
  
  return (
    <div className="p-10">
      <h1 className="text-2xl mb-5">Test Medical History</h1>
      
      <Button 
        onClick={addCondition}
        className="mb-5"
      >
        Add Condition
      </Button>
      
      <div className="border p-4">
        <h2 className="text-lg mb-3">Conditions ({conditions.length})</h2>
        {conditions.map((condition, index) => (
          <div key={index} className="p-2 border mb-2">
            Condition #{index + 1}
          </div>
        ))}
        {conditions.length === 0 && (
          <p>No conditions added yet.</p>
        )}
      </div>
    </div>
  );
}