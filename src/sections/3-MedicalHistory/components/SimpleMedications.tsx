'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

export function SimpleMedications() {
  const { data } = useAssessment();
  const medicalHistory = data.medicalHistory || {};
  const [medications, setMedications] = useState([
    { id: '1', name: '', dosage: '', frequency: '', reason: '', status: 'current' }
  ]);
  
  // Initialize medications if we have data
  useEffect(() => {
    if (medicalHistory.pastMedicalHistory?.medications?.length > 0) {
      setMedications(
        medicalHistory.pastMedicalHistory.medications.map((med, index) => ({
          id: index.toString(),
          name: med.name || '',
          dosage: med.dosage || '',
          frequency: med.frequency || '',
          reason: med.reason || '',
          status: 'current'
        }))
      );
    }
  }, [medicalHistory]);
  
  const addMedication = () => {
    setMedications([
      ...medications, 
      { id: Date.now().toString(), name: '', dosage: '', frequency: '', reason: '', status: 'current' }
    ]);
  };
  
  const removeMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const updateMedication = (id, field, value) => {
    const updatedMeds = medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    );
    setMedications(updatedMeds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Medications</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addMedication}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Medication
        </Button>
      </div>

      {medications.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No medications added. Click "Add Medication" to begin.
        </div>
      )}

      {medications.map((med) => (
        <div 
          key={med.id} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeMedication(med.id)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-1">Medication Name</Label>
              <Input
                value={med.name}
                onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                placeholder="Enter medication name"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Dosage</Label>
              <Input
                value={med.dosage}
                onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                placeholder="E.g., 10mg, 500mg"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Frequency</Label>
              <Input
                value={med.frequency}
                onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                placeholder="E.g., Once daily, Twice daily"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Status</Label>
              <Select
                value={med.status}
                onValueChange={(value) => updateMedication(med.id, 'status', value)}
              >
                <SelectTrigger className="w-full p-2 border rounded-md">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                  <SelectItem value="as-needed">As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Prescribed For</Label>
              <Input
                value={med.reason}
                onChange={(e) => updateMedication(med.id, 'reason', e.target.value)}
                placeholder="Reason for prescription"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}