import React from 'react';
import { useFormContext } from 'react-hook-form';
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
  const { register, formState: { errors } } = useFormContext<TypicalDayFormData>();
  const path = `typicalDay.${routineType}.sleepSchedule`;
  
  return (
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
        {errors.typicalDay?.[routineType]?.sleepSchedule?.wakeTime && (
          <p className="text-sm text-red-500 mt-1">
            {errors.typicalDay[routineType].sleepSchedule.wakeTime?.message}
          </p>
        )}
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
        {errors.typicalDay?.[routineType]?.sleepSchedule?.bedTime && (
          <p className="text-sm text-red-500 mt-1">
            {errors.typicalDay[routineType].sleepSchedule.bedTime?.message}
          </p>
        )}
      </div>
      
      <div className="col-span-2">
        <label className="block text-sm font-medium">Sleep Quality</label>
        <textarea
          {...register(`${path}.sleepQuality`)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          rows={3}
          data-testid={`${routineType}-sleep-quality`}
          placeholder="Describe sleep quality, any issues or disturbances..."
        />
        {errors.typicalDay?.[routineType]?.sleepSchedule?.sleepQuality && (
          <p className="text-sm text-red-500 mt-1">
            {errors.typicalDay[routineType].sleepSchedule.sleepQuality?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SleepScheduleForm;