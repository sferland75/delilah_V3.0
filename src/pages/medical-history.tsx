import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';

// A complete standalone version with no imports or complex dependencies
export default function MedicalHistoryPage() {
  // Use React's built-in state management
  const [conditions, setConditions] = useState([]);
  const [activeTab, setActiveTab] = useState('preExisting');
  
  // Simple condition management
  const addCondition = () => {
    setConditions([...conditions, {
      id: Date.now(),
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
    <AssessmentProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Medical History</h1>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full border rounded-md"
        >
          <TabsList className="grid w-full grid-cols-3 p-0 h-auto border-b">
            <TabsTrigger 
              value="preExisting"
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600" 
            >
              Pre-Existing Conditions
            </TabsTrigger>
            <TabsTrigger 
              value="injury"
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600" 
            >
              Injury Details
            </TabsTrigger>
            <TabsTrigger 
              value="medications"
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600" 
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
                  key={condition.id} 
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
              <p>This tab will contain injury details form fields.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="medications" className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Medications</h3>
              <p>This tab will contain medication form fields.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setConditions([])}
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
    </AssessmentProvider>
  );
}