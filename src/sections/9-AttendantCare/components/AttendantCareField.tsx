'use client';

import React, { useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { calculateTotalMinutes } from '../utils/calculations';

interface AttendantCareFieldProps {
  form: UseFormReturn<any>;
  path: string;
  label: string;
  description?: string;
  assistanceLevels?: string[];
  includeFrequency?: boolean;
  includeHoursPerWeek?: boolean;
  includeNotes?: boolean;
}

/**
 * Enhanced field component for attendant care assessment.
 * Supports additional field types beyond the basic CareActivity component.
 */
export function AttendantCareField({ 
  form, 
  path, 
  label, 
  description,
  assistanceLevels = ['none', 'minimal', 'moderate', 'maximal', 'setup', 'standby'],
  includeFrequency = true,
  includeHoursPerWeek = false,
  includeNotes = true
}: AttendantCareFieldProps) {
  const { register, setValue, watch, getValues } = form;
  
  // Watch for changes to calculate totals
  const minutes = watch(`${path}.minutes`) || 0;
  const timesPerWeek = watch(`${path}.timesPerWeek`) || 0;
  const hoursPerWeek = watch(`${path}.hoursPerWeek`) || 0;
  const assistance = watch(`${path}.assistance`);

  // Calculate minutes when hours change (if hours field is included)
  useEffect(() => {
    if (includeHoursPerWeek && hoursPerWeek) {
      // Convert hours to minutes (1 hour = 60 minutes)
      const totalMinutes = hoursPerWeek * 60;
      
      // Set default frequency if not set
      if (!timesPerWeek) {
        setValue(`${path}.timesPerWeek`, 7); // Default to 7 times per week
      }
      
      // Calculate minutes per session
      const currentTimesPerWeek = getValues(`${path}.timesPerWeek`) || 7;
      const minutesPerSession = Math.round(totalMinutes / currentTimesPerWeek);
      
      setValue(`${path}.minutes`, minutesPerSession);
    }
  }, [hoursPerWeek, includeHoursPerWeek, path, setValue, timesPerWeek, getValues]);

  // Auto-calculate total minutes when inputs change
  useEffect(() => {
    const total = calculateTotalMinutes(minutes, timesPerWeek);
    setValue(`${path}.totalMinutes`, total);
  }, [minutes, timesPerWeek, path, setValue]);
  
  // Handle assistance level change
  const handleAssistanceChange = (value: string) => {
    setValue(`${path}.assistance`, value);
    
    // Add default note text based on assistance level if notes field is empty
    const currentNotes = getValues(`${path}.notes`);
    if (!currentNotes && includeNotes) {
      let noteText = '';
      
      switch(value) {
        case 'none':
          noteText = 'Independent; requires no assistance.';
          break;
        case 'minimal':
          noteText = 'Requires minimal assistance with this activity.';
          break;
        case 'moderate':
          noteText = 'Requires moderate assistance with this activity.';
          break;
        case 'maximal':
          noteText = 'Requires maximal assistance with this activity.';
          break;
        case 'setup':
          noteText = 'Requires setup assistance before performing this activity independently.';
          break;
        case 'standby':
          noteText = 'Requires standby assistance/supervision during this activity.';
          break;
        default:
          noteText = '';
      }
      
      setValue(`${path}.notes`, noteText);
    }
  };

  return (
    <Card className="p-4 border rounded-md hover:border-gray-300 transition-colors">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">{label}</h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        {/* Assistance Level Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Assistance Level</Label>
          <Select 
            onValueChange={handleAssistanceChange}
            value={assistance}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select level of assistance required" />
            </SelectTrigger>
            <SelectContent>
              {assistanceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {includeFrequency && (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Minutes per Activity</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  {...register(`${path}.minutes`, { 
                    valueAsNumber: true,
                    min: 0
                  })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Times per Week</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  {...register(`${path}.timesPerWeek`, { 
                    valueAsNumber: true,
                    min: 0
                  })}
                  className="w-full"
                />
              </div>
            </>
          )}

          {includeHoursPerWeek && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Hours per Week</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                {...register(`${path}.hoursPerWeek`, { 
                  valueAsNumber: true,
                  min: 0
                })}
                className="w-full"
              />
            </div>
          )}
        </div>

        {includeNotes && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes & Observations</Label>
            <Textarea
              {...register(`${path}.notes`)}
              placeholder="Enter details about assistance requirements, challenges, or special considerations..."
              className="min-h-[80px]"
            />
          </div>
        )}

        <div className="pt-3 mt-2 border-t">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium">Total Minutes per Week:</span>
            <span className="text-lg font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
              {calculateTotalMinutes(minutes, timesPerWeek)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AttendantCareField;