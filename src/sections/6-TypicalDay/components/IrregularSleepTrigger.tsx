import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Moon, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TypicalDayFormData } from '../types';
import { TypicalDay } from '../schema';

interface SleepScheduleProps {
  timeframe: 'preAccident' | 'postAccident';
}

/**
 * A component that handles both regular and irregular sleep schedule data collection
 * for the Typical Day form. Uses a modal dialog instead of browser prompts.
 */
const SleepSchedule: React.FC<SleepScheduleProps> = ({ timeframe }) => {
  const { register, watch, setValue, getValues } = useFormContext<TypicalDay>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const scheduleType = watch(`data.${timeframe}.sleepSchedule.type`) || 'regular';
  const basePath = `data.${timeframe}.sleepSchedule`;
  
  // Check if irregular schedule details exist
  const hasIrregularSchedule = scheduleType === 'irregular';
  
  // Toggle between regular and irregular schedules
  const handleScheduleTypeChange = (value: 'regular' | 'irregular') => {
    setValue(`${basePath}.type`, value, { shouldDirty: true });
    
    if (value === 'irregular' && !getValues(`${basePath}.irregularScheduleDetails`)) {
      setIsDialogOpen(true);
    }
  };
  
  // Handle save in the dialog
  const handleSaveIrregularDetails = () => {
    setIsDialogOpen(false);
  };
  
  // Handle dialog cancel
  const handleCancelDialog = () => {
    // If there are no details yet, switch back to regular
    if (!getValues(`${basePath}.irregularScheduleDetails`)) {
      setValue(`${basePath}.type`, 'regular', { shouldDirty: true });
    }
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center pb-2 border-b mb-4">
            <h3 className="font-medium">Sleep Schedule</h3>
          </div>
          
          <RadioGroup 
            value={scheduleType}
            onValueChange={handleScheduleTypeChange}
            className="space-y-4 mb-4"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="regular" id={`${timeframe}-regular-sleep`} />
              <div className="grid gap-1.5">
                <Label htmlFor={`${timeframe}-regular-sleep`} className="font-medium">
                  Regular Sleep Schedule
                </Label>
                
                {scheduleType === 'regular' && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor={`${timeframe}-wake-time`}>Wake Time</Label>
                      <Input
                        id={`${timeframe}-wake-time`}
                        {...register(`${basePath}.regularSchedule.wakeTime`)}
                        placeholder="e.g., 7:00 AM"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${timeframe}-bed-time`}>Bed Time</Label>
                      <Input
                        id={`${timeframe}-bed-time`}
                        {...register(`${basePath}.regularSchedule.bedTime`)}
                        placeholder="e.g., 10:00 PM"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`${timeframe}-sleep-quality`}>Sleep Quality</Label>
                      <Textarea
                        id={`${timeframe}-sleep-quality`}
                        {...register(`${basePath}.regularSchedule.sleepQuality`)}
                        placeholder="Describe sleep quality..."
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="irregular" id={`${timeframe}-irregular-sleep`} />
              <div className="grid gap-1.5 w-full">
                <Label htmlFor={`${timeframe}-irregular-sleep`} className="font-medium">
                  Irregular Sleep Schedule
                </Label>
                
                {scheduleType === 'irregular' && (
                  <div className="mt-2">
                    <div>
                      <Label htmlFor={`${timeframe}-irregular-details`}>Irregular Schedule Details</Label>
                      <Textarea
                        id={`${timeframe}-irregular-details`}
                        {...register(`${basePath}.irregularScheduleDetails`)}
                        placeholder="Describe the irregular sleep pattern (shift work, variable times, etc.)..."
                        rows={4}
                      />
                    </div>
                    
                    {hasIrregularSchedule && getValues(`${basePath}.irregularScheduleDetails`) && (
                      <div className="mt-2 bg-amber-50 border-l-4 border-amber-400 p-2 text-sm">
                        <div className="flex">
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-1 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-amber-800">Note: </span>
                            <span className="text-amber-700">When using irregular sleep schedule, any regular schedule times will be ignored.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      {/* Dialog for entering irregular sleep schedule details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Irregular Sleep Schedule Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="irregular-details-dialog">
              Describe the irregular sleep pattern
            </Label>
            <Textarea
              id="irregular-details-dialog"
              {...register(`${basePath}.irregularScheduleDetails`)}
              placeholder="Describe shift work, variable sleep patterns, insomnia, or other details..."
              rows={6}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Examples: "Works rotating shifts (day/night), sleeps 8am-4pm on night shifts and 10pm-6am on day shifts" or 
              "Irregular sleep due to chronic insomnia, typically sleeps 2-3 hours at a time throughout the day and night"
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveIrregularDetails}>
              Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SleepSchedule;