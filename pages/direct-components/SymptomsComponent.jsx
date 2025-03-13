import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, MinusCircle, InfoIcon, AlertCircle } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useToast } from '@/components/ui/use-toast';

// Styled Symptoms Component for direct use in pages
export default function SymptomsComponent() {
  const { data, updateSection, saveCurrentAssessment } = useAssessment();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('physical');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    physical: {
      primarySymptoms: [],
      secondarySymptoms: [],
      painRating: '0',
      location: '',
      intensity: '',
      frequency: '',
      duration: '',
      description: '',
      aggravating: '',
      alleviating: ''
    },
    cognitive: {
      type: '',
      frequency: '',
      impact: '',
      triggers: '',
      management: ''
    },
    emotional: [
      { type: '', severity: '', frequency: '', impact: '', management: '' }
    ],
    notes: ''
  });

  // Common symptom types
  const painSymptoms = [
    'Headache', 
    'Neck Pain', 
    'Back Pain', 
    'Joint Pain', 
    'Muscle Pain'
  ];
  
  const neurologicalSymptoms = [
    'Dizziness',
    'Fatigue',
    'Memory Issues',
    'Concentration Problems',
    'Sleep Disturbances'
  ];

  // Load data from context when component mounts
  useEffect(() => {
    if (data?.symptomsAssessment) {
      setFormData({
        ...formData,
        ...data.symptomsAssessment
      });
    }
    setLoading(false);
  }, [data]);

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

  // Helper to handle checkbox arrays
  const handleCheckboxChange = (array, value) => {
    if (formData.physical[array].includes(value)) {
      updatePhysical(array, formData.physical[array].filter(item => item !== value));
    } else {
      updatePhysical(array, [...formData.physical[array], value]);
    }
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
        { type: '', severity: '', frequency: '', impact: '', management: '' }
      ]
    });
  };

  // Helper to remove emotional symptom
  const removeEmotionalSymptom = (index) => {
    const newEmotional = [...formData.emotional];
    newEmotional.splice(index, 1);
    setFormData({
      ...formData,
      emotional: newEmotional
    });
  };

  // Helper to update emotional symptom
  const updateEmotionalSymptom = (index, field, value) => {
    const newEmotional = [...formData.emotional];
    newEmotional[index] = {
      ...newEmotional[index],
      [field]: value
    };
    setFormData({
      ...formData,
      emotional: newEmotional
    });
  };

  // Helper to update notes
  const updateNotes = (value) => {
    setFormData({
      ...formData,
      notes: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Update the assessment context with the form data
      await updateSection('symptomsAssessment', formData);
      
      // Save the assessment
      await saveCurrentAssessment();
      
      toast({
        title: "Symptoms Assessment Saved",
        description: "Your symptoms assessment has been saved successfully.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error saving symptoms assessment:", error);
      toast({
        title: "Error Saving",
        description: "There was a problem saving your symptoms assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">Loading symptoms assessment...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="physical">Physical Symptoms</TabsTrigger>
            <TabsTrigger value="cognitive">Cognitive Symptoms</TabsTrigger>
            <TabsTrigger value="emotional">Emotional Symptoms</TabsTrigger>
          </TabsList>
          
          {/* Physical Symptoms Tab */}
          <TabsContent value="physical" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Primary Pain Symptoms</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {painSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`primary-${symptom}`} 
                        checked={formData.physical.primarySymptoms.includes(symptom)}
                        onCheckedChange={() => handleCheckboxChange('primarySymptoms', symptom)}
                      />
                      <Label htmlFor={`primary-${symptom}`}>{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Secondary Neurological Symptoms</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {neurologicalSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`secondary-${symptom}`} 
                        checked={formData.physical.secondarySymptoms.includes(symptom)}
                        onCheckedChange={() => handleCheckboxChange('secondarySymptoms', symptom)}
                      />
                      <Label htmlFor={`secondary-${symptom}`}>{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="painRating">Pain Rating (0-10)</Label>
                  <select
                    id="painRating"
                    className="w-full p-2 border rounded-md"
                    value={formData.physical.painRating}
                    onChange={(e) => updatePhysical('painRating', e.target.value)}
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i.toString()}>
                        {i} - {i === 0 ? 'No Pain' : i <= 3 ? 'Mild' : i <= 6 ? 'Moderate' : 'Severe'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Pain Location</Label>
                  <Input 
                    id="location" 
                    value={formData.physical.location} 
                    onChange={(e) => updatePhysical('location', e.target.value)}
                    placeholder="e.g., Neck and upper back"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="intensity">Intensity</Label>
                  <select
                    id="intensity"
                    className="w-full p-2 border rounded-md"
                    value={formData.physical.intensity}
                    onChange={(e) => updatePhysical('intensity', e.target.value)}
                  >
                    <option value="">Select Intensity</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Very Severe">Very Severe</option>
                    <option value="Unbearable">Unbearable</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <select
                    id="frequency"
                    className="w-full p-2 border rounded-md"
                    value={formData.physical.frequency}
                    onChange={(e) => updatePhysical('frequency', e.target.value)}
                  >
                    <option value="">Select Frequency</option>
                    <option value="Constant">Constant</option>
                    <option value="Daily">Daily</option>
                    <option value="Several times per week">Several times per week</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Intermittent">Intermittent</option>
                    <option value="Situational">Situational</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <select
                    id="duration"
                    className="w-full p-2 border rounded-md"
                    value={formData.physical.duration}
                    onChange={(e) => updatePhysical('duration', e.target.value)}
                  >
                    <option value="">Select Duration</option>
                    <option value="Momentary">Momentary</option>
                    <option value="Minutes">Minutes</option>
                    <option value="Hours">Hours</option>
                    <option value="Several hours">Several hours</option>
                    <option value="All day">All day</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Chronic">Chronic</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Symptom Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.physical.description} 
                  onChange={(e) => updatePhysical('description', e.target.value)}
                  placeholder="Describe the nature of the symptoms (e.g., sharp, dull, throbbing)"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aggravating">Aggravating Factors</Label>
                  <div className="flex flex-col space-y-2">
                    <select
                      className="w-full p-2 border rounded-md"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const currentValue = formData.physical.aggravating;
                          const newValue = currentValue 
                            ? `${currentValue}, ${e.target.value}` 
                            : e.target.value;
                          updatePhysical('aggravating', newValue);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">Add common aggravating factor</option>
                      <option value="Sitting for long periods">Sitting for long periods</option>
                      <option value="Standing for long periods">Standing for long periods</option>
                      <option value="Walking">Walking</option>
                      <option value="Bending">Bending</option>
                      <option value="Lifting">Lifting</option>
                      <option value="Stress">Stress</option>
                      <option value="Weather changes">Weather changes</option>
                      <option value="Morning stiffness">Morning stiffness</option>
                      <option value="End of day fatigue">End of day fatigue</option>
                    </select>
                    <Textarea 
                      id="aggravating" 
                      value={formData.physical.aggravating} 
                      onChange={(e) => updatePhysical('aggravating', e.target.value)}
                      placeholder="What makes the symptoms worse?"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alleviating">Alleviating Factors</Label>
                  <div className="flex flex-col space-y-2">
                    <select
                      className="w-full p-2 border rounded-md"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const currentValue = formData.physical.alleviating;
                          const newValue = currentValue 
                            ? `${currentValue}, ${e.target.value}` 
                            : e.target.value;
                          updatePhysical('alleviating', newValue);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">Add common alleviating factor</option>
                      <option value="Rest">Rest</option>
                      <option value="Heat">Heat</option>
                      <option value="Ice">Ice</option>
                      <option value="Medication">Medication</option>
                      <option value="Stretching">Stretching</option>
                      <option value="Exercise">Exercise</option>
                      <option value="Massage">Massage</option>
                      <option value="Position change">Position change</option>
                      <option value="Relaxation techniques">Relaxation techniques</option>
                    </select>
                    <Textarea 
                      id="alleviating" 
                      value={formData.physical.alleviating} 
                      onChange={(e) => updatePhysical('alleviating', e.target.value)}
                      placeholder="What helps reduce the symptoms?"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Cognitive Symptoms Tab */}
          <TabsContent value="cognitive" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cognitiveType">Type of Cognitive Symptom</Label>
                <Input 
                  id="cognitiveType" 
                  value={formData.cognitive.type} 
                  onChange={(e) => updateCognitive('type', e.target.value)}
                  placeholder="e.g., Memory loss, Concentration issues"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cognitiveFrequency">Frequency</Label>
                <Input 
                  id="cognitiveFrequency" 
                  value={formData.cognitive.frequency} 
                  onChange={(e) => updateCognitive('frequency', e.target.value)}
                  placeholder="e.g., Daily, Several times per week"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cognitiveImpact">Impact on Daily Life</Label>
                <Textarea 
                  id="cognitiveImpact" 
                  value={formData.cognitive.impact} 
                  onChange={(e) => updateCognitive('impact', e.target.value)}
                  placeholder="How do these symptoms affect daily activities?"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cognitiveTriggers">Triggers</Label>
                <Textarea 
                  id="cognitiveTriggers" 
                  value={formData.cognitive.triggers} 
                  onChange={(e) => updateCognitive('triggers', e.target.value)}
                  placeholder="What situations or factors trigger these symptoms?"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cognitiveManagement">Management Strategies</Label>
                <Textarea 
                  id="cognitiveManagement" 
                  value={formData.cognitive.management} 
                  onChange={(e) => updateCognitive('management', e.target.value)}
                  placeholder="What strategies help manage these symptoms?"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Emotional Symptoms Tab */}
          <TabsContent value="emotional" className="space-y-6 pt-4">
            <div className="space-y-4">
              {formData.emotional.map((symptom, index) => (
                <Card key={index} className="p-4 relative">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeEmotionalSymptom(index)}
                    >
                      <MinusCircle className="h-5 w-5 text-red-500" />
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`emotionalType-${index}`}>Type of Emotional Symptom</Label>
                      <Input 
                        id={`emotionalType-${index}`} 
                        value={symptom.type} 
                        onChange={(e) => updateEmotionalSymptom(index, 'type', e.target.value)}
                        placeholder="e.g., Anxiety, Depression, Irritability"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`emotionalSeverity-${index}`}>Severity</Label>
                      <Input 
                        id={`emotionalSeverity-${index}`} 
                        value={symptom.severity} 
                        onChange={(e) => updateEmotionalSymptom(index, 'severity', e.target.value)}
                        placeholder="e.g., Mild, Moderate, Severe"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor={`emotionalFrequency-${index}`}>Frequency</Label>
                    <Input 
                      id={`emotionalFrequency-${index}`} 
                      value={symptom.frequency} 
                      onChange={(e) => updateEmotionalSymptom(index, 'frequency', e.target.value)}
                      placeholder="e.g., Daily, Several times per week"
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor={`emotionalImpact-${index}`}>Impact on Daily Life</Label>
                    <Textarea 
                      id={`emotionalImpact-${index}`} 
                      value={symptom.impact} 
                      onChange={(e) => updateEmotionalSymptom(index, 'impact', e.target.value)}
                      placeholder="How do these symptoms affect daily activities?"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`emotionalManagement-${index}`}>Management Strategies</Label>
                    <Textarea 
                      id={`emotionalManagement-${index}`} 
                      value={symptom.management} 
                      onChange={(e) => updateEmotionalSymptom(index, 'management', e.target.value)}
                      placeholder="What strategies help manage these symptoms?"
                      rows={2}
                    />
                  </div>
                </Card>
              ))}
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addEmotionalSymptom}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Another Emotional Symptom
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="Any additional information about symptoms not covered above"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? 'Saving...' : 'Save Symptoms Assessment'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
