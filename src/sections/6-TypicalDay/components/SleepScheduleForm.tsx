import React, { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TypicalDayFormData } from '../types';

interface SleepScheduleFormProps {
  routineType: 'preAccident' | 'postAccident';
}

// Generate time options in 30-minute increments for the entire day
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
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
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export const SleepScheduleForm: React.FC<SleepScheduleFormProps> = ({ routineType }) => {
  const { register, formState: { errors }, setValue, control } = useFormContext<TypicalDayFormData>();
  const path = `typicalDay.${routineType}.sleepSchedule`;
  
  // Add field for irregular schedule
  const [hasIrregularSchedule, setHasIrregularSchedule] = useState(false);
  
  // Watch the irregularScheduleDetails to initialize state correctly
  const irregularDetails = useWatch({
    control,
    name: `${path}.irregularScheduleDetails`,
    defaultValue: ''
  });
  
  // Initialize the irregular schedule state based on existing data
  useEffect(() => {
    if (irregularDetails && irregularDetails.trim() !== '') {
      setHasIrregularSchedule(true);
    }
  }, [irregularDetails]);
  
  // Handle irregular schedule button click
  const toggleIrregularSchedule = () => {
    const newValue = !hasIrregularSchedule;
    setHasIrregularSchedule(newValue);
    
    if (newValue) {
      // Show prompt for details when enabling irregular schedule
      const details = window.prompt("Enter details about the irregular sleep schedule (shift work, varying patterns, etc.):");
      if (details) {
        setValue(`${path}.irregularScheduleDetails`, details);
      } else {
        setHasIrregularSchedule(false); // If canceled, revert back
      }
      
      // Clear regular schedule fields
      setValue(`${path}.wakeTime`, '');
      setValue(`${path}.bedTime`, '');
    } else {
      // Clear irregular schedule details when disabling
      setValue(`${path}.irregularScheduleDetails`, '');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <button
          type="button"
          onClick={toggleIrregularSchedule}
          className={`text-sm px-3 py-1 rounded-full border ${
            hasIrregularSchedule 
              ? 'bg-amber-100 text-amber-800 border-amber-300' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
        >
          {hasIrregularSchedule ? 'Irregular Schedule Entered' : 'Has Irregular Schedule?'}
        </button>
      </div>
      
      {hasIrregularSchedule ? (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
          <label className="block text-sm font-medium">Irregular Schedule Details</label>
          <textarea
            {...register(`${path}.irregularScheduleDetails`)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
            data-testid={`${routineType}-irregular-schedule-details`}
            placeholder="Describe irregular sleep patterns..."
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Wake Time</label>
            <select
              {...register(`${path}.wakeTime`)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              data-testid={`${routineType}-wake-time`}
            >
              <option value="">Select Wake Time</option>
              {TIME_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Bed Time</label>
            <select
              {...register(`${path}.bedTime`)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              data-testid={`${routineType}-bed-time`}
            >
              <option value="">Select Bed Time</option>
              {TIME_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium">Sleep Quality</label>
        <textarea
          {...register(`${path}.sleepQuality`)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          rows={2}
          data-testid={`${routineType}-sleep-quality`}
          placeholder="Describe sleep quality, any issues or disturbances..."
        />
      </div>
    </div>
  );
};

export default SleepScheduleForm;