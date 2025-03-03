'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as pdfjsLib from 'pdfjs-dist';
import { processPdfText, mapToApplicationModel } from '@/utils/pdf-import';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AssessmentImport() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [assessmentData, setAssessmentData] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsProcessing(true);
    setUploadProgress(0);
    setError('');
    setFileName(file.name);
    
    try {
      // Extract text from PDF
      setUploadProgress(20);
      
      const reader = new FileReader();
      const arrayBuffer = await new Promise((resolve, reject) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
      
      setUploadProgress(40);
      
      // Configure PDF.js
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
      }
      
      // Load the PDF document
      const data = new Uint8Array(arrayBuffer);
      const loadingTask = pdfjsLib.getDocument({ data });
      const pdf = await loadingTask.promise;
      
      setUploadProgress(50);
      
      // Extract text from all pages
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const pageProgress = 50 + Math.round((i / pdf.numPages) * 40);
        setUploadProgress(pageProgress);
        
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      setUploadProgress(90);
      
      // Process the text using pattern recognition
      const processedData = processPdfText(fullText);
      
      // Map to application model
      const appData = mapToApplicationModel(processedData);
      
      // Save to localStorage for demonstration
      localStorage.setItem('importedAssessmentData', JSON.stringify(appData));
      
      setUploadProgress(100);
      setAssessmentData(appData);
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError('Error processing PDF: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAssessment = () => {
    // Navigate to a page that will use the data from localStorage
    router.push('/assessment/new?from=import');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Import Assessment PDF</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Assessment PDF</CardTitle>
          <CardDescription>
            Upload a PDF of an In-Home Assessment to extract structured data using pattern recognition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById('file-upload').click()}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Select PDF'}
            </Button>
            
            {fileName && <p className="text-sm mt-2">File: {fileName}</p>}
            
            {isProcessing && (
              <div className="space-y-2 mt-4">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-gray-500 text-right">{uploadProgress}%</p>
              </div>
            )}
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      {assessmentData && (
        <Card>
          <CardHeader>
            <CardTitle>Extraction Complete</CardTitle>
            <CardDescription>
              The assessment data has been extracted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Data extracted from {fileName} is ready to be used in your assessment.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveAssessment}>
              Continue to Assessment Form
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
