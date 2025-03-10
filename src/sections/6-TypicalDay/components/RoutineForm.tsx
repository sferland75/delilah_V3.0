import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { TypicalDayFormData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, AlertCircle, Moon } from 'lucide-react';

interface RoutineFormProps {
  routineType: 'preAccident' | 'postAccident';
}

// Time blocks definitions with their time ranges
const TIME_BLOCKS = [
  { 
    label: 'Early Morning (5:00 AM - 8:00 AM)', 
    value: 'earlyMorning',
    startHour: 5,
    endHour: 8,
  },
  { 
    label: 'Morning (8:00 AM - 12:00 PM)', 
    value: 'morning',
    startHour: 8,
    endHour: 12,
  },
  { 
    label: 'Afternoon (12:00 PM - 5:00 PM)', 
    value: 'afternoon',
    startHour: 12,
    endHour: 17,
  },
  { 
    label: 'Evening (5:00 PM - 9:00 PM)', 
    value: 'evening',
    startHour: 17,
    endHour: 21,
  },
  { 
    label: 'Night (9:00 PM - 5:00 AM)', 
    value: 'night',
    startHour: 21,
    endHour: 5,
    overnight: true,
  }
];

// Generate time options in 30-minute increments
const generateTimeOptions = (startHour, endHour, overnight = false) => {
  const options = [];
  
  if (overnight) {
    // For overnight periods (like Night), generate from startHour to 24 and then 0 to endHour
    for (let hour = startHour; hour < 24; hour++) {
      addHourOptions(hour, options);
    }
    
    for (let hour = 0; hour < endHour; hour++) {
      addHourOptions(hour, options);
    }
  } else {
    // For regular periods, generate from startHour to endHour
    for (let hour = startHour; hour < endHour; hour++) {
      addHourOptions(hour, options);
    }
  }
  
  return options;
};

// Helper function to add both :00 and :30 options for a given hour
const addHourOptions = (hour, options) => {
  const hourFormatted = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
  const period = hour < 12 ? 'AM' : 'PM';
  
  // Add the hour:00 option
  options.push({
    value: `${hour.toString().padStart(2, '0')}:00`,
    label: `${hourFormatted}:00 ${period}`
  });
  
  // Add the hour:30 option
  options.push({
    value: `${hour.toString().padStart(2, '0')}:30`,
    label: `${hourFormatted}:30 ${period}`
  });
};

// Generate all time options for sleep schedule
const generateAllTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    addHourOptions(hour, options);
  }
  return options;
};

const ALL_TIME_OPTIONS = generateAllTimeOptions();

const RoutineForm: React.FC<RoutineFormProps> = ({ routineType }) => {
  const { register, formState: { errors }, setValue, watch } = useFormContext<TypicalDayFormData>();
  const sleepPath = `typicalDay.${routineType}.sleepSchedule`;
  
  // Watch for irregular schedule details
  const irregularDetails = watch(`${sleepPath}.irregularScheduleDetails`) || '';
  const hasIrregularSchedule = irregularDetails.trim() !== '';
  
  // Handle irregular schedule button click
  const toggleIrregularSchedule = () => {
    if (!hasIrregularSchedule) {
      // Show prompt for details when enabling irregular schedule
      const details = window.prompt("Enter details about the irregular sleep schedule (shift work, varying patterns, etc.):");
      if (details) {
        setValue(`${sleepPath}.irregularScheduleDetails`, details);
      }
      
      // Clear regular schedule fields
      setValue(`${sleepPath}.wakeTime`, '');
      setValue(`${sleepPath}.bedTime`, '');
    } else {
      // Clear irregular schedule details when disabling
      setValue(`${sleepPath}.irregularScheduleDetails`, '');
    }
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Daily Activities</h3>
              <div>
                <Button 
                  onClick={toggleIrregularSchedule}
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    hasIrregularSchedule 
                      ? 'bg-amber-100 text-amber-800 border-amber-300' 
                      : ''
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  {hasIrregularSchedule ? 'Irregular Sleep Schedule' : 'Mark Irregular Sleep'}
                </Button>
              </div>
            </div>
            
            {hasIrregularSchedule && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">Irregular Sleep Schedule:</p>
                    <p className="text-sm text-amber-700">{irregularDetails}</p>
                  </div>
                </div>
              </div>
            )}
            
            {!hasIrregularSchedule && (
              <div className="grid grid-cols-2 gap-4 mb-4 border p-4 rounded-md">
                <div>
                  <label className="block text-sm font-medium mb-1">Wake Time</label>
                  <select
                    {...register(`${sleepPath}.wakeTime`)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    data-testid={`${routineType}-wake-time`}
                  >
                    <option value="">Select Wake Time</option>
                    {ALL_TIME_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Bed Time</label>
                  <select
                    {...register(`${sleepPath}.bedTime`)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    data-testid={`${routineType}-bed-time`}
                  >
                    <option value="">Select Bed Time</option>
                    {ALL_TIME_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="border p-4 rounded-md mb-4">
              <label className="block text-sm font-medium mb-1">Sleep Quality</label>
              <textarea
                {...register(`${sleepPath}.sleepQuality`)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                rows={2}
                data-testid={`${routineType}-sleep-quality`}
                placeholder="Describe sleep quality, any issues or disturbances..."
              />
            </div>
            
            {TIME_BLOCKS.map((timeBlock) => (
              <TimeBlockSection 
                key={timeBlock.value} 
                timeBlock={timeBlock} 
                routineType={routineType} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

interface TimeBlockSectionProps {
  timeBlock: { 
    label: string; 
    value: string;
    startHour: number;
    endHour: number;
    overnight?: boolean;
  };
  routineType: 'preAccident' | 'postAccident';
}

const TimeBlockSection: React.FC<TimeBlockSectionProps> = ({ timeBlock, routineType }) => {
  const { register, control, formState: { errors } } = useFormContext<TypicalDayFormData>();
  const path = `typicalDay.${routineType}.dailyRoutine.${timeBlock.value}`;
  
  // Generate time options specific to this time block
  const timeOptions = generateTimeOptions(
    timeBlock.startHour, 
    timeBlock.endHour, 
    timeBlock.overnight
  );
  
  const { fields, append, remove } = useFieldArray({
    control, // Add the control parameter
    name: path
  });

  const addActivity = () => {
    // Set default time to the start of the time block
    const defaultTime = timeOptions[0]?.value || '';
    
    if (routineType === 'preAccident') {
      append({ specificTime: defaultTime, description: '' });
    } else {
      append({ specificTime: defaultTime, description: '', assistance: '', limitations: '' });
    }
  };

  // If there are no items, add one by default
  React.useEffect(() => {
    if (fields.length === 0) {
      addActivity();
    }
  }, [fields.length]);

  return (
    <div className="border rounded-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-md">{timeBlock.label}</h4>
        <Button
          type="button"
          onClick={addActivity}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          data-testid={`add-${routineType}-${timeBlock.value}-activity`}
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="border-l-4 border-blue-200 pl-4 py-2">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium">Time</label>
                <select
                  {...register(`${path}.${index}.specificTime`)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  data-testid={`${routineType}-${timeBlock.value}-time-${index}`}
                >
                  <option value="">Select Time</option>
                  {timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.typicalDay?.[routineType]?.dailyRoutine?.[timeBlock.value]?.[index]?.specificTime && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.typicalDay[routineType].dailyRoutine[timeBlock.value][index].specificTime?.message}
                  </p>
                )}
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium">Activity Description</label>
                <input
                  type="text"
                  {...register(`${path}.${index}.description`)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  data-testid={`${routineType}-${timeBlock.value}-desc-${index}`}
                  placeholder="Describe the activity"
                />
                {errors.typicalDay?.[routineType]?.dailyRoutine?.[timeBlock.value]?.[index]?.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.typicalDay[routineType].dailyRoutine[timeBlock.value][index].description?.message}
                  </p>
                )}
              </div>

              {routineType === 'postAccident' && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Assistance & Limitations</label>
                  <textarea
                    {...register(`${path}.${index}.assistance`)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    rows={2}
                    data-testid={`${routineType}-${timeBlock.value}-assistance-${index}`}
                    placeholder="Describe assistance needed and limitations"
                  />
                </div>
              )}

              {routineType === 'preAccident' && <div className="col-span-2"></div>}

              {fields.length > 1 && (
                <div className="flex items-center justify-center">
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 h-8 w-8 p-0"
                    data-testid={`remove-${routineType}-${timeBlock.value}-activity-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <p className="text-gray-500 italic text-center py-4">
            No activities added. Click "Add Activity" to start documenting the routine.
          </p>
        )}
      </div>
    </div>
  );
};

export { RoutineForm };
export default RoutineForm;