'use client';

import React, { useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { calculateTotalMinutes } from '../utils/calculations';

interface CareActivityProps {
  form: UseFormReturn<any>;
  path: string;
  label: string;
  description?: string;
}

export function CareActivity({ form, path, label, description }: CareActivityProps) {
  const { register, setValue, watch } = form;
  const minutes = watch(`${path}.minutes`) || 0;
  const timesPerWeek = watch(`${path}.timesPerWeek`) || 0;

  // Auto-calculate total minutes when inputs change
  useEffect(() => {
    const total = calculateTotalMinutes(minutes, timesPerWeek);
    setValue(`${path}.totalMinutes`, total);
  }, [minutes, timesPerWeek, path, setValue]);

  return (
    <Card className="p-4 border rounded-md hover:border-gray-300 transition-colors">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">{label}</h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Notes & Observations</Label>
          <Textarea
            {...register(`${path}.notes`)}
            placeholder="Enter details about assistance requirements, challenges, or special considerations..."
            className="min-h-[80px]"
          />
        </div>

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