import React from 'react';
import { useFormContext } from 'react-hook-form';

export const PhysicalSymptoms = () => {
  const { register } = useFormContext();

  return React.createElement('div', { className: 'space-y-4' },
    // Location field
    React.createElement('div', null,
      React.createElement('label', { 
        htmlFor: 'location',
        className: 'block mb-1' 
      }, 'Location *'),
      React.createElement('input', {
        id: 'location',
        type: 'text',
        'data-testid': 'physical-location',
        className: 'w-full p-2 border rounded',
        'aria-label': 'Symptom location',
        required: true,
        ...register('physical.location', { required: true })
      })
    ),
    // Intensity field
    React.createElement('div', null,
      React.createElement('label', { 
        htmlFor: 'intensity',
        className: 'block mb-1'  
      }, 'Intensity (1-10) *'),
      React.createElement('input', {
        id: 'intensity',
        type: 'number',
        min: '1',
        max: '10',
        'data-testid': 'physical-intensity',
        className: 'w-full p-2 border rounded',
        'aria-label': 'Symptom intensity',
        required: true,
        ...register('physical.intensity', { 
          required: true,
          min: 1,
          max: 10
        })
      })
    ),
    // Description field
    React.createElement('div', null,
      React.createElement('label', { 
        htmlFor: 'description',
        className: 'block mb-1'  
      }, 'Description'),
      React.createElement('textarea', {
        id: 'description',
        'data-testid': 'physical-description',
        className: 'w-full p-2 border rounded min-h-[100px]',
        'aria-label': 'Symptom description',
        ...register('physical.description')
      })
    )
  );
};

export default PhysicalSymptoms;