import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

export default function NewAssessment() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('demographics');
  const [assessmentData, setAssessmentData] = useState({
    demographics: {
      name: '',
      age: '',
      gender: '',
      address: '',
      phone: '',
      email: ''
    },
    medicalHistory: {
      conditions: [],
      medications: [],
      surgeries: [],
      allergies: []
    },
    symptoms: {
      reportedSymptoms: [],
      painLocation: '',
      painSeverity: '',
      functionalImpact: []
    },
    functionalStatus: {
      mobilityStatus: '',
      transferAbility: '',
      balanceStatus: '',
      limitations: []
    },
    environment: {
      homeType: '',
      barriers: [],
      recommendations: [],
      safetyRisks: []
    },
    adls: {
      selfCare: {},
      mobility: {},
      instrumental: {}
    },
    attendantCare: {
      caregiverInfo: '',
      careNeeds: [],
      recommendedHours: '',
      recommendations: []
    },
    typicalDay: {
      morningActivities: [],
      afternoonActivities: [],
      eveningActivities: [],
      leisureActivities: []
    },
    purpose: {
      assessmentPurpose: '',
      referralSource: '',
      methodologies: []
    }
  });

  // Update assessment data and tab based on query parameters
  useEffect(() => {
    // Check if we're coming from an import
    if (router.query.from === 'import') {
      try {
        // In a real app, this could come from API or state management
        // For demo purposes, we're using localStorage
        const importedData = localStorage.getItem('importedAssessmentData');
        
        if (importedData) {
          const parsedData = JSON.parse(importedData);
          setAssessmentData(parsedData);
          
          // Display notification or set active tab based on import data
          // For now, we'll just set the demographics tab
          setActiveTab('demographics');
        }
      } catch (error) {
        console.error('Error loading imported data:', error);
      }
    }
    
    setIsLoading(false);
  }, [router.query]);

  // Handle input change for simple fields
  const handleInputChange = (section, field, value) => {
    setAssessmentData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  // Handle changes for list items
  const handleListChange = (section, field, index, value) => {
    const newList = [...assessmentData[section][field]];
    newList[index] = value;
    
    setAssessmentData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: newList
      }
    }));
  };

  // Add item to list
  const handleAddListItem = (section, field) => {
    setAssessmentData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: [...prevData[section][field], '']
      }
    }));
  };

  // Remove item from list
  const handleRemoveListItem = (section, field, index) => {
    const newList = [...assessmentData[section][field]];
    newList.splice(index, 1);
    
    setAssessmentData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: newList
      }
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would save to a database
    console.log('Submitting assessment data:', assessmentData);
    
    // Navigate to success page or assessment view
    router.push('/assessment');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">New Assessment</h1>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/assessment')}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Assessment</Button>
          </div>
        </div>
        
        {router.query.from === 'import' && (
          <Alert className="mb-6">
            <AlertTitle>Data Imported from PDF</AlertTitle>
            <AlertDescription>
              Assessment data has been pre-filled from your PDF import. 
              Please review and make any necessary corrections.
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
            <CardDescription>
              Enter or edit information for this assessment
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="medical_history">Medical History</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="functional_status">Functional Status</TabsTrigger>
                <TabsTrigger value="environmental">Environmental</TabsTrigger>
                <TabsTrigger value="adls">ADLs</TabsTrigger>
                <TabsTrigger value="attendant_care">Attendant Care</TabsTrigger>
                <TabsTrigger value="typical_day">Typical Day</TabsTrigger>
                <TabsTrigger value="purpose">Purpose</TabsTrigger>
              </TabsList>
              
              <div className="mt-6 pb-6">
                <TabsContent value="demographics">
                  <h3 className="text-lg font-medium mb-4">Demographics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={assessmentData.demographics.name}
                        onChange={(e) => handleInputChange('demographics', 'name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        value={assessmentData.demographics.age}
                        onChange={(e) => handleInputChange('demographics', 'age', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        value={assessmentData.demographics.gender}
                        onChange={(e) => handleInputChange('demographics', 'gender', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={assessmentData.demographics.phone}
                        onChange={(e) => handleInputChange('demographics', 'phone', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={assessmentData.demographics.address}
                        onChange={(e) => handleInputChange('demographics', 'address', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={assessmentData.demographics.email}
                        onChange={(e) => handleInputChange('demographics', 'email', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="medical_history">
                  <h3 className="text-lg font-medium mb-4">Medical History</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>Conditions</Label>
                      {assessmentData.medicalHistory.conditions.map((condition, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={condition}
                            onChange={(e) => handleListChange('medicalHistory', 'conditions', index, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveListItem('medicalHistory', 'conditions', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddListItem('medicalHistory', 'conditions')}
                      >
                        Add Condition
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Medications</Label>
                      {assessmentData.medicalHistory.medications.map((medication, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={medication}
                            onChange={(e) => handleListChange('medicalHistory', 'medications', index, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveListItem('medicalHistory', 'medications', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddListItem('medicalHistory', 'medications')}
                      >
                        Add Medication
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Surgeries</Label>
                      {assessmentData.medicalHistory.surgeries.map((surgery, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={surgery}
                            onChange={(e) => handleListChange('medicalHistory', 'surgeries', index, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveListItem('medicalHistory', 'surgeries', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddListItem('medicalHistory', 'surgeries')}
                      >
                        Add Surgery
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Allergies</Label>
                      {assessmentData.medicalHistory.allergies.map((allergy, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={allergy}
                            onChange={(e) => handleListChange('medicalHistory', 'allergies', index, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveListItem('medicalHistory', 'allergies', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddListItem('medicalHistory', 'allergies')}
                      >
                        Add Allergy
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="symptoms">
                  <h3 className="text-lg font-medium mb-4">Symptoms</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>Reported Symptoms</Label>
                      {assessmentData.symptoms.reportedSymptoms.map((symptom, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={symptom}
                            onChange={(e) => handleListChange('symptoms', 'reportedSymptoms', index, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveListItem('symptoms', 'reportedSymptoms', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddListItem('symptoms', 'reportedSymptoms')}
                      >
                        Add Symptom
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="painLocation">Pain Location</Label>
                      <Input
                        id="painLocation"
                        value={assessmentData.symptoms.painLocation}
                        onChange={(e) => handleInputChange('symptoms', 'painLocation', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="painSeverity">Pain Severity</Label>
                      <Input
                        id="painSeverity"
                        value={assessmentData.symptoms.painSeverity}
                        onChange={(e) => handleInputChange('symptoms', 'painSeverity', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Functional Impact</Label>
                      {assessmentData.symptoms.functionalImpact.map((impact, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={impact}
                            onChange={(e) => handleListChange('symptoms', 'functionalImpact', index, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveListItem('symptoms', 'functionalImpact', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddListItem('symptoms', 'functionalImpact')}
                      >
                        Add Impact
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Add other tab contents similarly... */}
                
              </div>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push('/assessment')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Assessment</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
