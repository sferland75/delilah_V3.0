'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MinusCircle } from 'lucide-react';

export function SimpleTreatment() {
  const [treatments, setTreatments] = useState([{ id: '1' }]);
  
  const addTreatment = () => {
    setTreatments([...treatments, { id: Date.now().toString() }]);
  };
  
  const removeTreatment = (id) => {
    setTreatments(treatments.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Treatments</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addTreatment}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Treatment
        </Button>
      </div>

      {treatments.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
          No treatments added. Click "Add Treatment" to begin.
        </div>
      )}

      {treatments.map((treatment) => (
        <div 
          key={treatment.id} 
          className="border rounded-md p-4 space-y-4 relative"
        >
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => removeTreatment(treatment.id)}
            className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
            size="sm"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-1">Treatment Type</Label>
              <Input
                placeholder="E.g., Physical Therapy, Surgery"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Provider</Label>
              <Input
                placeholder="Name of healthcare provider"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Facility</Label>
              <Input
                placeholder="Name of hospital or clinic"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Status</Label>
              <Select>
                <SelectTrigger className="w-full p-2 border rounded-md">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">Start Date</Label>
              <Input
                type="date"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-1">End Date</Label>
              <Input
                type="date"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1">Notes</Label>
            <Textarea
              placeholder="Additional details about this treatment"
              className="min-h-[80px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      ))}
    </div>
  );
}