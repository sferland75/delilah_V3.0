import React from 'react';
import { useFormContext } from 'react-hook-form';

export const CognitiveSymptoms = () => {
  const { register } = useFormContext();

  return React.createElement('div', { className: 'space-y-4' },
    // Type field
    React.createElement('div', null,
      React.createElement('label', { 
        htmlFor: 'cognitive-type',
        className: 'block mb-1' 
      }, 'Type of Cognitive Issue *'),
      React.createElement('select', {
        id: 'cognitive-type',
        'data-testid': 'cognitive-type',
        className: 'w-full p-2 border rounded',
        'aria-label': 'Type of cognitive symptom',
        required: true,
        ...register('cognitive.type', { required: true })
      },
        React.createElement('option', { value: '' }, 'Select type'),
        React.createElement('option', { value: 'memory' }, 'Memory'),
        React.createElement('option', { value: 'concentration' }, 'Concentration'),
        React.createElement('option', { value: 'decision-making' }, 'Decision Making'),
        React.createElement('option', { value: 'processing' }, 'Processing Speed')
      )
    ),
    // Impact field
    React.createElement('div', null,
      React.createElement('label', { 
        htmlFor: 'cognitive-impact',
        className: 'block mb-1'  
      }, 'Impact on Daily Life *'),
      React.createElement('textarea', {
        id: 'cognitive-impact',
        'data-testid': 'cognitive-impact',
        className: 'w-full p-2 border rounded min-h-[100px]',
        'aria-label': 'Impact on daily life',
        required: true,
        ...register('cognitive.impact', { required: true })
      })
    ),
    // Management field
    React.createElement('div', null,
      React.createElement('label', { 
        htmlFor: 'cognitive-management',
        className: 'block mb-1'  
      }, 'Management Strategies'),
      React.createElement('textarea', {
        id: 'cognitive-management',
        'data-testid': 'cognitive-management',
        className: 'w-full p-2 border rounded min-h-[100px]',
        'aria-label': 'Management strategies',
        ...register('cognitive.management')
      })
    )
  );
};

export default CognitiveSymptoms;