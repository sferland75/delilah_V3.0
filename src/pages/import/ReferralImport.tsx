"use client";

/**
 * Referral Import Page component
 */

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useToast } from "@/components/ui/use-toast";
import { useAssessment } from '@/contexts/AssessmentContext';
import { processPdfText, isReferralDocument } from '@/utils/pdf-import';

// Configure PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
if (typeof window !== 'undefined') {
  window.STANDARD_FONTS_PATH = '/standard_fonts/';
}

export function ReferralImport() {
  const router = useRouter();
  const { toast } = useToast();
  const { updateReferral } = useAssessment();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const [referralData, setReferralData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF document",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setStatus('processing');
      setProcessingProgress(10);
      setProcessingStep('Loading PDF document...');
      
      // Load the PDF document
      const arrayBuffer = await file.arrayBuffer();
      setProcessingProgress(20);
      
      // Extract text from PDF
      setProcessingStep('Extracting text from document...');
      const text = await extractTextFromPdf(arrayBuffer);
      setProcessingProgress(40);
      
      // Process the text
      setProcessingStep('Processing document content...');
      const processedData = processPdfText(text);
      setProcessingProgress(70);
      
      // Check if this is a referral document
      if (!isReferralDocument(processedData)) {
        setStatus('error');
        setErrorMessage('The uploaded document does not appear to be a referral document. Please upload a valid referral document.');
        return;
      }
      
      setProcessingProgress(80);
      setProcessingStep('Preparing referral data...');
      
      // Set the referral data
      setReferralData(processedData);
      setProcessingProgress(100);
      setStatus('success');
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      setStatus('error');
      setErrorMessage('An error occurred while processing the document. Please try again.');
    }
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: status === 'processing'
  });
  
  const handleSave = () => {
    if (referralData) {
      // Update the assessment context with the referral data
      updateReferral(referralData);
      
      toast({
        title: "Referral imported successfully",
        description: "The referral information has been added to your assessment.",
        variant: "default"
      });
      
      // Navigate back to the assessment
      router.push('/assessment');
    }
  };
  
  const handleDiscard = () => {
    setStatus('idle');
    setReferralData(null);
    setErrorMessage('');
    setProcessingProgress(0);
  };
  
  /**
   * Extract text content from a PDF file
   * @param arrayBuffer PDF file as ArrayBuffer
   * @returns Extracted text content
   */
  const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const data = new Uint8Array(arrayBuffer);
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  };
  
  const renderClientInfo = () => {
    if (!referralData || !referralData?.referral?.client) return null;
    
    const client = referralData.referral.client;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium">Client Name</h3>
            <p className="text-sm">{client.name || 'Not provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">File Number</h3>
            <p className="text-sm">{client.fileNumber || 'Not provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Date of Birth</h3>
            <p className="text-sm">{client.dateOfBirth || 'Not provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Date of Loss</h3>
            <p className="text-sm">{client.dateOfLoss || 'Not provided'}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderRequirements = () => {
    if (!referralData || !referralData?.referral) return null;
    
    const { assessmentTypes, specificRequirements, domains, criteria } = referralData.referral;
    
    return (
      <div className="space-y-4">
        {assessmentTypes && assessmentTypes.length > 0 && (
          <div>
            <h3 className="text-sm font-medium">Assessment Types</h3>
            <ul className="list-disc pl-5 text-sm mt-1">
              {assessmentTypes.map((type: string, index: number) => (
                <li key={index}>{type}</li>
              ))}
            </ul>
          </div>
        )}
        
        {specificRequirements && specificRequirements.length > 0 && (
          <div>
            <h3 className="text-sm font-medium">Specific Requirements</h3>
            <ul className="list-disc pl-5 text-sm mt-1">
              {specificRequirements.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
        
        {domains && domains.length > 0 && (
          <div>
            <h3 className="text-sm font-medium">Domains to Address</h3>
            <ul className="list-disc pl-5 text-sm mt-1">
              {domains.map((domain: string, index: number) => (
                <li key={index}>{domain}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="container py-6">
      {status === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Referral Document</CardTitle>
            <CardDescription>
              Upload a referral document to automatically extract client information and assessment requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-2">
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                {isDragActive ? (
                  <p className="text-primary font-medium">Drop the file here</p>
                ) : (
                  <>
                    <p className="font-medium">Drag and drop your file here or click to browse</p>
                    <p className="text-sm text-muted-foreground">
                      Accepted file type: PDF (.pdf)
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {status === 'processing' && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Document</CardTitle>
            <CardDescription>
              Please wait while we process your referral document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={processingProgress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">{processingStep}</p>
          </CardContent>
        </Card>
      )}
      
      {status === 'error' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <CrossCircledIcon className="mr-2 h-5 w-5" />
              Error Processing Document
            </CardTitle>
            <CardDescription>
              We encountered an error while processing your document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Processing Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDiscard} className="w-full">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {status === 'success' && referralData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-success">
              <CheckCircledIcon className="mr-2 h-5 w-5" />
              Document Processed Successfully
            </CardTitle>
            <CardDescription>
              We've extracted the following information from your referral document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="client">Client Information</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="confidence">Confidence</TabsTrigger>
              </TabsList>
              
              <TabsContent value="client" className="mt-4 space-y-4">
                {renderClientInfo()}
              </TabsContent>
              
              <TabsContent value="requirements" className="mt-4 space-y-4">
                {renderRequirements()}
              </TabsContent>
              
              <TabsContent value="confidence" className="mt-4 space-y-4">
                <p className="text-sm mb-2">
                  Confidence scores indicate how certain we are about the extracted information.
                </p>
                
                {referralData.confidence && Object.entries(referralData.confidence).map(([section, confidence]: [string, any]) => (
                  <div key={section} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{section}</span>
                      <span className="text-xs">{Math.round(confidence * 100)}%</span>
                    </div>
                    <Progress value={confidence * 100} className="h-2" />
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={handleDiscard}>
              Discard
            </Button>
            <Button onClick={handleSave}>
              Import Referral
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="mt-6">
        <Alert>
          <InfoCircledIcon className="h-4 w-4" />
          <AlertTitle>About Referral Import</AlertTitle>
          <AlertDescription>
            Importing a referral document will extract client information, assessment requirements,
            and other relevant details to provide context for your assessment. This information can
            be accessed throughout the assessment process.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export default ReferralImport;