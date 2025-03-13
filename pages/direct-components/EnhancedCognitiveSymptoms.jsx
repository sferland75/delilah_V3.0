import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, MinusCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Cognitive symptom types
const cognitiveSymptoms = [
  "Memory problems",
  "Difficulty concentrating",
  "Mental fatigue",
  "Confusion",
  "Disorientation",
  "Slow thinking",
  "Difficulty finding words",
  "Difficulty making decisions",
  "Difficulty planning",
  "Difficulty organizing thoughts",
  "Difficulty multitasking",
  "Difficulty following conversations",
  "Difficulty reading",
  "Difficulty with math/numbers",
  "Decreased awareness",
  "Brain fog",
  "Other (See comments)"
];

// Frequency options
const frequencyOptions = [
  "Rarely - Once a week or less",
  "Occasionally - A few times a week",
  "Frequently - Daily but not constant",
  "Constantly - Throughout the day",
  "Situational - Only during specific activities",
  "Other (See comments)"
];

// Impact options
const impactOptions = [
  "Minimal - Noticeable but doesn't affect daily life",
  "Mild - Slightly affects daily activities",
  "Moderate - Definitely affects daily activities",
  "Severe - Significantly limits daily activities",
  "Profound - Prevents normal functioning",
  "Other (See comments)"
];

export default function EnhancedCognitiveSymptoms({ formData, updateFormData }) {
  const [symptoms, setSymptoms] = useState([]);
  const [showAddSymptomForm, setShowAddSymptomForm] = useState(false);
  const [newSymptom, setNewSymptom] = useState({
    symptomType: "",
    frequency: "",
    impact: "",
    comments: ""
  });

  // Initialize symptoms from formData if available
  useEffect(() => {
    console.log("Cognitive formData received:", formData?.cognitive);
    if (formData?.cognitive?.symptoms && Array.isArray(formData.cognitive.symptoms)) {
      setSymptoms(formData.cognitive.symptoms);
    }
  }, [formData]);

  // Update parent form data when symptoms change
  useEffect(() => {
    if (updateFormData && symptoms.length >= 0) {
      console.log("Updating cognitive symptoms:", symptoms);
      updateFormData("cognitive", { symptoms });
    }
  }, [symptoms, updateFormData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setNewSymptom({
      ...newSymptom,
      [field]: value
    });
  };

  // Add symptom to the list
  const handleAddSymptom = () => {
    if (newSymptom.symptomType && newSymptom.frequency && newSymptom.impact) {
      const symptomToAdd = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...newSymptom
      };
      
      const updatedSymptoms = [...symptoms, symptomToAdd];
      setSymptoms(updatedSymptoms);
      console.log("Added cognitive symptom:", symptomToAdd);
      console.log("Updated cognitive symptoms list:", updatedSymptoms);
      
      // Reset form
      setNewSymptom({
        symptomType: "",
        frequency: "",
        impact: "",
        comments: ""
      });
      setShowAddSymptomForm(false);
    }
  };

  // Remove symptom from the list
  const handleRemoveSymptom = (id) => {
    const updatedSymptoms = symptoms.filter(s => s.id !== id);
    setSymptoms(updatedSymptoms);
    console.log("Removed cognitive symptom with ID:", id);
    console.log("Updated cognitive symptoms list:", updatedSymptoms);
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Cognitive Symptoms Assessment</AlertTitle>
        <AlertDescription className="text-blue-700">
          Document cognitive symptoms by selecting the type of symptom, frequency, and impact on daily life. Add detailed information in the comments section.
        </AlertDescription>
      </Alert>

      {/* Symptom List */}
      {symptoms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Documented Cognitive Symptoms ({symptoms.length})</h3>
          <div className="space-y-3">
            {symptoms.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.symptomType}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSymptom(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Frequency:</span> {item.frequency}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Impact:</span> {item.impact}
                        </div>
                      </div>
                      {item.comments && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Comments:</span> {item.comments}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Symptom Button */}
      {!showAddSymptomForm && (
        <Button
          type="button"
          onClick={() => setShowAddSymptomForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Cognitive Symptom
        </Button>
      )}

      {/* Add Symptom Form */}
      {showAddSymptomForm && (
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="text-lg font-medium">Add New Cognitive Symptom</h3>
          
          {/* Symptom Type */}
          <div className="space-y-2">
            <Label htmlFor="symptomType">Symptom Type</Label>
            <select
              id="symptomType"
              className="w-full p-2 border rounded-md"
              value={newSymptom.symptomType}
              onChange={(e) => handleInputChange("symptomType", e.target.value)}
              required
            >
              <option value="">Select Symptom Type</option>
              {cognitiveSymptoms.map((symptom) => (
                <option key={symptom} value={symptom}>{symptom}</option>
              ))}
            </select>
          </div>
          
          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <select
              id="frequency"
              className="w-full p-2 border rounded-md"
              value={newSymptom.frequency}
              onChange={(e) => handleInputChange("frequency", e.target.value)}
              required
            >
              <option value="">Select Frequency</option>
              {frequencyOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          {/* Impact */}
          <div className="space-y-2">
            <Label htmlFor="impact">Impact on Daily Life</Label>
            <select
              id="impact"
              className="w-full p-2 border rounded-md"
              value={newSymptom.impact}
              onChange={(e) => handleInputChange("impact", e.target.value)}
              required
            >
              <option value="">Select Impact</option>
              {impactOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={newSymptom.comments}
              onChange={(e) => handleInputChange("comments", e.target.value)}
              placeholder="Add any additional details about this cognitive symptom"
              rows={3}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddSymptomForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddSymptom}
              disabled={!newSymptom.symptomType || !newSymptom.frequency || !newSymptom.impact}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Symptom
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 