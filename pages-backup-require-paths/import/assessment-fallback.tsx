import React, { useState } from 'react';
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
import { Progress } from "../../components/ui/progress";
import { Spinner } from "../../components/ui/spinner";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { mapToApplicationModel } from '../../utils/pdf-import';

/**
 * AssessmentImportFallback - A fallback component for importing assessment PDFs
 * that uses server-side processing instead of browser-based PDF.js
 */
export default function AssessmentImportFallback() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [assessmentData, setAssessmentData] = useState(null);
  const [confidenceScores, setConfidenceScores] = useState({});
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('demographics');

  /**
   * Handle file upload and process the PDF
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsProcessing(true);
    setUploadProgress(0);
    setError('');
    setFileName(file.name);
    
    try {
      // This is where we would upload the PDF to a server for processing
      // For now, we'll simulate the process with progress updates
      
      // Simulate upload progress
      for (let i = 0; i <= 90; i += 10) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 300));
      }
      
      setUploadProgress(100);
      
      // Simulated server response with extracted sections
      // In a real implementation, this would come from the server
      const simulatedServerResponse = {
        sectionConfidence: {
          DEMOGRAPHICS: 0.85,
          MEDICAL_HISTORY: 0.72,
          SYMPTOMS: 0.68,
          FUNCTIONAL_STATUS: 0.76,
          ENVIRONMENTAL: 0.64,
          ADLS: 0.81,
          ATTENDANT_CARE: 0.77,
          TYPICAL_DAY: 0.62,
          PURPOSE: 0.79
        },
        data: {
          demographics: {
            name: "Sample Patient",
            age: "45",
            gender: "Male",
            address: "123 Main St",
            phone: "555-1234",
            email: "patient@example.com"
          },
          medical_history: {
            conditions: ["Hypertension", "Type 2 Diabetes", "Osteoarthritis"],
            medications: ["Lisinopril", "Metformin", "Ibuprofen"],
            surgeries: ["Appendectomy (2010)"],
            allergies: ["Penicillin"]
          },
          // More sections would be included in a real response...
          symptoms: {
            reportedSymptoms: ["Back pain", "Difficulty walking"],
            painLocation: "Lower back, radiating to left leg",
            painSeverity: "7/10",
            functionalImpact: ["Cannot sit for long periods", "Difficulty climbing stairs"]
          }
        }
      };
      
      // Map the data to the application model
      const appData = mapToApplicationModel(simulatedServerResponse);
      
      // Update state
      setAssessmentData(appData);
      setConfidenceScores(simulatedServerResponse.sectionConfidence);
      
      // Set active tab to the section with highest confidence
      const highestConfidenceSection = Object.entries(simulatedServerResponse.sectionConfidence)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (highestConfidenceSection) {
        setActiveTab(highestConfidenceSection[0].toLowerCase());
      }
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError('Error processing PDF: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
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
        <h1 className="text-3xl font-bold mb-8">Import Assessment PDF (Fallback Mode)</h1>
        
        <Alert className="mb-4">
          <AlertTitle>Using Fallback Processing Mode</AlertTitle>
          <AlertDescription>
            Due to PDF.js compatibility issues, this page uses an alternative processing approach.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Assessment PDF</CardTitle>
            <CardDescription>
              Upload a PDF of an In-Home Assessment to extract structured data.
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
                      <span>Processing file...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
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
            
            {/* The rest of the component with tabs and sections would go here */}
            <CardContent className="p-6">
              <p className="text-center text-gray-500">
                This is a simplified demonstration of the fallback mode. <br/>
                In a complete implementation, all sections would be fully functional.
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setAssessmentData(null)}>Reset</Button>
              <Button>Save Assessment</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
