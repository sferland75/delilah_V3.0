import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SymptomsFormState } from '../types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const PhysicalSymptoms: React.FC = () => {
  const { register, watch, setValue } = useFormContext<SymptomsFormState>();
  const locations = watch('physical.locations') || [];

  const addLocation = () => {
    const newLocation = {
      location: '',
      painType: '',
      description: '',
      aggravatingFactors: ''
    };
    setValue('physical.locations', [...locations, newLocation]);
  };

  const removeLocation = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setValue('physical.locations', newLocations);
  };

  return (
    <div className="space-y-4">
      <button 
        type="button"
        onClick={addLocation}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        role="button"
        aria-label="Add physical symptom"
      >
        Add Physical Symptom
      </button>

      <div className="space-y-4">
        {/* Body map */}
        <div 
          data-testid="body-map" 
          className="w-full h-96 bg-gray-100 relative"
          role="img"
          aria-label="Interactive body map"
        >
          {locations.map((loc, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-red-500 rounded-full"
              style={{ left: loc.x, top: loc.y }}
              role="button"
              aria-label={`Pain point ${index + 1}`}
            />
          ))}
        </div>

        <Accordion 
          type="multiple" 
          defaultValue={locations.map((_, i) => `item-${i}`)}
        >
          {locations.map((location, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              data-testid={`physical-symptom-${index + 1}`}
            >
              <AccordionTrigger
                role="button"
                aria-label={`Physical symptom ${index + 1}`}
              >
                <span>Physical Symptom {index + 1}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-4">
                  <div>
                    <label htmlFor={`location-${index}`}>Location</label>
                    <input
                      type="text"
                      id={`location-${index}`}
                      {...register(`physical.locations.${index}.location`)}
                      className="w-full p-2 border rounded"
                      aria-label="Symptom location"
                    />
                  </div>

                  <div>
                    <label htmlFor={`pain-type-${index}`}>Pain Type</label>
                    <select
                      id={`pain-type-${index}`}
                      {...register(`physical.locations.${index}.painType`)}
                      className="w-full p-2 border rounded"
                      aria-label="Type of pain"
                    >
                      <option value="">Select type</option>
                      <option value="sharp">Sharp</option>
                      <option value="dull">Dull</option>
                      <option value="throbbing">Throbbing</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`description-${index}`}>Description</label>
                    <textarea
                      id={`description-${index}`}
                      {...register(`physical.locations.${index}.description`)}
                      className="w-full p-2 border rounded"
                      aria-label="Symptom description"
                    />
                  </div>

                  <div>
                    <label htmlFor={`aggravating-${index}`}>Aggravating Factors</label>
                    <textarea
                      id={`aggravating-${index}`}
                      {...register(`physical.locations.${index}.aggravatingFactors`)}
                      className="w-full p-2 border rounded"
                      aria-label="Aggravating factors"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
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
    </div>
  );
};