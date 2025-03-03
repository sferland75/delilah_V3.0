import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhysicalSymptoms } from './PhysicalSymptoms';
import { CognitiveSymptoms } from './CognitiveSymptoms';
import { EmotionalSymptoms } from './EmotionalSymptoms';

const SymptomsAssessment = () => {
  const methods = useForm({
    defaultValues: {
      general: { notes: '' },
      physical: {
        location: '',
        intensity: '',
        description: ''
      },
      cognitive: {
        type: '',
        impact: '',
        management: ''
      },
      emotional: []
    },
    mode: 'onSubmit'
  });

  const onSubmit = methods.handleSubmit((data) => {
    console.log('Form data:', data);
  });

  const { formState: { errors } } = methods;

  return React.createElement(FormProvider, { ...methods },
    React.createElement('div', { className: 'w-full' },
      React.createElement('div', { 'data-testid': 'symptoms-header' },
        'Symptoms Assessment'
      ),
      React.createElement(Tabs, {
        defaultValue: 'general',
        'data-testid': 'symptoms-tabs'
      },
        React.createElement(TabsList, {
          'aria-label': 'Symptoms sections',
          role: 'tablist'
        },
          React.createElement(TabsTrigger, {
            value: 'general',
            role: 'tab'
          }, 'General'),
          React.createElement(TabsTrigger, {
            value: 'physical',
            role: 'tab'
          }, 'Physical'),
          React.createElement(TabsTrigger, {
            value: 'cognitive',
            role: 'tab'
          }, 'Cognitive'),
          React.createElement(TabsTrigger, {
            value: 'emotional',
            role: 'tab'
          }, 'Emotional')
        ),

        React.createElement(TabsContent, {
          value: 'general',
          role: 'tabpanel'
        },
          React.createElement('textarea', {
            placeholder: 'Add general notes...',
            'aria-label': 'general assessment',
            'data-testid': 'general-notes',
            name: 'general.notes',
            className: 'w-full p-2 min-h-[100px] border rounded'
          })
        ),

        React.createElement(TabsContent, {
          value: 'physical',
          role: 'tabpanel'
        },
          React.createElement(PhysicalSymptoms)
        ),

        React.createElement(TabsContent, {
          value: 'cognitive',
          role: 'tabpanel'
        },
          React.createElement(CognitiveSymptoms)
        ),

        React.createElement(TabsContent, {
          value: 'emotional',
          role: 'tabpanel'
        },
          React.createElement(EmotionalSymptoms)
        )
      ),
      React.createElement('button', {
        onClick: onSubmit,
        'aria-label': 'Submit assessment',
        'data-testid': 'submit-assessment',
        type: 'submit',
        className: 'mt-4 px-4 py-2 bg-blue-500 text-white rounded'
      }, 'Submit Assessment'),

      // Physical validation errors
      errors.physical?.location && React.createElement('div', {
        role: 'alert',
        className: 'text-red-500 mt-2'
      }, 'Location is required'),
      errors.physical?.intensity && React.createElement('div', {
        role: 'alert',
        className: 'text-red-500 mt-2'
      }, 'Intensity is required and must be between 1 and 10'),

      // Cognitive validation errors
      errors.cognitive?.type && React.createElement('div', {
        role: 'alert',
        className: 'text-red-500 mt-2'
      }, 'Type of cognitive issue is required'),
      errors.cognitive?.impact && React.createElement('div', {
        role: 'alert',
        className: 'text-red-500 mt-2'
      }, 'Impact description is required')
    )
  );
};

export default SymptomsAssessment;