import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as pdfjsLib from 'pdfjs-dist';
import { processPdfText, mapToApplicationModel } from '../../utils/pdf-import';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
  Separator,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Progress,
  ScrollArea,
  Spinner,
  Badge,
  Alert, 
  AlertDescription, 
  AlertTitle
} from "../../components/ui";

/**
 * AssessmentImport - Component for importing and processing assessment PDFs
 * 
 * This component uses pattern recognition to extract structured data from
 * assessment PDFs and display the results with confidence indicators.
 */
export default function AssessmentImport() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [assessmentData, setAssessmentData] = useState(null);
  const [confidenceScores, setConfidenceScores] = useState({});
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('demographics');
  const [processingTimer, setProcessingTimer] = useState(null);
  const [editedData, setEditedData] = useState({});

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (processingTimer) {
        clearTimeout(processingTimer);
      }
    };
  }, [processingTimer]);

  // Initialize edited data when assessment data changes
  useEffect(() => {
    if (assessmentData) {
      setEditedData(assessmentData);
    }
  }, [assessmentData]);

  /**
   * Extract text from a PDF file with timeout protection
   */
  async function extractTextFromPdf(file) {
    // Create a FileReader to read the file as ArrayBuffer
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      // Set timeout for the entire operation (2 minutes)
      const timeout = setTimeout(() => {
        reject(new Error('PDF processing timed out. The file may be too large or complex.'));
      }, 120000);
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 30); // 30% of total progress
          setUploadProgress(progress);
        }
      };
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const data = new Uint8Array(arrayBuffer);
          
          // Configure PDF.js
          if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
          }
          
          // Load the PDF document
          setUploadProgress(40); // 40% progress after file is loaded
          console.log('Loading PDF document...');
          
          const loadingTask = pdfjsLib.getDocument({ 
            data,
            // Increase PDF.js internal timeout
            cMapPacked: true,
            disableRange: false,
            disableStream: false
          });
          
          const pdf = await loadingTask.promise;
          
          // Get total number of pages
          const numPages = pdf.numPages;
          console.log(`PDF loaded with ${numPages} pages.`);
          setUploadProgress(50); // 50% progress once PDF is loaded
          
          // Extract text from all pages
          let fullText = '';
          for (let i = 1; i <= numPages; i++) {
            // Update progress based on page extraction (50% to 100%)
            const pageProgress = Math.round(50 + ((i - 1) / numPages) * 50);
            console.log(`Extracting text from page ${i} of ${numPages}...`);
            setUploadProgress(pageProgress);
            
            try {
              // Set a timeout for each page extraction (30 seconds)
              const pagePromise = Promise.race([
                pdf.getPage(i),
                new Promise((_, pageReject) => 
                  setTimeout(() => pageReject(new Error(`Timeout extracting page ${i}`)), 30000)
                )
              ]);
              
              const page = await pagePromise;
              const content = await page.getTextContent();
              const pageText = content.items.map(item => item.str).join(' ');
              fullText += pageText + '\n\n';
            } catch (pageError) {
              console.error(`Error processing page ${i}:`, pageError);
              fullText += `[Error extracting page ${i}]\n\n`;
            }
          }
          
          clearTimeout(timeout);
          setUploadProgress(100);
          console.log('PDF text extraction complete.');
          resolve(fullText);
        } catch (error) {
          clearTimeout(timeout);
          console.error('Error extracting text from PDF:', error);
          reject(error);
        }
      };
      
      reader.onerror = (e) => {
        clearTimeout(timeout);
        reject(new Error('Error reading file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Handle process cancellation
   */
  const cancelProcessing = () => {
    if (processingTimer) {
      clearTimeout(processingTimer);
    }
    setIsProcessing(false);
    setUploadProgress(0);
    setError('Processing cancelled by user.');
  };

  /**
   * Handle file upload and process the PDF
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (warn if over 10MB)
    if (file.size > 10 * 1024 * 1024) {
      if (!confirm('The file is large (over 10MB). Processing may take a long time. Continue?')) {
        return;
      }
    }
    
    setIsProcessing(true);
    setUploadProgress(0);
    setError('');
    setFileName(file.name);
    
    // Set a global timeout (3 minutes)
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setError('Processing timed out. The file may be too large or complex.');
    }, 180000);
    
    setProcessingTimer(timer);
    
    try {
      // Extract text from PDF
      console.log('Starting PDF extraction...');
      const text = await extractTextFromPdf(file);
      
      if (text.length === 0) {
        throw new Error('No text could be extracted from the PDF. The file may be scanned or protected.');
      }
      
      console.log('Text extracted, processing with pattern recognition...');
      console.log(`Extracted text length: ${text.length} characters`);
      
      // Process the text using pattern recognition
      const processedData = processPdfText(text);
      
      console.log('Pattern recognition complete, mapping to application model...');
      // Map to application model
      const appData = mapToApplicationModel(processedData);
      
      // Update state
      setAssessmentData(appData);
      setConfidenceScores(appData.confidence);
      
      // Set active tab to the section with highest confidence
      const highestConfidenceSection = Object.entries(appData.confidence)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (highestConfidenceSection) {
        setActiveTab(highestConfidenceSection[0].toLowerCase());
      }
      
      console.log('PDF processing complete.');
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError('Error processing PDF: ' + error.message);
    } finally {
      clearTimeout(timer);
      setProcessingTimer(null);
      setIsProcessing(false);
    }
  };

  /**
   * Handle saving the assessment data
   */
  const handleSaveAssessment = () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, you would save to your backend or local storage
      // For now, we'll just simulate a save by waiting and then redirecting
      
      // Store the data in localStorage for demo purposes
      localStorage.setItem('importedAssessmentData', JSON.stringify(editedData));
      
      // Simulate saving delay
      setTimeout(() => {
        // Redirect to the assessment page
        router.push({
          pathname: '/assessment/new',
          query: { from: 'import' } // This will signal to load the imported data
        });
      }, 1000);
    } catch (error) {
      console.error('Error saving assessment:', error);
      setError('Error saving assessment: ' + error.message);
      setIsSaving(false);
    }
  };

  /**
   * Handle section data updates from VerifiableSection
   */
  const handleSectionUpdate = (sectionKey, sectionData) => {
    setEditedData(prevData => ({
      ...prevData,
      [sectionKey]: sectionData
    }));
  };

  /**
   * Get confidence class based on confidence score
   */
  function getConfidenceClass(score) {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.5) return 'bg-amber-500';
    return 'bg-red-500';
  }

  /**
   * Get confidence label based on confidence score
   */
  function getConfidenceLabel(score) {
    if (score >= 0.8) return 'High';
    if (score >= 0.5) return 'Medium';
    return 'Low';
  }

  /**
   * Convert section name to display format
   */
  function formatSectionName(section) {
    return section
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Import Assessment PDF</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Assessment PDF</CardTitle>
            <CardDescription>
              Upload a PDF of an In-Home Assessment to extract structured data using pattern recognition.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="space-y-2">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="hidden"
                />
                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => document.getElementById('file-upload').click()}
                    disabled={isProcessing}
                    className="w-full sm:w-auto"
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <Spinner size="sm" className="mr-2" />
                        Processing...
                      </span>
                    ) : 'Select PDF'}
                  </Button>
                  {fileName && <span className="text-sm text-gray-500 ml-2">{fileName}</span>}
                </div>
                
                {isProcessing && (
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Extracting data...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    <div className="text-right mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={cancelProcessing}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setError('')}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {!isProcessing && !error && (
                  <div className="text-sm text-gray-500 mt-2">
                    <p>Supported formats: PDF files with text content (not scanned images)</p>
                    <p>Maximum recommended size: 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {assessmentData && (
          <Card>
            <CardHeader>
              <CardTitle>Extracted Assessment Data</CardTitle>
              <CardDescription>
                The following data was extracted from the PDF. Sections with lower confidence may need manual review.
              </CardDescription>
            </CardHeader>
            
            <div className="px-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Confidence Scores</h3>
                <div className="space-y-3">
                  {Object.entries(confidenceScores).map(([section, score]) => (
                    <div key={section} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{formatSectionName(section)}</span>
                        <span>
                          <Badge className={`${getConfidenceClass(score)} text-white`}>
                            {getConfidenceLabel(score)} ({Math.round(score * 100)}%)
                          </Badge>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${getConfidenceClass(score)} h-2 rounded-full`}
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <CardContent className="p-6">
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
                
                <div className="mt-6">
                  {/* 
                  Tab contents would go here
                  Each tab would display the extracted data for that section
                  */}
                  <div className="p-4 border rounded-md">
                    <p>Data extraction preview is working. Please implement the VerifiableSection component to view extracted data.</p>
                  </div>
                </div>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setAssessmentData(null)}>Reset</Button>
              <Button 
                onClick={handleSaveAssessment} 
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <Spinner size="sm" className="mr-2" />
                    Saving...
                  </span>
                ) : 'Save Assessment'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
