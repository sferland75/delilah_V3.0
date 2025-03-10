import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TypicalDay } from '../schema';

interface SimpleActivityProps {
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  timeframe: 'preAccident' | 'postAccident';
  index: number;
  onRemove: () => void;
}

export function SimpleActivity({ period, timeframe, index, onRemove }: SimpleActivityProps) {
  const { register, formState: { errors } } = useFormContext<TypicalDay>();
  const basePath = `data.${timeframe}.dailyRoutine.${period}.${index}`;
  
  // Get field errors if any
  const timeBlockError = errors?.data?.[timeframe]?.dailyRoutine?.[period]?.[index]?.timeBlock;
  const descriptionError = errors?.data?.[timeframe]?.dailyRoutine?.[period]?.[index]?.description;
  
  return (
    <div className="relative p-4 border rounded-md mb-3">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <Input 
            {...register(`${basePath}.timeBlock`)} 
            placeholder="e.g., 8:00 AM" 
            className={timeBlockError ? "border-red-300" : ""}
          />
          {timeBlockError && (
            <p className="text-red-500 text-xs mt-1">{timeBlockError.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Activity</label>
          <Input 
            {...register(`${basePath}.description`)} 
            placeholder="Describe the activity" 
            className={descriptionError ? "border-red-300" : ""}
          />
          {descriptionError && (
            <p className="text-red-500 text-xs mt-1">{descriptionError.message}</p>
          )}
        </div>

        {timeframe === 'postAccident' && (
          <>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Assistance Needed</label>
              <Textarea
                {...register(`${basePath}.assistance`)}
                placeholder="Describe any assistance required..."
                className="resize-none"
                rows={2}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Limitations/Challenges</label>
              <Textarea
                {...register(`${basePath}.limitations`)}
                placeholder="Describe any limitations or challenges..."
                className="resize-none"
                rows={2}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}