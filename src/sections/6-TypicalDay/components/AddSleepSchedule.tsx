import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TypicalDayFormData } from '../types';
import { Button } from '@/components/ui/button';
import { Moon, AlertCircle } from 'lucide-react';

interface AddSleepScheduleProps {
  routineType: 'preAccident' | 'postAccident';
}

const AddSleepSchedule: React.FC<AddSleepScheduleProps> = ({ routineType }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { register, watch, setValue, formState: { errors } } = useFormContext<TypicalDayFormData>();
  const path = `typicalDay.${routineType}.sleepSchedule`;
  
  const irregularScheduleDetails = watch(`${path}.irregularScheduleDetails`) || '';
  const hasIrregularSchedule = irregularScheduleDetails.trim() !== '';
  
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
  
  const toggleIrregularSchedule = () => {
    if (!hasIrregularSchedule) {
      // Open a modal or dialog to enter irregular schedule details
      const details = window.prompt('Enter details about the irregular sleep schedule (shift work, inconsistent patterns, etc.):');
      if (details) {
        setValue(`${path}.irregularScheduleDetails`, details);
        // Clear regular schedule fields
        setValue(`${path}.wakeTime`, '');
        setValue(`${path}.bedTime`, '');
      }
    } else {
      // Clear irregular schedule details
      setValue(`${path}.irregularScheduleDetails`, '');
    }
  };
  
  return (
    <div className="mt-6 border-t pt-4">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4"
      >
        <Moon className="mr-2 h-5 w-5" />
        {isOpen ? 'Hide Sleep Schedule' : 'Add Sleep Schedule Details'}
      </button>
      
      {isOpen && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Sleep Schedule</h4>
            <button
              type="button"
              onClick={toggleIrregularSchedule}
              className={`px-3 py-1 rounded text-sm font-medium ${
                hasIrregularSchedule 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {hasIrregularSchedule ? 'Using Irregular Schedule' : 'Has Irregular Schedule?'}
            </button>
          </div>
          
          {hasIrregularSchedule ? (
            <div className="mb-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Irregular Sleep Schedule</p>
                  <p className="text-sm text-amber-700">{irregularScheduleDetails}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleIrregularSchedule}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear irregular schedule
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Wake Time</label>
                <select
                  {...register(`${path}.wakeTime`)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
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
                <label className="block text-sm font-medium mb-1">Bed Time</label>
                <select
                  {...register(`${path}.bedTime`)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
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
            <label className="block text-sm font-medium mb-1">Sleep Quality</label>
            <textarea
              {...register(`${path}.sleepQuality`)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              rows={2}
              data-testid={`${routineType}-sleep-quality`}
              placeholder="Describe sleep quality, any issues or disturbances..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSleepSchedule;