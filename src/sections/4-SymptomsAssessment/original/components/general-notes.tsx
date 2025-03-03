import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

export const GeneralNotes = () => {
  const { register } = useFormContext();

  return React.createElement('div', { className: 'space-y-4' },
    React.createElement('p', null, 'Document overall symptom presentation'),
    React.createElement('p', { className: 'text-sm text-gray-500' },
      'Use this section for general notes, observations, and context. Add specific symptoms in their respective tabs.'
    ),
    React.createElement(Textarea, {
      placeholder: 'Add any general notes about symptoms or observations...',
      className: 'min-h-[200px]',
      'aria-label': 'general assessment',
      ...register('general.notes')
    })
  );
};