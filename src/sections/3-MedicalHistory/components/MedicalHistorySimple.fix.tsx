import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';

export const MedicalHistorySimple = () => {
  console.log('FIXED MedicalHistorySimple component is being executed');
  
  const { data, updateSection } = useAssessment();
  console.log('Assessment context data:', data);
  
  const [formData, setFormData] = useState({
    preExistingConditions: [
      { 
        condition: 'Type 2 Diabetes', 
        status: 'active', 
        diagnosisDate: '2020-05-15', 
        details: 'Managed with oral medication' 
      }
    ],
    surgeries: [],
    injury: {
      date: '2023-01-10',
      time: '08:30',
      position: 'Seated',
      impactType: 'Motor Vehicle Accident',
      circumstance: 'Rear-ended at a stop light',
      immediateSymptoms: 'Neck pain, headache, dizziness',
      initialTreatment: 'Emergency room visit, prescribed pain medication and muscle relaxants'
    },
    currentMedications: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        prescribedFor: 'Diabetes',
        prescribedBy: 'Dr. Smith',
        status: 'current'
      }
    ],
    currentTreatments: [
      {
        type: 'Physical Therapy',
        provider: 'ABC Rehab Center',
        facility: 'Main Street Clinic',
        startDate: '2023-02-01',
        frequency: 'Twice weekly',
        status: 'ongoing',
        notes: 'Focusing on neck and upper back mobility'
      }
    ]
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Add a useEffect for initial render notification
  useEffect(() => {
    console.log('MedicalHistorySimple component mounted');
    
    // Return cleanup function
    return () => {
      console.log('MedicalHistorySimple component unmounting');
    };
  }, []);
  
  // Update form from context data
  useEffect(() => {
    console.log('Data dependency changed in useEffect');
    if (data?.medicalHistory) {
      console.log('Mapping context data to form');
      try {
        const newFormData = { ...formData };
        
        // Map context data to form fields
        if (data.medicalHistory.pastMedicalHistory?.conditions) {
          newFormData.preExistingConditions = data.medicalHistory.pastMedicalHistory.conditions.map(c => ({
            condition: c.condition || '',
            status: 'active',
            diagnosisDate: c.diagnosisDate || '',
            details: c.treatment || ''
          }));
        }
        
        if (data.medicalHistory.injuryDetails) {
          newFormData.injury = {
            date: data.medicalHistory.injuryDetails.diagnosisDate || '',
            impactType: data.medicalHistory.injuryDetails.mechanism || '',
            circumstance: data.medicalHistory.injuryDetails.description || '',
            initialTreatment: data.medicalHistory.injuryDetails.initialTreatment || '',
            immediateSymptoms: Array.isArray(data.medicalHistory.injuryDetails.complications) ? 
              data.medicalHistory.injuryDetails.complications.join(', ') : '',
            time: '',
            position: ''
          };
        }
        
        // Set form data
        setFormData(newFormData);
        setDataLoaded(true);
        console.log('Form data updated successfully');
      } catch (error) {
        console.error("Error mapping context data to form:", error);
      }
    } else {
      console.log('No medical history data in context');
    }
  }, [data?.medicalHistory]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    try {
      // Map form data to context structure
      const medicalHistoryData = {
        pastMedicalHistory: {
          conditions: formData.preExistingConditions.map(c => ({
            condition: c.condition,
            diagnosisDate: c.diagnosisDate,
            treatment: c.details
          })),
          allergies: []
        },
        injuryDetails: {
          diagnosisDate: formData.injury.date,
          mechanism: formData.injury.impactType,
          description: formData.injury.circumstance,
          initialTreatment: formData.injury.initialTreatment,
          complications: formData.injury.immediateSymptoms ? 
            formData.injury.immediateSymptoms.split(',').map(s => s.trim()) : []
        },
        treatmentHistory: {
          rehabilitationServices: formData.currentTreatments.map(t => ({
            type: t.type,
            provider: t.provider,
            frequency: t.frequency,
            startDate: t.startDate,
            notes: t.notes
          }))
        }
      };
      
      console.log('Mapped data for context:', medicalHistoryData);
      // Update context
      updateSection('medicalHistory', medicalHistoryData);
      alert('Medical History saved successfully!');
    } catch (error) {
      console.error("Error saving medical history:", error);
      alert('Error saving Medical History: ' + error.message);
    }
  };
  
  // Component rendering indicator
  console.log('About to render MedicalHistorySimple component');
  
  // Simple debug section
  const DebugInfo = () => (
    <div className="bg-red-100 p-4 mb-4 rounded border border-red-300">
      <h3 className="font-bold text-red-700">Debug Information (FIXED VERSION)</h3>
      <div className="text-sm text-red-700">
        <p>Component is rendering</p>
        <p>Assessment Context Available: {data ? 'Yes' : 'No'}</p>
        <p>Medical History Data: {data?.medicalHistory ? 'Present' : 'Not Present'}</p>
        <p>formData State: Pre-existing conditions: {formData.preExistingConditions.length}</p>
      </div>
    </div>
  );
  
  // PRE-EXISTING CONDITIONS SECTION
  const PreExistingConditionsSection = () => {
    console.log('Rendering PreExistingConditionsSection');
    const addCondition = () => {
      try {
        setFormData({
          ...formData,
          preExistingConditions: [
            ...formData.preExistingConditions,
            { condition: '', status: 'active', details: '', diagnosisDate: '' }
          ]
        });
      } catch (error) {
        console.error("Error adding condition:", error);
      }
    };
    
    const removeCondition = (index) => {
      try {
        const updatedConditions = [...formData.preExistingConditions];
        updatedConditions.splice(index, 1);
        setFormData({
          ...formData,
          preExistingConditions: updatedConditions
        });
      } catch (error) {
        console.error("Error removing condition:", error);
      }
    };
    
    const updateCondition = (index, field, value) => {
      const updatedConditions = [...formData.preExistingConditions];
      updatedConditions[index] = {
        ...updatedConditions[index],
        [field]: value
      };
      setFormData({
        ...formData,
        preExistingConditions: updatedConditions
      });
    };
    
    return (
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

        {formData.preExistingConditions.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
            No pre-existing conditions added. Click "Add Condition" to begin.
          </div>
        )}

        {formData.preExistingConditions.map((condition, index) => (
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Condition *</label>
                <input
                  value={condition.condition}
                  onChange={(e) => updateCondition(index, 'condition', e.target.value)}
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
                  <option value="managed">Managed</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Diagnosis Date</label>
                <input
                  value={condition.diagnosisDate}
                  onChange={(e) => updateCondition(index, 'diagnosisDate', e.target.value)}
                  type="date"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Details</label>
              <textarea
                value={condition.details}
                onChange={(e) => updateCondition(index, 'details', e.target.value)}
                placeholder="Add additional details about this condition"
                className="min-h-[80px] w-full p-2 border rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // INJURY DETAILS SECTION
  const InjuryDetailsSection = () => {
    console.log('Rendering InjuryDetailsSection');
    const updateInjuryField = (field, value) => {
      setFormData({
        ...formData,
        injury: {
          ...formData.injury,
          [field]: value
        }
      });
    };
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Injury Details</h3>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Date of Injury *</label>
            <input
              value={formData.injury.date}
              onChange={(e) => updateInjuryField('date', e.target.value)}
              type="date"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time of Injury</label>
            <input
              value={formData.injury.time}
              onChange={(e) => updateInjuryField('time', e.target.value)}
              type="time"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Mechanism of Injury *</label>
            <input
              value={formData.injury.impactType}
              onChange={(e) => updateInjuryField('impactType', e.target.value)}
              placeholder="Describe how the injury occurred (e.g., fall, collision)"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Circumstances</label>
            <textarea
              value={formData.injury.circumstance}
              onChange={(e) => updateInjuryField('circumstance', e.target.value)}
              placeholder="Provide additional details about how the injury occurred"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Immediate Symptoms *</label>
            <textarea
              value={formData.injury.immediateSymptoms}
              onChange={(e) => updateInjuryField('immediateSymptoms', e.target.value)}
              placeholder="Describe symptoms experienced immediately after injury"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Initial Treatment</label>
            <textarea
              value={formData.injury.initialTreatment}
              onChange={(e) => updateInjuryField('initialTreatment', e.target.value)}
              placeholder="Describe any immediate medical attention or first aid received"
              className="min-h-[100px] w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    );
  };
  
  // TREATMENT SECTION
  const TreatmentSection = () => {
    console.log('Rendering TreatmentSection');
    const addTreatment = () => {
      try {
        setFormData({
          ...formData,
          currentTreatments: [
            ...formData.currentTreatments,
            { type: '', provider: '', facility: '', startDate: '', frequency: '', status: 'ongoing', notes: '' }
          ]
        });
      } catch (error) {
        console.error("Error adding treatment:", error);
      }
    };
    
    const removeTreatment = (index) => {
      try {
        const updatedTreatments = [...formData.currentTreatments];
        updatedTreatments.splice(index, 1);
        setFormData({
          ...formData,
          currentTreatments: updatedTreatments
        });
      } catch (error) {
        console.error("Error removing treatment:", error);
      }
    };
    
    const updateTreatment = (index, field, value) => {
      const updatedTreatments = [...formData.currentTreatments];
      updatedTreatments[index] = {
        ...updatedTreatments[index],
        [field]: value
      };
      setFormData({
        ...formData,
        currentTreatments: updatedTreatments
      });
    };
    
    return (
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

        {formData.currentTreatments.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
            No treatments added. Click "Add Treatment" to begin.
          </div>
        )}

        {formData.currentTreatments.map((treatment, index) => (
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

            <div className="grid grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={treatment.notes || ''}
                onChange={(e) => updateTreatment(index, 'notes', e.target.value)}
                placeholder="Additional details about this treatment"
                className="min-h-[80px] w-full p-2 border rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // MEDICATIONS SECTION
  const MedicationsSection = () => {
    console.log('Rendering MedicationsSection');
    const addMedication = () => {
      try {
        setFormData({
          ...formData,
          currentMedications: [
            ...formData.currentMedications,
            { name: '', dosage: '', frequency: '', prescribedFor: '', prescribedBy: '', status: 'current' }
          ]
        });
      } catch (error) {
        console.error("Error adding medication:", error);
      }
    };
    
    const removeMedication = (index) => {
      try {
        const updatedMedications = [...formData.currentMedications];
        updatedMedications.splice(index, 1);
        setFormData({
          ...formData,
          currentMedications: updatedMedications
        });
      } catch (error) {
        console.error("Error removing medication:", error);
      }
    };
    
    const updateMedication = (index, field, value) => {
      const updatedMedications = [...formData.currentMedications];
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value
      };
      setFormData({
        ...formData,
        currentMedications: updatedMedications
      });
    };
    
    return (
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

        {formData.currentMedications.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
            No medications added. Click "Add Medication" to begin.
          </div>
        )}

        {formData.currentMedications.map((medication, index) => (
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

            <div className="grid grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  value={medication.status}
                  onChange={(e) => updateMedication(index, 'status', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="current">Current</option>
                  <option value="discontinued">Discontinued</option>
                  <option value="as-needed">As Needed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Add debug section at the top */}
      <DebugInfo />
      
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Medical History</h2>
        <p className="text-sm text-muted-foreground mt-1">Pre-existing conditions, injury details, and current treatments</p>
      </div>
      
      {dataLoaded && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Loaded From Assessment Context</AlertTitle>
          <AlertDescription>
            Medical history information has been pre-populated from previous assessments. Please review and adjust as needed.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <Tabs defaultValue="preExisting" className="w-full border rounded-md">
          <TabsList className="grid w-full grid-cols-4 p-0 h-auto border-b">
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

          <TabsContent value="preExisting" className="p-6">
            <PreExistingConditionsSection />
          </TabsContent>
          
          <TabsContent value="injury" className="p-6">
            <InjuryDetailsSection />
          </TabsContent>
          
          <TabsContent value="treatment" className="p-6">
            <TreatmentSection />
          </TabsContent>
          
          <TabsContent value="medications" className="p-6">
            <MedicationsSection />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setFormData({
              preExistingConditions: [],
              surgeries: [],
              injury: {
                date: '',
                time: '',
                position: '',
                impactType: '',
                circumstance: '',
                immediateSymptoms: '',
                initialTreatment: ''
              },
              currentMedications: [],
              currentTreatments: []
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
};

export default MedicalHistorySimple;