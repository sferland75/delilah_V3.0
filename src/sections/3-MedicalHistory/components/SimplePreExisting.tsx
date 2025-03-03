'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

export function SimplePreExisting() {
  const { data } = useAssessment();
  const medicalHistory = data.medicalHistory || {};
  const [conditions, setConditions] = useState([
    { id: '1', name: '', diagnosisDate: '', status: '', details: '' }
  ]);
  
  // Initialize conditions if we have data
  React.useEffect(() => {
    if (medicalHistory.pastMedicalHistory?.conditions?.length > 0) {
      setConditions(
        medicalHistory.pastMedicalHistory.conditions.map((c, index) => ({
          id: index.toString(),
          name: c.condition || '',
          diagnosisDate: c.diagnosisDate || '',
          status: 'active',
          details: c.treatment || ''
        }))
      );
    }
  }, [medicalHistory]);
  
  const addCondition = () => {
    setConditions([...conditions, { id: Date.now().toString(), name: '', diagnosisDate: '', status: '', details: '' }]);
  };
  
  const removeCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  return (
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

      {conditions.map((condition) => (
        <div 
          key={condition.id} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeCondition(condition.id)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-1">Condition</Label>
              <Input
                value={condition.name}
                onChange={(e) => {
                  const updated = conditions.map(c => 
                    c.id === condition.id ? { ...c, name: e.target.value } : c
                  );
                  setConditions(updated);
                }}
                placeholder="Enter condition name"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Status</Label>
              <Select
                value={condition.status}
                onValueChange={(value) => {
                  const updated = conditions.map(c => 
                    c.id === condition.id ? { ...c, status: value } : c
                  );
                  setConditions(updated);
                }}
              >
                <SelectTrigger className="w-full p-2 border rounded-md">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="managed">Managed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Diagnosis Date</Label>
              <Input
                value={condition.diagnosisDate}
                onChange={(e) => {
                  const updated = conditions.map(c => 
                    c.id === condition.id ? { ...c, diagnosisDate: e.target.value } : c
                  );
                  setConditions(updated);
                }}
                type="date"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1">Details</Label>
            <Textarea
              value={condition.details}
              onChange={(e) => {
                const updated = conditions.map(c => 
                  c.id === condition.id ? { ...c, details: e.target.value } : c
                );
                setConditions(updated);
              }}
              placeholder="Add additional details about this condition"
              className="min-h-[80px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      ))}
    </div>
  );
}