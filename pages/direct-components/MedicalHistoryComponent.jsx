import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, MinusCircle, InfoIcon } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

// Styled Medical History Component for direct use in pages
export default function MedicalHistoryComponent() {
  const { data, updateSection } = useAssessment();
  const [activeTab, setActiveTab] = useState('preExisting');
  const [formData, setFormData] = useState({
    conditions: [
      { name: 'Type 2 Diabetes', status: 'active', date: '2020-05-15', notes: 'Managed with oral medication' }
    ],
    injury: {
      date: '2023-01-10',
      mechanism: 'Motor Vehicle Accident',
      description: 'Rear-ended at stop light',
      symptoms: 'Neck pain, headache, dizziness'
    },
    treatments: [
      { type: 'Physical Therapy', provider: 'ABC Rehab', frequency: 'Twice weekly', status: 'ongoing' }
    ],
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', reason: 'Diabetes' }
    ]
  });

  // Helper to add a condition
  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { name: '', status: 'active', date: '', notes: '' }]
    });
  };

  // Helper to remove a condition
  const removeCondition = (index) => {
    const newConditions = [...formData.conditions];
    newConditions.splice(index, 1);
    setFormData({ ...formData, conditions: newConditions });
  };

  // Helper to update a condition
  const updateCondition = (index, field, value) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({ ...formData, conditions: newConditions });
  };

  // Helper to update injury details
  const updateInjury = (field, value) => {
    setFormData({
      ...formData,
      injury: { ...formData.injury, [field]: value }
    });
  };

  // Helper to add a treatment
  const addTreatment = () => {
    setFormData({
      ...formData,
      treatments: [...formData.treatments, { type: '', provider: '', frequency: '', status: 'ongoing' }]
    });
  };

  // Helper to remove a treatment
  const removeTreatment = (index) => {
    const newTreatments = [...formData.treatments];
    newTreatments.splice(index, 1);
    setFormData({ ...formData, treatments: newTreatments });
  };

  // Helper to update a treatment
  const updateTreatment = (index, field, value) => {
    const newTreatments = [...formData.treatments];
    newTreatments[index] = { ...newTreatments[index], [field]: value };
    setFormData({ ...formData, treatments: newTreatments });
  };

  // Helper to add a medication
  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', reason: '' }]
    });
  };

  // Helper to remove a medication
  const removeMedication = (index) => {
    const newMedications = [...formData.medications];
    newMedications.splice(index, 1);
    setFormData({ ...formData, medications: newMedications });
  };

  // Helper to update a medication
  const updateMedication = (index, field, value) => {
    const newMedications = [...formData.medications];
    newMedications[index] = { ...newMedications[index], [field]: value };
    setFormData({ ...formData, medications: newMedications });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create the data structure expected by the AssessmentContext
    const medicalHistoryData = {
      pastMedicalHistory: {
        conditions: formData.conditions.map(c => ({
          condition: c.name,
          diagnosisDate: c.date,
          treatment: c.notes
        })),
        allergies: []
      },
      injuryDetails: {
        diagnosisDate: formData.injury.date,
        mechanism: formData.injury.mechanism,
        description: formData.injury.description,
        complications: formData.injury.symptoms ? formData.injury.symptoms.split(',').map(s => s.trim()) : []
      },
      treatmentHistory: {
        rehabilitationServices: formData.treatments.map(t => ({
          type: t.type,
          provider: t.provider,
          frequency: t.frequency,
          startDate: new Date().toISOString().split('T')[0],
          notes: t.status
        }))
      },
      medications: formData.medications.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        indication: m.reason
      }))
    };
    
    // Update the context with the form data
    updateSection('medicalHistory', medicalHistoryData);
    
    // Show success message
    alert('Medical History saved successfully!');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Medical History</h2>
        <p className="text-sm text-gray-500 mt-1">Pre-existing conditions, injury details, and current treatments</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <Tabs defaultValue="preExisting" className="w-full border rounded-md">
          <TabsList className="w-full grid grid-cols-4 p-0 h-auto border-b">
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="preExisting"
            >
              Pre-Existing
            </TabsTrigger>
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="injury"
            >
              Injury Details
            </TabsTrigger>
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="treatment"
            >
              Treatment
            </TabsTrigger>
            <TabsTrigger 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600" 
              value="medications"
            >
              Medications
            </TabsTrigger>
          </TabsList>

          {/* Pre-Existing Conditions Tab */}
          <TabsContent value="preExisting" className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Pre-Existing Conditions</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addCondition}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Condition
                </Button>
              </div>

              {formData.conditions.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
                  No pre-existing conditions added. Click "Add Condition" to begin.
                </div>
              )}

              {formData.conditions.map((condition, index) => (
                <div 
                  key={index} 
                  className="border rounded-md p-4 space-y-4 relative"
                >
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => removeCondition(index)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                    size="sm"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Condition *</label>
                      <input
                        value={condition.name}
                        onChange={(e) => updateCondition(index, 'name', e.target.value)}
                        placeholder="Enter condition name"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select 
                        value={condition.status}
                        onChange={(e) => updateCondition(index, 'status', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="active">Active</option>
                        <option value="managed">Managed</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Diagnosis Date</label>
                      <input
                        type="date"
                        value={condition.date}
                        onChange={(e) => updateCondition(index, 'date', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      value={condition.notes}
                      onChange={(e) => updateCondition(index, 'notes', e.target.value)}
                      placeholder="Add additional details about this condition"
                      className="min-h-[80px] w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Injury Details Tab */}
          <TabsContent value="injury" className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Injury Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Injury *</label>
                  <input
                    type="date"
                    value={formData.injury.date}
                    onChange={(e) => updateInjury('date', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Mechanism of Injury *</label>
                  <input
                    value={formData.injury.mechanism}
                    onChange={(e) => updateInjury('mechanism', e.target.value)}
                    placeholder="Describe how the injury occurred (e.g., fall, collision)"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.injury.description}
                    onChange={(e) => updateInjury('description', e.target.value)}
                    placeholder="Provide additional details about how the injury occurred"
                    className="min-h-[100px] w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Initial Symptoms *</label>
                  <textarea
                    value={formData.injury.symptoms}
                    onChange={(e) => updateInjury('symptoms', e.target.value)}
                    placeholder="Describe symptoms experienced immediately after injury"
                    className="min-h-[100px] w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Treatment Tab */}
          <TabsContent value="treatment" className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Current Treatments</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addTreatment}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Treatment
                </Button>
              </div>

              {formData.treatments.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
                  No treatments added. Click "Add Treatment" to begin.
                </div>
              )}

              {formData.treatments.map((treatment, index) => (
                <div 
                  key={index} 
                  className="border rounded-md p-4 space-y-4 relative"
                >
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => removeTreatment(index)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                    size="sm"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Treatment Type *</label>
                      <input
                        value={treatment.type}
                        onChange={(e) => updateTreatment(index, 'type', e.target.value)}
                        placeholder="E.g., Physical Therapy, Surgery"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Provider</label>
                      <input
                        value={treatment.provider}
                        onChange={(e) => updateTreatment(index, 'provider', e.target.value)}
                        placeholder="Name of healthcare provider"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={treatment.status}
                        onChange={(e) => updateTreatment(index, 'status', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="planned">Planned</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Frequency</label>
                      <input
                        value={treatment.frequency}
                        onChange={(e) => updateTreatment(index, 'frequency', e.target.value)}
                        placeholder="E.g., Weekly, Monthly"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Medications Tab */}
          <TabsContent value="medications" className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Current Medications</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addMedication}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Medication
                </Button>
              </div>

              {formData.medications.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
                  No medications added. Click "Add Medication" to begin.
                </div>
              )}

              {formData.medications.map((medication, index) => (
                <div 
                  key={index} 
                  className="border rounded-md p-4 space-y-4 relative"
                >
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => removeMedication(index)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                    size="sm"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Medication Name *</label>
                      <input
                        value={medication.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        placeholder="Enter medication name"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Dosage</label>
                      <input
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        placeholder="E.g., 10mg, 500mg"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Frequency</label>
                      <input
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        placeholder="E.g., Once daily, Twice daily"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Prescribed For</label>
                      <input
                        value={medication.reason}
                        onChange={(e) => updateMedication(index, 'reason', e.target.value)}
                        placeholder="Reason for medication"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setFormData({
              conditions: [],
              injury: { date: '', mechanism: '', description: '', symptoms: '' },
              treatments: [],
              medications: []
            })}
            type="button"
          >
            Reset
          </Button>
          <Button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Medical History
          </Button>
        </div>
      </form>
    </div>
  );
}
