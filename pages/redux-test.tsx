import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchAllAssessments, 
  createNewAssessmentThunk,
  fetchAssessmentById,
  updateSectionThunk,
  saveCurrentAssessmentThunk,
  deleteAssessmentThunk
} from '@/store/slices/assessmentSlice';
import { addToast } from '@/store/slices/uiSlice';
import MainNavigation from '@/components/navigation/main';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

export default function ReduxTestPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const currentId = useAppSelector(state => state.assessments.currentId);
  const currentData = useAppSelector(state => state.assessments.currentData);
  const assessmentList = useAppSelector(state => state.assessments.assessmentList);
  const loadingStates = useAppSelector(state => state.assessments.loading);
  const errorStates = useAppSelector(state => state.assessments.error);
  
  const [demoFirstName, setDemoFirstName] = useState('');
  const [demoLastName, setDemoLastName] = useState('');
  
  // Load all assessments on mount
  useEffect(() => {
    dispatch(fetchAllAssessments());
  }, [dispatch]);
  
  // Create a new test assessment
  const handleCreateAssessment = async () => {
    try {
      const resultAction = await dispatch(createNewAssessmentThunk());
      
      if (createNewAssessmentThunk.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: `Created assessment with ID: ${resultAction.payload.id}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create assessment",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating assessment:", error);
    }
  };
  
  // Save basic demographics data to the current assessment
  const handleSaveDemographics = async () => {
    if (!currentId) {
      toast({
        title: "Error",
        description: "No current assessment selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create test demographics data
      const demographicsData = {
        personalInfo: {
          firstName: demoFirstName || 'Test',
          lastName: demoLastName || 'User',
          dateOfBirth: '1990-01-01',
          phone: '555-123-4567',
          email: 'test@example.com',
          address: '123 Test St',
        },
        contactInfo: {
          city: 'Test City',
          province: 'Test Province',
          postalCode: 'A1B 2C3',
        }
      };
      
      // Update the redux store
      await dispatch(updateSectionThunk({
        sectionName: 'demographics',
        sectionData: demographicsData
      }));
      
      // Save the assessment
      const saveAction = await dispatch(saveCurrentAssessmentThunk());
      
      if (saveCurrentAssessmentThunk.fulfilled.match(saveAction)) {
        toast({
          title: "Success",
          description: "Demographics saved successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save demographics",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving demographics:", error);
    }
  };
  
  // Load an assessment by ID
  const handleLoadAssessment = async (id: string) => {
    try {
      const resultAction = await dispatch(fetchAssessmentById(id));
      
      if (fetchAssessmentById.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: `Loaded assessment: ${id}`,
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to load assessment: ${id}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error loading assessment ${id}:`, error);
    }
  };
  
  // Delete an assessment
  const handleDeleteAssessment = async (id: string) => {
    try {
      const resultAction = await dispatch(deleteAssessmentThunk(id));
      
      if (deleteAssessmentThunk.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: `Deleted assessment: ${id}`,
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to delete assessment: ${id}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error deleting assessment ${id}:`, error);
    }
  };
  
  // Test toast notification through Redux
  const handleTestToast = () => {
    dispatch(addToast({
      title: "Redux Toast",
      description: "This toast was dispatched through Redux",
      type: "info"
    }));
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 p-4 bg-white border-r">
        <MainNavigation />
      </div>
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Redux Test Page</h1>
            <p className="text-gray-600">Test the Redux implementation</p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={handleCreateAssessment}>
              Create Test Assessment
            </Button>
            <Button onClick={handleTestToast} variant="outline">
              Test Redux Toast
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>ID:</strong> {currentId || 'None'}</p>
              <p><strong>Loading:</strong> {Object.entries(loadingStates).map(([key, value]) => 
                `${key}: ${value}`
              ).join(', ')}</p>
              
              {currentId && (
                <div className="mt-4">
                  <h3 className="font-semibold">Test Demographics</h3>
                  <div className="space-y-2 mt-2">
                    <div>
                      <label className="block text-sm">First Name</label>
                      <input 
                        type="text" 
                        value={demoFirstName} 
                        onChange={e => setDemoFirstName(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Last Name</label>
                      <input 
                        type="text" 
                        value={demoLastName} 
                        onChange={e => setDemoLastName(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Last Name"
                      />
                    </div>
                    <Button onClick={handleSaveDemographics}>
                      Save Demographics
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Assessment List</CardTitle>
            </CardHeader>
            <CardContent>
              {assessmentList.length === 0 ? (
                <p>No assessments found</p>
              ) : (
                <ul className="space-y-2">
                  {assessmentList.map(assessment => (
                    <li key={assessment.id} className="p-3 border rounded bg-white">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{assessment.clientName}</p>
                          <p className="text-sm text-gray-500">ID: {assessment.id}</p>
                          <p className="text-sm text-gray-500">
                            Last updated: {new Date(assessment.lastSaved).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleLoadAssessment(assessment.id)}
                          >
                            Load
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteAssessment(assessment.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Current Data (Redux State)</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="demographics">
              <TabsList>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="medical">Medical History</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="raw">Raw State</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demographics" className="p-4 border rounded-md mt-4">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(currentData.demographics || {}, null, 2)}
                </pre>
              </TabsContent>
              
              <TabsContent value="medical" className="p-4 border rounded-md mt-4">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(currentData.medicalHistory || {}, null, 2)}
                </pre>
              </TabsContent>
              
              <TabsContent value="metadata" className="p-4 border rounded-md mt-4">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(currentData.metadata || {}, null, 2)}
                </pre>
              </TabsContent>
              
              <TabsContent value="raw" className="p-4 border rounded-md mt-4">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(currentData, null, 2)}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}