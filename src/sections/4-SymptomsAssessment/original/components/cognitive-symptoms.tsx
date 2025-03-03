import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SymptomsFormState } from '../types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CognitiveSymptomsProps {
  className?: string;
}

export const CognitiveSymptoms: React.FC<CognitiveSymptomsProps> = ({ className }) => {
  const { register, watch, setValue } = useFormContext<SymptomsFormState>();
  const symptoms = watch('cognitive.symptoms') || [];

  const addSymptom = React.useCallback(() => {
    const newSymptom = {
      type: '',
      description: '',
      impact: '',
      management: '',
      frequency: 'daily'
    };
    setValue('cognitive.symptoms', [...symptoms, newSymptom]);
  }, [symptoms, setValue]);

  const removeSymptom = React.useCallback((index: number) => {
    const newSymptoms = symptoms.filter((_, i) => i !== index);
    setValue('cognitive.symptoms', newSymptoms);
  }, [symptoms, setValue]);

  // Initialize empty array if no symptoms exist
  React.useEffect(() => {
    if (symptoms === undefined) {
      setValue('cognitive.symptoms', []);
    }
  }, []); // Only run once on mount

  return (
    <div className="space-y-4">
      <button 
        type="button"
        onClick={addSymptom}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        role="button"
        aria-label="Add cognitive symptom"
      >
        Add Cognitive Symptom
      </button>

      <Accordion 
        type="multiple" 
        value={symptoms.map((_, i) => `item-${i}`)}
        className="space-y-4"
      >
        {symptoms.map((symptom, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            data-testid={`cognitive-symptom-${index + 1}`}
            className="border rounded p-2"
          >
            <AccordionTrigger 
              role="button" 
              aria-label={`Cognitive symptom ${index + 1}`}
              className="w-full text-left font-medium p-4"
            >
              Cognitive Symptom {index + 1}
            </AccordionTrigger>
            <AccordionContent data-testid="accordion-content">
              <div className="space-y-4 p-4">
                <div>
                  <label htmlFor={`type-${index}`}>Type of Cognitive Symptom</label>
                  <select
                    id={`type-${index}`}
                    {...register(`cognitive.symptoms.${index}.type`)}
                    className="w-full p-2 border rounded"
                    aria-label="Type of cognitive symptom"
                  >
                    <option value="">Select type</option>
                    <option value="memory">Memory</option>
                    <option value="attention">Attention</option>
                    <option value="processing">Processing Speed</option>
                    <option value="executive">Executive Function</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={`description-${index}`}>Description</label>
                  <textarea
                    id={`description-${index}`}
                    {...register(`cognitive.symptoms.${index}.description`)}
                    className="w-full p-2 border rounded"
                    aria-label="Symptom description"
                  />
                </div>

                <div>
                  <label htmlFor={`impact-${index}`}>Functional Impact</label>
                  <textarea
                    id={`impact-${index}`}
                    {...register(`cognitive.symptoms.${index}.impact`)}
                    className="w-full p-2 border rounded"
                    aria-label="Functional impact"
                  />
                </div>

                <div>
                  <label htmlFor={`management-${index}`}>Management Strategies</label>
                  <textarea
                    id={`management-${index}`}
                    {...register(`cognitive.symptoms.${index}.management`)}
                    className="w-full p-2 border rounded"
                    aria-label="Management strategies"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeSymptom(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  role="button"
                  aria-label="Remove"
                >
                  Remove
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};