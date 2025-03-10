import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, ArrowLeft, Save } from 'lucide-react';
import FieldTestPanel from '@/components/FieldTestPanel';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { saveCurrentAssessmentThunk } from '@/store/slices/assessmentSlice';
import { initFieldTestService } from '@/services/field-test-service';

export default function FieldTestSettings() {
  const dispatch = useAppDispatch();
  const { hasUnsavedChanges } = useAppSelector(state => state.assessments);
  
  // Initialize field test service when the page loads
  React.useEffect(() => {
    initFieldTestService();
  }, []);
  
  const handleSaveChanges = () => {
    dispatch(saveCurrentAssessmentThunk());
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Field Testing Settings</h1>
        </div>
        
        <Button 
          variant="default"
          disabled={!hasUnsavedChanges}
          onClick={handleSaveChanges}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FieldTestPanel />
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Field Testing Guide</CardTitle>
              <CardDescription>Best practices for field testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">1. Enable Autosave</h3>
                <p className="text-sm text-muted-foreground">
                  Always enable autosave when collecting data in the field to prevent data loss.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">2. Create Regular Backups</h3>
                <p className="text-sm text-muted-foreground">
                  Set up backups every 15-30 minutes for additional data protection.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">3. Sync When Connected</h3>
                <p className="text-sm text-muted-foreground">
                  Enable "Sync on Connect" to automatically upload data when internet connection is restored.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">4. Test Offline Capability</h3>
                <p className="text-sm text-muted-foreground">
                  Before going to the field, test the application's offline capability by disabling network connection.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Field Testing Mode</AlertTitle>
            <AlertDescription className="text-blue-700">
              Field testing mode enables enhanced data persistence and offline capabilities to ensure your 
              assessment data is safe during field use. All changes are saved locally and synced when connection
              is available.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Connection</span>
                <span className={navigator.onLine ? "text-green-500" : "text-amber-500"}>
                  {navigator.onLine ? "Online" : "Offline"}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Autosave</span>
                <span className="text-blue-500">Active</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Storage Usage</span>
                <span>14 MB / 5 GB</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Version</span>
                <span>Delilah v3.0.1</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
