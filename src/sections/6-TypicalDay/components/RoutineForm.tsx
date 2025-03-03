import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { TypicalDayFormData } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

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

const RoutineForm: React.FC<RoutineFormProps> = ({ routineType }) => {
  const { register, formState: { errors } } = useFormContext<TypicalDayFormData>();
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold mb-4">Daily Activities</h3>
          
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
  const { register, formState: { errors } } = useFormContext<TypicalDayFormData>();
  const path = `typicalDay.${routineType}.dailyRoutine.${timeBlock.value}`;
  
  // Generate time options specific to this time block
  const timeOptions = generateTimeOptions(
    timeBlock.startHour, 
    timeBlock.endHour, 
    timeBlock.overnight
  );
  
  const { fields, append, remove } = useFieldArray({
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