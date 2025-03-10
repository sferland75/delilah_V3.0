import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import { functionalStatusSchema, defaultFormState } from './schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Import updated components
import { RangeOfMotion } from './components/RangeOfMotion';
import SimpleManualMuscle from './components/SimpleManualMuscle';
import SimpleBergBalance from './components/SimpleBergBalance';
import SimplePosturalTolerances from './components/SimplePosturalTolerances';
import SimpleTransfersAssessment from './components/SimpleTransfersAssessment';

export function SimpleFunctionalStatus() {
  const { toast } = useToast();
  const { data, updateSection, isSaving } = useAssessment();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rangeOfMotion');

  // Initialize form with zod resolver
  const methods = useForm({
    resolver: zodResolver(functionalStatusSchema),
    defaultValues: defaultFormState
  });

  // Load functional status data from context
  useEffect(() => {
    try {
      if (data?.functionalStatus) {
        // Apply data from context to form
        methods.reset(data.functionalStatus);
      } else {
        // If no data exists, use defaults
        methods.reset(defaultFormState);
      }
    } catch (error) {
      console.error('Error loading functional status data:', error);
      toast({
        title: 'Data Loading Error',
        description: 'There was a problem loading the functional status data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [data?.functionalStatus, methods, toast]);

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      await updateSection('functionalStatus', formData);
      toast({
        title: 'Functional Status Saved',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving functional status data:', error);
      toast({
        title: 'Save Error',
        description: 'There was a problem saving your changes.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Loading functional status data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-4">
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Complete all relevant sections based on patient presentation. You can use the tabs below to navigate between different assessment areas.
        </AlertDescription>
      </Alert>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Tabs defaultValue="rangeOfMotion" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6 grid grid-cols-2 md:grid-cols-5 h-auto">
              <TabsTrigger value="rangeOfMotion">Range of Motion</TabsTrigger>
              <TabsTrigger value="manualMuscle">Manual Muscle Testing</TabsTrigger>
              <TabsTrigger value="bergBalance">Berg Balance</TabsTrigger>
              <TabsTrigger value="posturalTolerances">Postural Tolerances</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rangeOfMotion">
              <Card>
                <CardHeader>
                  <CardTitle>Range of Motion Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary>
                    <RangeOfMotion />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="manualMuscle">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Muscle Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary>
                    <SimpleManualMuscle />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bergBalance">
              <Card>
                <CardHeader>
                  <CardTitle>Berg Balance Scale</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary>
                    <SimpleBergBalance />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="posturalTolerances">
              <Card>
                <CardHeader>
                  <CardTitle>Postural Tolerances</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary>
                    <SimplePosturalTolerances />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transfers">
              <Card>
                <CardHeader>
                  <CardTitle>Transfers Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary>
                    <SimpleTransfersAssessment />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button 
              type="submit" 
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Functional Status'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default SimpleFunctionalStatus;