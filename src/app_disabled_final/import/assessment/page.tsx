'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PdfUploader } from '@/components/pdf/PdfUploader';
import { ExtractedDataReview } from '@/components/pdf/ExtractedDataReview';
import { MainLayout } from '@/components/layout/MainLayout';

// Sample mock data
const mockExtractedData = {
  demographics: {
    fullName: { value: 'John Smith', confidence: 95, source: 'Page 1, Line 3' },
    dateOfBirth: { value: '1978-04-15', confidence: 90, source: 'Page 1, Line 4' },
    gender: { value: 'Male', confidence: 85, source: 'Page 1, Line 5' },
    address: { value: '123 Main St, Anytown, CA 94523', confidence: 75, source: 'Page 1, Line 6' },
    phoneNumber: { value: '555-123-4567', confidence: 80, source: 'Page 1, Line 7' },
    email: { value: 'john.smith@example.com', confidence: 65, source: 'Page 1, Line 8' },
  },
  medicalHistory: {
    primaryDiagnosis: { value: 'Traumatic Brain Injury', confidence: 92, source: 'Page 2, Line 10' },
    dateOfInjury: { value: '2023-06-10', confidence: 88, source: 'Page 2, Line 11' },
    secondaryDiagnoses: { value: 'Fractured right femur, Post-concussion syndrome', confidence: 75, source: 'Page 2, Lines 12-13' },
    pastMedicalHistory: { value: 'Hypertension, Type 2 Diabetes', confidence: 70, source: 'Page 2, Lines 14-15' },
    medications: { value: 'Insulin, Lisinopril, Acetaminophen', confidence: 65, source: 'Page 2, Lines 16-17' },
    allergies: { value: 'Penicillin, Shellfish', confidence: 60, source: 'Page 2, Line 18' },
  },
  symptoms: {
    headaches: { value: 'Severe, Daily, 8/10 pain level', confidence: 85, source: 'Page 3, Line 5' },
    dizziness: { value: 'Frequent, When standing quickly', confidence: 80, source: 'Page 3, Line 6' },
    memoryIssues: { value: 'Short-term memory deficits', confidence: 75, source: 'Page 3, Line 7' },
    concentration: { value: 'Difficulty focusing for more than 15 minutes', confidence: 70, source: 'Page 3, Line 8' },
    balanceProblems: { value: 'Unsteady gait, Requires support when walking', confidence: 65, source: 'Page 3, Line 9' },
    sleepDisturbances: { value: 'Insomnia, Averaging 4-5 hours per night', confidence: 60, source: 'Page 3, Line 10' },
  },
  functionalStatus: {
    mobility: { value: 'Requires walker for all ambulation', confidence: 88, source: 'Page 4, Line 3' },
    selfCare: { value: 'Independent with dressing upper body, needs assistance for lower body', confidence: 82, source: 'Page 4, Line 4' },
    homeManagement: { value: 'Unable to perform household tasks independently', confidence: 78, source: 'Page 4, Line 5' },
    communityAccess: { value: 'Unable to drive, requires assistance for all community access', confidence: 75, source: 'Page 4, Line 6' },
    cognition: { value: 'Difficulty with problem-solving and complex tasks', confidence: 70, source: 'Page 4, Line 7' },
    communication: { value: 'Mild expressive aphasia, occasional word-finding difficulties', confidence: 65, source: 'Page 4, Line 8' },
  }
};

export default function ImportAssessment() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  
  const handleUpload = async (file: File) => {
    setUploadedFile(file);
    setProcessingStatus('uploading');
    setProcessingProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // In a real implementation, you would call your pattern recognition API here
      // For demo purposes, we'll simulate processing with a timeout
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Simulate extracted data
      setExtractedData(mockExtractedData);
      
      setProcessingStatus('complete');
      setActiveTab('review');
    } catch (error) {
      setProcessingStatus('error');
    } finally {
      clearInterval(progressInterval);
      setProcessingProgress(100);
    }
  };
  
  const handleContinue = () => {
    if (extractedData) {
      // Store the extracted data in localStorage for form population
      localStorage.setItem('importedAssessmentData', JSON.stringify(extractedData));
      
      // Navigate to the assessment form
      router.push('/assessment/initial?from=import');
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Import Assessment Documents</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="review" disabled={!extractedData}>Review Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload PDF Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <PdfUploader onUpload={handleUpload} />
                
                {processingStatus !== 'idle' && (
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span>
                        {processingStatus === 'uploading' ? 'Processing...' :
                         processingStatus === 'complete' ? 'Processing Complete' :
                         processingStatus === 'error' ? 'Error processing document' :
                         'Uploading...'}
                      </span>
                      <span>{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                    
                    {processingStatus === 'complete' && (
                      <div className="mt-4">
                        <Button onClick={() => setActiveTab('review')}>
                          Review Extracted Data
                        </Button>
                      </div>
                    )}
                    
                    {processingStatus === 'error' && (
                      <div className="mt-4 text-red-500">
                        There was an error processing your document. Please try again or upload a different file.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle>Review Extracted Data</CardTitle>
              </CardHeader>
              <CardContent>
                {extractedData && <ExtractedDataReview data={extractedData} />}
              </CardContent>
              <CardFooter>
                <Button onClick={handleContinue}>
                  Continue to Assessment Form
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
