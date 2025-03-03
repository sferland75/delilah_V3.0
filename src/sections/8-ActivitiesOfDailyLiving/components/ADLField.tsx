import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { independenceLevels } from '../constants';
import type { ADLData } from '../types';

export interface ADLFieldProps {
  basePath: string;
  title: string;
  subtitle?: string;
}

export const ADLField: React.FC<ADLFieldProps> = function ADLField({ basePath, title, subtitle }) {
  const { register, setValue, watch } = useFormContext<ADLData>();
  const independenceLevel = watch(`${basePath}.independence`);

  return (
    <Card className="p-4 border rounded-md hover:border-gray-300 transition-colors">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Independence Level</Label>
            <Select
              value={independenceLevel}
              onValueChange={(value) => setValue(`${basePath}.independence` as any, value)}
              data-testid="select"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select independence level" />
              </SelectTrigger>
              <SelectContent>
                {independenceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Details & Observations</Label>
            <Textarea
              {...register(`${basePath}.notes` as any)}
              placeholder="Enter details about performance, challenges, and assistance needed..."
              data-testid="textarea"
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};