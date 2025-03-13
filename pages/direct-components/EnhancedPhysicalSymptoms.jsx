import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, MinusCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Body locations
const bodyLocations = [
  "Head",
  "Neck",
  "Shoulder - Left",
  "Shoulder - Right",
  "Arm - Left",
  "Arm - Right",
  "Elbow - Left",
  "Elbow - Right",
  "Wrist - Left",
  "Wrist - Right",
  "Hand - Left",
  "Hand - Right",
  "Upper back",
  "Middle back",
  "Lower back",
  "Hip - Left",
  "Hip - Right",
  "Leg - Left",
  "Leg - Right",
  "Knee - Left",
  "Knee - Right",
  "Ankle - Left",
  "Ankle - Right",
  "Foot - Left",
  "Foot - Right",
  "Chest",
  "Abdomen",
  "Other (See comments)"
];

// Pain types
const painTypes = [
  "Sharp",
  "Dull",
  "Aching",
  "Throbbing",
  "Burning",
  "Stabbing",
  "Shooting",
  "Tingling",
  "Numbness",
  "Stiffness",
  "Cramping",
  "Spasm",
  "Pressure",
  "Tightness",
  "Weakness",
  "Other (See comments)"
];

// Intensity levels
const intensityLevels = [
  "1 - Barely noticeable",
  "2 - Mild, occasionally noticeable",
  "3 - Mild, frequently noticeable",
  "4 - Moderate, occasionally limits activities",
  "5 - Moderate, frequently limits activities",
  "6 - Moderate-severe, significantly limits activities",
  "7 - Severe, prevents most activities",
  "8 - Severe, prevents all activities except basic needs",
  "9 - Excruciating, unable to speak or move",
  "10 - Worst pain imaginable, emergency level"
];

export default function EnhancedPhysicalSymptoms({ formData, updateFormData }) {
  const [symptoms, setSymptoms] = useState([]);
  const [showAddSymptomForm, setShowAddSymptomForm] = useState(false);
  const [newSymptom, setNewSymptom] = useState({
    location: "",
    painType: "",
    intensity: "",
    comments: ""
  });

  // Initialize symptoms from formData if available
  useEffect(() => {
    console.log("Physical formData received:", formData?.physical);
    if (formData?.physical?.symptoms && Array.isArray(formData.physical.symptoms)) {
      setSymptoms(formData.physical.symptoms);
    }
  }, [formData]);

  // Update parent form data when symptoms change
  useEffect(() => {
    if (updateFormData && symptoms.length >= 0) {
      console.log("Updating physical symptoms:", symptoms);
      updateFormData("physical", { symptoms });
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
    if (newSymptom.location && newSymptom.painType && newSymptom.intensity) {
      const symptomToAdd = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...newSymptom
      };
      
      const updatedSymptoms = [...symptoms, symptomToAdd];
      setSymptoms(updatedSymptoms);
      console.log("Added physical symptom:", symptomToAdd);
      console.log("Updated physical symptoms list:", updatedSymptoms);
      
      // Reset form
      setNewSymptom({
        location: "",
        painType: "",
        intensity: "",
        comments: ""
      });
      setShowAddSymptomForm(false);
    }
  };

  // Remove symptom from the list
  const handleRemoveSymptom = (id) => {
    const updatedSymptoms = symptoms.filter(s => s.id !== id);
    setSymptoms(updatedSymptoms);
    console.log("Removed physical symptom with ID:", id);
    console.log("Updated physical symptoms list:", updatedSymptoms);
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Physical Symptoms Assessment</AlertTitle>
        <AlertDescription className="text-blue-700">
          Document physical symptoms by selecting the location, pain type, and intensity. Add detailed information in the comments section.
        </AlertDescription>
      </Alert>

      {/* Symptom List */}
      {symptoms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Documented Physical Symptoms ({symptoms.length})</h3>
          <div className="space-y-3">
            {symptoms.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.location}</h4>
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
                          <span className="font-medium">Pain Type:</span> {item.painType}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Intensity:</span> {item.intensity}
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
          Add Physical Symptom
        </Button>
      )}

      {/* Add Symptom Form */}
      {showAddSymptomForm && (
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="text-lg font-medium">Add New Physical Symptom</h3>
          
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <select
              id="location"
              className="w-full p-2 border rounded-md"
              value={newSymptom.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            >
              <option value="">Select Location</option>
              {bodyLocations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          {/* Pain Type */}
          <div className="space-y-2">
            <Label htmlFor="painType">Pain Type</Label>
            <select
              id="painType"
              className="w-full p-2 border rounded-md"
              value={newSymptom.painType}
              onChange={(e) => handleInputChange("painType", e.target.value)}
              required
            >
              <option value="">Select Pain Type</option>
              {painTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Intensity */}
          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity</Label>
            <select
              id="intensity"
              className="w-full p-2 border rounded-md"
              value={newSymptom.intensity}
              onChange={(e) => handleInputChange("intensity", e.target.value)}
              required
            >
              <option value="">Select Intensity</option>
              {intensityLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
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
              placeholder="Add any additional details about this physical symptom"
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
              disabled={!newSymptom.location || !newSymptom.painType || !newSymptom.intensity}
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