import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SymptomsFormState } from '../types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const EmotionalSymptoms: React.FC = () => {
  const { register, watch, setValue } = useFormContext<SymptomsFormState>();
  const emotional = watch('emotional') || [];

  const addSymptom = () => {
    const newSymptom = {
      type: '',
      impact: '',
      management: '',
      severity: 'mild',
      frequency: 'daily',
      onset: '',
      aggravating: '',
      alleviating: ''
    };
    setValue('emotional', [...emotional, newSymptom]);
  };

  const removeSymptom = (index: number) => {
    const newSymptoms = emotional.filter((_, i) => i !== index);
    setValue('emotional', newSymptoms);
  };

  return (
    <div className="space-y-4">
      <button 
        type="button"
        onClick={addSymptom}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        role="button"
        aria-label="Add emotional symptom"
        data-testid="add-emotional-symptom"
      >
        Add Emotional Symptom
      </button>

      <Accordion type="multiple">
        {emotional.map((symptom, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            data-testid={`emotional-symptom-${index + 1}`}
          >
            <AccordionTrigger 
              role="button" 
              aria-expanded="false"
              aria-label={`Emotional symptom ${index + 1}`}
            >
              Emotional Symptom {index + 1}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                <div>
                  <label htmlFor={`emotion-type-${index}`}>Type of Emotional Response</label>
                  <select
                    id={`emotion-type-${index}`}
                    {...register(`emotional.${index}.type`)}
                    className="w-full p-2 border rounded"
                    aria-label="Type of emotional symptom"
                  >
                    <option value="">Select type</option>
                    <option value="anxiety">Anxiety</option>
                    <option value="depression">Depression</option>
                    <option value="mood">Mood Changes</option>
                    <option value="stress">Stress</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={`impact-${index}`}>Impact on Daily Life</label>
                  <textarea
                    id={`impact-${index}`}
                    {...register(`emotional.${index}.impact`)}
                    className="w-full p-2 border rounded"
                    aria-label="Impact on daily life"
                  />
                </div>

                <div>
                  <label htmlFor={`management-${index}`}>Management Strategies</label>
                  <textarea
                    id={`management-${index}`}
                    {...register(`emotional.${index}.management`)}
                    className="w-full p-2 border rounded"
                    aria-label="Management strategies"
                  />
                </div>

                <div>
                  <label htmlFor={`severity-${index}`}>Severity</label>
                  <select
                    id={`severity-${index}`}
                    {...register(`emotional.${index}.severity`)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={`frequency-${index}`}>Frequency</label>
                  <select
                    id={`frequency-${index}`}
                    {...register(`emotional.${index}.frequency`)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="intermittent">Intermittent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={`onset-${index}`}>Onset</label>
                  <input
                    type="text"
                    id={`onset-${index}`}
                    {...register(`emotional.${index}.onset`)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`aggravating-${index}`}>Aggravating Factors</label>
                  <textarea
                    id={`aggravating-${index}`}
                    {...register(`emotional.${index}.aggravating`)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label htmlFor={`alleviating-${index}`}>Alleviating Factors</label>
                  <textarea
                    id={`alleviating-${index}`}
                    {...register(`emotional.${index}.alleviating`)}
                    className="w-full p-2 border rounded"
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