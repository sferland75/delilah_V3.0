import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Toast } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmotionalSymptom {
  type: string;
  description: string;
  severity: string;
  triggers: string[];
}

export const EmotionalSymptoms = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext();
  const [symptoms, setSymptoms] = React.useState<EmotionalSymptom[]>([]);
  const [validationError, setValidationError] = React.useState<string>('');

  // Initialize from form context
  React.useEffect(() => {
    const formSymptoms = watch('emotional');
    if (Array.isArray(formSymptoms)) {
      setSymptoms(formSymptoms);
    }
  }, [watch]);

  const addSymptom = () => {
    // Check for required cognitive fields
    const cognitive = watch('cognitive');
    if (!cognitive?.type || !cognitive?.impact) {
      setValidationError('Complete cognitive assessment first');
      return;
    }

    const newSymptom = {
      type: '',
      description: '',
      severity: '',
      triggers: []
    };
    const newSymptoms = [...symptoms, newSymptom];
    setSymptoms(newSymptoms);
    setValue('emotional', newSymptoms);
    setValidationError('');
  };

  const removeSymptom = (index: number) => {
    const newSymptoms = symptoms.filter((_, i) => i !== index);
    setSymptoms(newSymptoms);
    setValue('emotional', newSymptoms);
  };

  const onSave = (symptom: EmotionalSymptom) => {
    if (!symptom.type) {
      setValidationError('Select at least one symptom');
      return;
    }
    setValidationError('');
  };

  return React.createElement('div',
    {
      className: 'space-y-4',
      role: 'region',
      'aria-label': 'Emotional Symptoms Section'
    },
    [
      React.createElement('div', { key: 'header' },
        React.createElement('h3',
          { className: 'text-lg font-semibold mb-2' },
          'Emotional Symptoms'
        ),
        React.createElement(Button, {
          onClick: addSymptom,
          'aria-label': 'add emotional symptom',
          'data-testid': 'add-emotional-button',
          role: 'button'
        }, 'Add Emotional Symptom')
      ),

      React.createElement('div',
        {
          key: 'symptoms-list',
          className: 'space-y-4',
          'data-testid': 'emotional-symptoms-list'
        },
        symptoms.map((symptom, index) =>
          React.createElement('div',
            {
              key: index,
              className: 'border p-4 rounded',
              'data-testid': `emotional-symptom-${index + 1}`
            },
            [
              React.createElement('div', { key: 'symptomType' },
                React.createElement(Label, { 
                  htmlFor: `emotional.${index}.type`,
                  className: 'block mb-2',
                  id: `emotional-anxiety-label-${index}`
                }, 'Anxiety'),
                React.createElement('input', {
                  ...register(`emotional.${index}.type`),
                  id: `emotional.${index}.anxiety`,
                  type: 'checkbox',
                  value: 'anxiety',
                  'aria-label': 'anxiety',
                  'data-testid': `emotional-anxiety-${index + 1}`
                })
              ),

              React.createElement('div', { key: 'intensity', className: 'mt-4' },
                React.createElement(Label, { 
                  htmlFor: `emotional.${index}.intensity`,
                  className: 'block mb-2'
                }, 'Intensity'),
                React.createElement('input', {
                  ...register(`emotional.${index}.intensity`),
                  type: 'range',
                  min: '0',
                  max: '10',
                  step: '1',
                  id: `emotional.${index}.intensity`,
                  role: 'slider',
                  'aria-label': 'intensity',
                  'data-testid': `emotional-intensity-${index + 1}`
                })
              ),

              React.createElement('div', { key: 'aggravatingFactors', className: 'mt-4' },
                React.createElement(Label, { 
                  htmlFor: `emotional.${index}.aggravatingFactors`,
                  className: 'block mb-2'
                }, 'Aggravating Factors'),
                React.createElement(Input, {
                  ...register(`emotional.${index}.aggravatingFactors`),
                  placeholder: 'Enter aggravating factors',
                  id: `emotional.${index}.aggravatingFactors`,
                  'data-testid': `emotional-factors-${index + 1}`
                })
              ),

              React.createElement('div', { key: 'triggers', className: 'mt-4' },
                React.createElement(Label, { 
                  htmlFor: `emotional.${index}.triggers`,
                  className: 'block mb-2'
                }, 'Triggers (comma-separated)'),
                React.createElement(Input, {
                  ...register(`emotional.${index}.triggers`),
                  placeholder: 'Enter triggers',
                  id: `emotional.${index}.triggers`,
                  'data-testid': `emotional-triggers-${index + 1}`,
                  onChange: (e) => {
                    const triggers = e.target.value.split(',').map(t => t.trim());
                    setValue(`emotional.${index}.triggers`, triggers);
                  }
                })
              ),

              React.createElement('div', { key: 'actions', className: 'mt-4 space-x-2' },
                React.createElement(Button, {
                  onClick: () => onSave(symptom),
                  'aria-label': `save emotional symptom ${index + 1}`,
                  'data-testid': `save-emotional-${index + 1}`,
                  role: 'button'
                }, 'Save Emotional'),
                React.createElement(Button, {
                  onClick: () => removeSymptom(index),
                  variant: 'destructive',
                  'aria-label': `remove emotional symptom ${index + 1}`,
                  'data-testid': `remove-emotional-${index + 1}`,
                  role: 'button'
                }, 'Remove')
              )
            ]
          )
        )
      ),

      validationError && React.createElement(Toast, {
        key: 'error',
        variant: 'error',
        'data-testid': 'validation-error'
      }, validationError)
    ]
  );
};