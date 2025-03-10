import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, MinusCircle, InfoIcon } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

// Styled Symptoms Component for direct use in pages
export default function SymptomsComponent() {
  const { data, updateSection } = useAssessment();
  const [activeTab, setActiveTab] = useState('physical');
  const [formData, setFormData] = useState({
    physical: {
      location: 'Neck and upper back',
      intensity: '7',
      frequency: 'daily',
      duration: 'Several hours',
      description: 'Sharp pain when moving, dull ache when resting',
      aggravating: 'Sitting for long periods, looking down',
      alleviating: 'Heat, gentle stretching, NSAIDs'
    },
    cognitive: {
      type: 'concentration',
      frequency: 'daily',
      impact: 'Difficulty focusing on tasks for extended periods',
      triggers: 'Noise, visual distractions',
      management: 'Taking breaks, working in quiet environment'
    },
    emotional: [
      { type: 'anxiety', severity: 'moderate', frequency: 'daily', impact: 'Worry about recovery and future ability to work', management: 'Deep breathing, mindfulness' }
    ],
    notes: 'Symptoms are worse in the morning and improve somewhat throughout the day. Pain interferes with sleep quality.'
  });

  // Helper to update physical symptoms
  const updatePhysical = (field, value) => {
    setFormData({
      ...formData,
      physical: {
        ...formData.physical,
        [field]: value
      }
    });
  };

  // Helper to update cognitive symptoms
  const updateCognitive = (field, value) => {
    setFormData({
      ...formData,
      cognitive: {
        ...formData.cognitive,
        [field]: value
      }
    });
  };

  // Helper to add emotional symptom
  const addEmotionalSymptom = () => {
    setFormData({
      ...formData,
      emotional: [
        ...formData.emotional,
        { type: '', severity: 'mild', frequency: 'intermittent', impact: '', management: '' }
      ]
    });
  };

  // Helper to remove emotional symptom
  const removeEmotionalSymptom = (index) => {
    const newEmotional = [...formData.emotional];
    newEmotional.splice(index, 1);
    setFormData({ ...formData, emotional: newEmotional });
  };

  // Helper to update emotional symptom
  const updateEmotionalSymptom = (index, field, value) => {
    const newEmotional = [...formData.emotional];
    newEmotional[index] = { ...newEmotional[index], [field]: value };
    setFormData({ ...formData, emotional: newEmotional });
  };

  // Helper to update general notes
  const updateNotes = (value) => {
    setFormData({
      ...formData,
      notes: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create the data structure expected by the AssessmentContext
    const symptomsData = {
      physicalSymptoms: [{
        symptom: formData.physical.location,
        intensity: formData.physical.intensity,
        description: formData.physical.description,
        aggravatingFactors: formData.physical.aggravating,
        alleviatingFactors: formData.physical.alleviating,
        impactOnFunction: "Impact on daily activities"
      }],
      cognitiveSymptoms: [{
        symptom: formData.cognitive.type,
        severity: "Moderate",
        description: formData.cognitive.impact,
        frequency: formData.cognitive.frequency,
        impactOnFunction: formData.cognitive.impact
      }],
      emotionalSymptoms: formData.emotional.map(e => ({
        symptom: e.type,
        severity: e.severity,
        frequency: e.frequency,
        impactOnFunction: e.impact
      })),
      generalNotes: formData.notes
    };
    
    // Update the context with the form data
    updateSection('symptomsAssessment', symptomsData);
    
    // Show success message
    alert('Symptoms Assessment saved successfully!');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Symptoms Assessment</h2>
        <p className="text-sm text-gray-500 mt-1">Comprehensive evaluation of symptoms and their impact</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <Tabs defaultValue="physical" className="w-full border rounded-md">
          <TabsList className="w-full grid grid-cols-4 p-0 h-auto border-b">
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="physical"
            >
              Physical
            </TabsTrigger>
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="cognitive"
            >
              Cognitive
            </TabsTrigger>
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="emotional"
            >
              Emotional
            </TabsTrigger>
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="general"
            >
              General
            </TabsTrigger>
          </TabsList>

          {/* Physical Symptoms Tab */}
          <TabsContent value="physical" className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Physical Symptoms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input
                    value={formData.physical.location}
                    onChange={(e) => updatePhysical('location', e.target.value)}
                    placeholder="Where is the symptom located?"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Intensity (1-10) *</label>
                  <select
                    value={formData.physical.intensity}
                    onChange={(e) => updatePhysical('intensity', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i+1} value={String(i+1)}>
                        {i+1} - {i < 3 ? 'Mild' : i < 6 ? 'Moderate' : 'Severe'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency *</label>
                  <select
                    value={formData.physical.frequency}
                    onChange={(e) => updatePhysical('frequency', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="constant">Constant</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="intermittent">Intermittent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration *</label>
                  <input
                    value={formData.physical.duration}
                    onChange={(e) => updatePhysical('duration', e.target.value)}
                    placeholder="How long do symptoms last?"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={formData.physical.description}
                  onChange={(e) => updatePhysical('description', e.target.value)}
                  placeholder="Describe the symptoms in detail..."
                  className="min-h-[100px] w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Aggravating Factors</label>
                <input
                  value={formData.physical.aggravating}
                  onChange={(e) => updatePhysical('aggravating', e.target.value)}
                  placeholder="What makes the symptoms worse?"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Alleviating Factors</label>
                <input
                  value={formData.physical.alleviating}
                  onChange={(e) => updatePhysical('alleviating', e.target.value)}
                  placeholder="What makes the symptoms better?"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Cognitive Symptoms Tab */}
          <TabsContent value="cognitive" className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Cognitive Symptoms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select
                    value={formData.cognitive.type}
                    onChange={(e) => updateCognitive('type', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="memory">Memory Issues</option>
                    <option value="concentration">Concentration Problems</option>
                    <option value="attention">Attention Difficulties</option>
                    <option value="processing">Slow Processing Speed</option>
                    <option value="executive">Executive Function Issues</option>
                    <option value="language">Language/Communication Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency *</label>
                  <select
                    value={formData.cognitive.frequency}
                    onChange={(e) => updateCognitive('frequency', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="constant">Constant</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="situational">Situational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Impact on Daily Activities *</label>
                <textarea
                  value={formData.cognitive.impact}
                  onChange={(e) => updateCognitive('impact', e.target.value)}
                  placeholder="Describe how these symptoms affect daily functioning..."
                  className="min-h-[100px] w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Triggers</label>
                <input
                  value={formData.cognitive.triggers}
                  onChange={(e) => updateCognitive('triggers', e.target.value)}
                  placeholder="What triggers or worsens these symptoms?"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Management Strategies</label>
                <textarea
                  value={formData.cognitive.management}
                  onChange={(e) => updateCognitive('management', e.target.value)}
                  placeholder="What helps manage these symptoms?"
                  className="min-h-[80px] w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Emotional Symptoms Tab */}
          <TabsContent value="emotional" className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Emotional Symptoms</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addEmotionalSymptom}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Symptom
                </Button>
              </div>

              {formData.emotional.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
                  No emotional symptoms added. Click "Add Symptom" to begin.
                </div>
              )}

              {formData.emotional.map((symptom, index) => (
                <div 
                  key={index} 
                  className="border rounded-md p-4 space-y-4 relative"
                >
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => removeEmotionalSymptom(index)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                    size="sm"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select
                        value={symptom.type}
                        onChange={(e) => updateEmotionalSymptom(index, 'type', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Type</option>
                        <option value="anxiety">Anxiety</option>
                        <option value="depression">Depression</option>
                        <option value="irritability">Irritability</option>
                        <option value="mood-swings">Mood Swings</option>
                        <option value="grief">Grief</option>
                        <option value="ptsd">PTSD Symptoms</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Severity</label>
                      <select
                        value={symptom.severity}
                        onChange={(e) => updateEmotionalSymptom(index, 'severity', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Frequency</label>
                      <select
                        value={symptom.frequency}
                        onChange={(e) => updateEmotionalSymptom(index, 'frequency', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="situational">Situational</option>
                        <option value="intermittent">Intermittent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Impact</label>
                    <textarea
                      value={symptom.impact}
                      onChange={(e) => updateEmotionalSymptom(index, 'impact', e.target.value)}
                      placeholder="Describe how this affects daily life..."
                      className="min-h-[80px] w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Management</label>
                    <textarea
                      value={symptom.management}
                      onChange={(e) => updateEmotionalSymptom(index, 'management', e.target.value)}
                      placeholder="What helps manage this symptom?"
                      className="min-h-[80px] w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* General Notes Tab */}
          <TabsContent value="general" className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">General Notes</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateNotes(e.target.value)}
                  placeholder="Add any additional notes about the symptoms assessment here..."
                  className="min-h-[200px] w-full p-2 border rounded-md"
                />
              </div>

              <div className="text-gray-700 text-sm mt-4">
                <p>
                  Use this section to add any relevant information that doesn't fit in the other categories,
                  such as patterns over time, changes in symptoms, or other contextual information.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setFormData({
              physical: { location: '', intensity: '', frequency: '', duration: '', description: '', aggravating: '', alleviating: '' },
              cognitive: { type: '', frequency: '', impact: '', triggers: '', management: '' },
              emotional: [],
              notes: ''
            })}
            type="button"
          >
            Reset
          </Button>
          <Button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Symptoms Assessment
          </Button>
        </div>
      </form>
    </div>
  );
}
