'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function SimpleInjuryDetails() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Injury Details</h3>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="text-sm font-medium mb-1">Date of Injury</Label>
          <Input
            type="date"
            className="w-full p-2 border rounded-md"
            placeholder="Select date"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1">Time of Injury</Label>
          <Input
            type="time"
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-1">Mechanism of Injury</Label>
          <Input
            placeholder="Describe how the injury occurred (e.g., fall, collision)"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1">Circumstances</Label>
          <Textarea
            placeholder="Provide additional details about how the injury occurred"
            className="min-h-[100px] w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1">Immediate Symptoms</Label>
          <Textarea
            placeholder="Describe symptoms experienced immediately after injury"
            className="min-h-[100px] w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <Label className="text-sm font-medium mb-1">Initial Treatment</Label>
          <Textarea
            placeholder="Describe any immediate medical attention or first aid received"
            className="min-h-[100px] w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
}