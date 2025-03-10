'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

export function PhysicalSymptomsSelfContained() {
  const { data, updateSection } = useAssessment();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("pain");
  
  // Create default form state for physical symptoms section
  const defaultFormState = {
    data: {
      pain: {
        locations: [],
        patterns: {
          timing: '',
          intensity: '',
          triggers: '',
          relievingFactors: '',
          aggravatingFactors: ''
        }
      },
      sensory: {
        numbness: false,
        tingling: false,
        burning: false,
        locations: ''
      },
      motor: {
        weakness: false,
        coordination: false,
        balance: false,
        details: ''
      },
      cognitive: {
        memory: false,
        concentration: false,
        confusion: false,
        details: ''
      },
      other: {
        fatigue: false,
        dizziness: false,
        headache: false,
        sleepDisturbance: false,
        details: ''
      }
    }
  };
  
  // Simple form without zod validation
  const form = useForm({
    defaultValues: defaultFormState
  });
  
  // Update form from context data
  useEffect(() => {
    if (data?.symptomsAssessment) {
      try {
        const formData = { ...defaultFormState };
        
        // Map context data to form fields here
        if (data.symptomsAssessment.physicalSymptoms?.pain) {
          formData.data.pain.locations = data.symptomsAssessment.physicalSymptoms.pain.locations || [];
          
          if (data.symptomsAssessment.physicalSymptoms.pain.patterns) {
            formData.data.pain.patterns = {
              timing: data.symptomsAssessment.physicalSymptoms.pain.patterns.timing || '',
              intensity: data.symptomsAssessment.physicalSymptoms.pain.patterns.intensity || '',
              triggers: data.symptomsAssessment.physicalSymptoms.pain.patterns.triggers || '',
              relievingFactors: data.symptomsAssessment.physicalSymptoms.pain.patterns.relievingFactors || '',
              aggravatingFactors: data.symptomsAssessment.physicalSymptoms.pain.patterns.aggravatingFactors || ''
            };
          }
        }
        
        // Map other sensory data
        if (data.symptomsAssessment.physicalSymptoms?.neurological?.sensory) {
          const sensory = data.symptomsAssessment.physicalSymptoms.neurological.sensory;
          formData.data.sensory = {
            numbness: sensory.numbness || false,
            tingling: sensory.tingling || false,
            burning: sensory.burning || false,
            locations: sensory.locations || ''
          };
        }
        
        // Map motor data
        if (data.symptomsAssessment.physicalSymptoms?.neurological?.motor) {
          const motor = data.symptomsAssessment.physicalSymptoms.neurological.motor;
          formData.data.motor = {
            weakness: motor.weakness || false,
            coordination: motor.coordination || false,
            balance: motor.balance || false,
            details: motor.details || ''
          };
        }
        
        // Map cognitive data
        if (data.symptomsAssessment.physicalSymptoms?.neurological?.cognitive) {
          const cognitive = data.symptomsAssessment.physicalSymptoms.neurological.cognitive;
          formData.data.cognitive = {
            memory: cognitive.memory || false,
            concentration: cognitive.concentration || false,
            confusion: cognitive.confusion || false,
            details: cognitive.details || ''
          };
        }
        
        // Map other symptoms
        if (data.symptomsAssessment.physicalSymptoms?.other) {
          const other = data.symptomsAssessment.physicalSymptoms.other;
          formData.data.other = {
            fatigue: other.fatigue || false,
            dizziness: other.dizziness || false,
            headache: other.headache || false,
            sleepDisturbance: other.sleepDisturbance || false,
            details: other.details || ''
          };
        }
        
        // Set form data
        form.reset(formData);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error mapping context data to form:", error);
      }
    }
  }, [data?.symptomsAssessment]);
  
  // Handle form submission
  const onSubmit = (event) => {
    event.preventDefault();
    try {
      const formData = form.getValues();
      
      // Map form data to context structure
      const symptomsData = {
        physicalSymptoms: {
          pain: {
            locations: formData.data.pain.locations,
            patterns: formData.data.pain.patterns
          },
          neurological: {
            sensory: formData.data.sensory,
            motor: formData.data.motor,
            cognitive: formData.data.cognitive
          },
          other: formData.data.other
        }
      };
      
      // Update context
      updateSection('symptomsAssessment', symptomsData);
      alert('Physical Symptoms saved successfully!');
    } catch (error) {
      console.error("Error saving physical symptoms:", error);
      alert('Error saving Physical Symptoms: ' + error.message);
    }
  };
  
  // Pain Locations Content
  const PainLocationsContent = () => {
    const painLocations = form.watch('data.pain.locations') || [];
    
    const addPainLocation = () => {
      try {
        const currentLocations = form.getValues('data.pain.locations') || [];
        form.setValue('data.pain.locations', [
          ...currentLocations,
          { location: '', intensity: '', quality: '', frequency: '', description: '' }
        ]);
      } catch (error) {
        console.error("Error adding pain location:", error);
      }
    };
    
    const removePainLocation = (index) => {
      try {
        const currentLocations = [...form.getValues('data.pain.locations')];
        currentLocations.splice(index, 1);
        form.setValue('data.pain.locations', currentLocations);
      } catch (error) {
        console.error("Error removing pain location:", error);
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Pain Locations</h3>
          <Button 
            type="button" 
            variant="outline" 
            onClick={addPainLocation}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Pain Location
          </Button>
        </div>

        {painLocations.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
            No pain locations added. Click "Add Pain Location" to begin.
          </div>
        )}

        {painLocations.map((_, index) => (
          <div 
            key={index} 
            className="border rounded-md p-4 space-y-4 relative"
          >
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => removePainLocation(index)}
              className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
              size="sm"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <input
                  {...form.register(`data.pain.locations.${index}.location`)}
                  placeholder="E.g., Lower back, Neck, Left knee"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Intensity (0-10)</label>
                <input
                  {...form.register(`data.pain.locations.${index}.intensity`)}
                  placeholder="Scale of 0-10"
                  type="number"
                  min="0"
                  max="10"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quality</label>
                <select
                  {...form.register(`data.pain.locations.${index}.quality`)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select quality</option>
                  <option value="sharp">Sharp</option>
                  <option value="dull">Dull</option>
                  <option value="aching">Aching</option>
                  <option value="burning">Burning</option>
                  <option value="throbbing">Throbbing</option>
                  <option value="shooting">Shooting</option>
                  <option value="stabbing">Stabbing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select
                  {...form.register(`data.pain.locations.${index}.frequency`)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select frequency</option>
                  <option value="constant">Constant</option>
                  <option value="intermittent">Intermittent</option>
                  <option value="occasional">Occasional</option>
                  <option value="rare">Rare</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...form.register(`data.pain.locations.${index}.description`)}
                placeholder="Additional details about this pain"
                className="min-h-[80px] w-full p-2 border rounded-md"
              />
            </div>
          </div>
        ))}
        
        {/* Pain Patterns */}
        <div className="border rounded-md p-4 space-y-4 mt-8">
          <h4 className="font-medium">Pain Patterns</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Timing</label>
              <textarea
                {...form.register('data.pain.patterns.timing')}
                placeholder="When does the pain occur? (e.g., morning, evening, during activity)"
                className="min-h-[60px] w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Intensity Patterns</label>
              <textarea
                {...form.register('data.pain.patterns.intensity')}
                placeholder="How does the intensity vary throughout the day or with activities?"
                className="min-h-[60px] w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Triggers</label>
              <textarea
                {...form.register('data.pain.patterns.triggers')}
                placeholder="What triggers or causes the pain?"
                className="min-h-[60px] w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Aggravating Factors</label>
              <textarea
                {...form.register('data.pain.patterns.aggravatingFactors')}
                placeholder="What makes the pain worse?"
                className="min-h-[60px] w-full p-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Relieving Factors</label>
              <textarea
                {...form.register('data.pain.patterns.relievingFactors')}
                placeholder="What helps reduce the pain?"
                className="min-h-[60px] w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Sensory Symptoms Content
  const SensoryContent = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Sensory Symptoms</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sensory-numbness"
                {...form.register('data.sensory.numbness')}
                className="mr-2"
              />
              <label htmlFor="sensory-numbness">Numbness</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sensory-tingling"
                {...form.register('data.sensory.tingling')}
                className="mr-2"
              />
              <label htmlFor="sensory-tingling">Tingling</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sensory-burning"
                {...form.register('data.sensory.burning')}
                className="mr-2"
              />
              <label htmlFor="sensory-burning">Burning Sensation</label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Locations</label>
            <textarea
              {...form.register('data.sensory.locations')}
              placeholder="Where do these sensory symptoms occur?"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Motor Symptoms Content
  const MotorContent = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Motor Symptoms</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="motor-weakness"
                {...form.register('data.motor.weakness')}
                className="mr-2"
              />
              <label htmlFor="motor-weakness">Weakness</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="motor-coordination"
                {...form.register('data.motor.coordination')}
                className="mr-2"
              />
              <label htmlFor="motor-coordination">Coordination Problems</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="motor-balance"
                {...form.register('data.motor.balance')}
                className="mr-2"
              />
              <label htmlFor="motor-balance">Balance Problems</label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Details</label>
            <textarea
              {...form.register('data.motor.details')}
              placeholder="Describe any motor symptoms in detail (locations, severity, activities affected, etc.)"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Cognitive Symptoms Content
  const CognitiveContent = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Cognitive Symptoms</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cognitive-memory"
                {...form.register('data.cognitive.memory')}
                className="mr-2"
              />
              <label htmlFor="cognitive-memory">Memory Problems</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cognitive-concentration"
                {...form.register('data.cognitive.concentration')}
                className="mr-2"
              />
              <label htmlFor="cognitive-concentration">Concentration Problems</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cognitive-confusion"
                {...form.register('data.cognitive.confusion')}
                className="mr-2"
              />
              <label htmlFor="cognitive-confusion">Confusion</label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Details</label>
            <textarea
              {...form.register('data.cognitive.details')}
              placeholder="Describe any cognitive symptoms in detail (when they occur, severity, impact on daily life, etc.)"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Other Symptoms Content
  const OtherContent = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Other Physical Symptoms</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="other-fatigue"
                {...form.register('data.other.fatigue')}
                className="mr-2"
              />
              <label htmlFor="other-fatigue">Fatigue</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="other-dizziness"
                {...form.register('data.other.dizziness')}
                className="mr-2"
              />
              <label htmlFor="other-dizziness">Dizziness</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="other-headache"
                {...form.register('data.other.headache')}
                className="mr-2"
              />
              <label htmlFor="other-headache">Headache</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="other-sleep"
                {...form.register('data.other.sleepDisturbance')}
                className="mr-2"
              />
              <label htmlFor="other-sleep">Sleep Disturbance</label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Details</label>
            <textarea
              {...form.register('data.other.details')}
              placeholder="Describe any other physical symptoms in detail"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Physical Symptoms</h2>
        <p className="text-sm text-muted-foreground mt-1">Record pain and other physical symptoms</p>
      </div>
      
      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Physical symptoms information has been pre-populated from previous assessments. Please review and adjust as needed.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full border rounded-md">
          <div className="grid w-full grid-cols-5 p-0 h-auto border-b">
            <button
              type="button"
              className={`py-2 rounded-none ${activeTab === "pain" 
                ? "border-b-2 border-blue-600 text-blue-600" 
                : "border-b border-gray-200 text-gray-600"}`}
              onClick={() => setActiveTab("pain")}
            >
              Pain
            </button>
            <button
              type="button"
              className={`py-2 rounded-none ${activeTab === "sensory" 
                ? "border-b-2 border-blue-600 text-blue-600" 
                : "border-b border-gray-200 text-gray-600"}`}
              onClick={() => setActiveTab("sensory")}
            >
              Sensory
            </button>
            <button
              type="button"
              className={`py-2 rounded-none ${activeTab === "motor" 
                ? "border-b-2 border-blue-600 text-blue-600" 
                : "border-b border-gray-200 text-gray-600"}`}
              onClick={() => setActiveTab("motor")}
            >
              Motor
            </button>
            <button
              type="button"
              className={`py-2 rounded-none ${activeTab === "cognitive" 
                ? "border-b-2 border-blue-600 text-blue-600" 
                : "border-b border-gray-200 text-gray-600"}`}
              onClick={() => setActiveTab("cognitive")}
            >
              Cognitive
            </button>
            <button
              type="button"
              className={`py-2 rounded-none ${activeTab === "other" 
                ? "border-b-2 border-blue-600 text-blue-600" 
                : "border-b border-gray-200 text-gray-600"}`}
              onClick={() => setActiveTab("other")}
            >
              Other
            </button>
          </div>

          <div className="p-6">
            {activeTab === "pain" && <PainLocationsContent />}
            {activeTab === "sensory" && <SensoryContent />}
            {activeTab === "motor" && <MotorContent />}
            {activeTab === "cognitive" && <CognitiveContent />}
            {activeTab === "other" && <OtherContent />}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => form.reset(defaultFormState)}
            type="button"
          >
            Reset
          </Button>
          <Button 
            type="submit"
          >
            Save Physical Symptoms
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PhysicalSymptomsSelfContained;