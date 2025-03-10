import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, MinusCircle } from 'lucide-react';

export default function PreExistingConditionsPage() {
  const [conditions, setConditions] = useState([]);
  
  const addCondition = () => {
    setConditions([...conditions, {
      condition: '',
      status: 'active',
      details: '',
      diagnosisDate: ''
    }]);
  };
  
  const removeCondition = (index) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    setConditions(updatedConditions);
  };
  
  const updateCondition = (index, field, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pre-Existing Conditions</h1>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Conditions</h3>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addCondition}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Condition
          </Button>
        </div>

        {conditions.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
            No pre-existing conditions added. Click "Add Condition" to begin.
          </div>
        )}

        {conditions.map((condition, index) => (
          <div 
            key={index} 
            className="border rounded-md p-4 space-y-4 relative"
          >
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => removeCondition(index)}
              className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
              size="sm"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Condition *</label>
                <Input
                  value={condition.condition}
                  onChange={(e) => updateCondition(index, 'condition', e.target.value)}
                  placeholder="Enter condition name"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  value={condition.status}
                  onChange={(e) => updateCondition(index, 'status', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="managed">Managed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis Date</label>
                <Input
                  type="date"
                  value={condition.diagnosisDate}
                  onChange={(e) => updateCondition(index, 'diagnosisDate', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Details</label>
              <Textarea
                value={condition.details}
                onChange={(e) => updateCondition(index, 'details', e.target.value)}
                placeholder="Add additional details about this condition"
                className="min-h-[80px] w-full p-2 border rounded-md"
              />
            </div>
          </div>
        ))}
        
        <div className="flex justify-end">
          <Button 
            onClick={() => alert('Conditions saved!')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Conditions
          </Button>
        </div>
      </div>
    </div>
  );
}