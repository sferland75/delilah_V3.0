import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, MinusCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Functional status categories
const functionalCategories = [
  "Mobility",
  "Self-Care",
  "Household Activities",
  "Work/School",
  "Social Activities",
  "Recreational Activities",
  "Sleep",
  "Driving",
  "Other (See comments)"
];

// Limitation levels
const limitationLevels = [
  "None - No limitations",
  "Mild - Slightly limited but can perform independently",
  "Moderate - Limited and requires some assistance",
  "Severe - Significantly limited and requires substantial assistance",
  "Complete - Cannot perform activity at all",
  "Other (See comments)"
];

// Frequency of limitations
const frequencyOptions = [
  "Rarely - Once a week or less",
  "Occasionally - A few times a week",
  "Frequently - Daily but not constant",
  "Constantly - Throughout the day",
  "Situational - Only during specific activities",
  "Other (See comments)"
];

export default function EnhancedFunctionalStatus({ formData, updateFormData }) {
  const [limitations, setLimitations] = useState([]);
  const [showAddLimitationForm, setShowAddLimitationForm] = useState(false);
  const [newLimitation, setNewLimitation] = useState({
    category: "",
    level: "",
    frequency: "",
    comments: ""
  });

  // Initialize limitations from formData if available
  useEffect(() => {
    if (formData?.functionalStatus?.limitations) {
      setLimitations(formData.functionalStatus.limitations);
    }
  }, [formData]);

  // Update parent form data when limitations change
  useEffect(() => {
    if (updateFormData && limitations.length > 0) {
      updateFormData("functionalStatus", { limitations });
    }
  }, [limitations, updateFormData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setNewLimitation({
      ...newLimitation,
      [field]: value
    });
  };

  // Add limitation to the list
  const handleAddLimitation = () => {
    if (newLimitation.category && newLimitation.level && newLimitation.frequency) {
      const limitationToAdd = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...newLimitation
      };
      
      setLimitations([...limitations, limitationToAdd]);
      
      // Reset form
      setNewLimitation({
        category: "",
        level: "",
        frequency: "",
        comments: ""
      });
      setShowAddLimitationForm(false);
    }
  };

  // Remove limitation from the list
  const handleRemoveLimitation = (id) => {
    setLimitations(limitations.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Functional Status Assessment</AlertTitle>
        <AlertDescription className="text-blue-700">
          Document functional limitations by selecting the category, level of limitation, and frequency. Add detailed information in the comments section.
        </AlertDescription>
      </Alert>

      {/* Limitations List */}
      {limitations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Documented Functional Limitations</h3>
          <div className="space-y-3">
            {limitations.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.category}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLimitation(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Level:</span> {item.level}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Frequency:</span> {item.frequency}
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

      {/* Add Limitation Button */}
      {!showAddLimitationForm && (
        <Button
          type="button"
          onClick={() => setShowAddLimitationForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Functional Limitation
        </Button>
      )}

      {/* Add Limitation Form */}
      {showAddLimitationForm && (
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="text-lg font-medium">Add New Functional Limitation</h3>
          
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Functional Category</Label>
            <select
              id="category"
              className="w-full p-2 border rounded-md"
              value={newLimitation.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              required
            >
              <option value="">Select Functional Category</option>
              {functionalCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Level */}
          <div className="space-y-2">
            <Label htmlFor="level">Level of Limitation</Label>
            <select
              id="level"
              className="w-full p-2 border rounded-md"
              value={newLimitation.level}
              onChange={(e) => handleInputChange("level", e.target.value)}
              required
            >
              <option value="">Select Level of Limitation</option>
              {limitationLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <select
              id="frequency"
              className="w-full p-2 border rounded-md"
              value={newLimitation.frequency}
              onChange={(e) => handleInputChange("frequency", e.target.value)}
              required
            >
              <option value="">Select Frequency</option>
              {frequencyOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={newLimitation.comments}
              onChange={(e) => handleInputChange("comments", e.target.value)}
              placeholder="Add any additional details about this functional limitation"
              rows={3}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddLimitationForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddLimitation}
              disabled={!newLimitation.category || !newLimitation.level || !newLimitation.frequency}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Limitation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 