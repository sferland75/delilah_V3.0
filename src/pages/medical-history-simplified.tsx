'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MinusCircle } from 'lucide-react';

// Simple standalone version with no dependencies on other files
export default function MedicalHistorySimplified() {
  // State for pre-existing conditions
  const [conditions, setConditions] = useState([]);
  
  // Add a new condition
  const addCondition = () => {
    setConditions([...conditions, {
      condition: '',
      status: 'active',
      details: '',
      diagnosisDate: ''
    }]);
  };
  
  // Remove a condition
  const removeCondition = (index) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    setConditions(updatedConditions);
  };
  
  // Update a condition field
  const updateCondition = (index, field, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
  };
  
  // Injury details state
  const [injuryDetails, setInjuryDetails] = useState({
    date: '',
    description: '',
    treatment: ''
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Medical History</h1>
      
      <Tabs defaultValue="preExisting" className="w-full border rounded-md">
        <TabsList className="grid w-full grid-cols-3 p-0 h-auto border-b">
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600" 
            value="preExisting"
          >
            Pre-Existing Conditions
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600" 
            value="injury"
          >
            Injury Details
          </TabsTrigger>
          <TabsTrigger 
            className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600" 
            value="medications"
          >
            Medications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preExisting" className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Pre-Existing Conditions</h3>
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
          </div>
        </TabsContent>
        
        <TabsContent value="injury" className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Injury Details</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Date of Injury *</label>
                <Input
                  type="date"
                  value={injuryDetails.date}
                  onChange={(e) => setInjuryDetails({...injuryDetails, date: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Textarea
                value={injuryDetails.description}
                onChange={(e) => setInjuryDetails({...injuryDetails, description: e.target.value})}
                placeholder="Describe the injury"
                className="min-h-[100px] w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Treatment *</label>
              <Textarea
                value={injuryDetails.treatment}
                onChange={(e) => setInjuryDetails({...injuryDetails, treatment: e.target.value})}
                placeholder="Describe treatment received"
                className="min-h-[100px] w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="medications" className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Medications</h3>
            <p>Medications section will be implemented here.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            setConditions([]);
            setInjuryDetails({date: '', description: '', treatment: ''});
          }}
          type="button"
        >
          Reset
        </Button>
        <Button 
          onClick={() => alert('Medical History saved successfully!')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Medical History
        </Button>
      </div>
    </div>
  );
}