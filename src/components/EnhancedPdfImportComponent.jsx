import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, FileText, Check, AlertCircle, ChevronRight, Save, Send } from 'lucide-react';
import PatternTrainingInterface from './PatternTrainingInterface';
import { useToast } from '@/components/ui/use-toast';

const EnhancedPdfImportComponent = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  const [missingFields, setMissingFields] = useState([]);
  const [showTraining, setShowTraining] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // Reset state when changing tabs
  useEffect(() => {
    if (activeTab === 'upload') {
      setFile(null);
      setExtractionResult(null);
      setExtractionProgress(0);
      setMissingFields([]);
    }
  }, [activeTab]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Process the uploaded PDF
  const handleProcessPdf = async () => {
    if (!file) return;

    setIsLoading(true);
    setExtractionProgress(10);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExtractionProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

      // Call the enhanced extraction API
      const response = await fetch('/api/enhanced-pdf-import', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setExtractionProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error processing PDF');
      }

      const result = await response.json();
      setExtractionResult(result);

      // Identify missing fields
      if (result._missingFields) {
        setMissingFields(result._missingFields);
      } else {
        // Calculate missing fields based on confidence scores
        const missing = [];
        Object.keys(result).forEach(section => {
          if (section.startsWith('_')) return;
          
          const sectionData = result[section];
          if (!sectionData || !sectionData.confidence) return;
          
          Object.entries(sectionData.confidence).forEach(([field, confidence]) => {
            if (confidence < 0.5 && field !== 'confidence') {
              missing.push({
                field: `${section}.${field}`,
                confidence,
                importance: confidence < 0.3 ? 'high' : 'medium'
              });
            }
          });
        });
        
        setMissingFields(missing);
      }

      // Move to review tab
      setActiveTab('review');

      toast({
        title: "Document processed successfully",
        description: `Detected document type: ${result._documentType || 'Unknown'}`,
        variant: "success",
      });
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      
      toast({
        title: "Error processing document",
        description: error.message || "Failed to process the document",
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  // Handle import to assessment
  const handleImport = async () => {
    if (!extractionResult) return;

    setIsLoading(true);

    try {
      // Call the import API
      const response = await fetch('/api/import-to-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ extractionResult }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error importing data');
      }

      const result = await response.json();

      toast({
        title: "Data imported successfully",
        description: "The extracted data has been added to your assessment",
        variant: "success",
      });

      // Redirect to assessment
      router.push('/full-assessment');
      
    } catch (error) {
      console.error('Error importing data:', error);
      
      toast({
        title: "Error importing data",
        description: error.message || "Failed to import the data",
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  // Handle training submission
  const handleSaveTraining = async (trainingData) => {
    try {
      // Call the training API
      await fetch('/api/train-pattern-recognition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalExtraction: extractionResult,
          correctedData: trainingData,
          documentType: extractionResult._documentType || 'OT_ASSESSMENT'
        }),
      });

      toast({
        title: "Training submitted",
        description: "Thank you for helping improve our pattern recognition system",
        variant: "success",
      });
      
    } catch (error) {
      console.error('Error submitting training data:', error);
      
      toast({
        title: "Error submitting training",
        description: error.message || "Failed to submit the training data",
        variant: "destructive",
      });
    }
  };

  // Render confidence badge
  const renderConfidenceBadge = (confidence) => {
    let variant = 'default';
    if (confidence >= 0.8) {
      variant = 'success';
    } else if (confidence >= 0.5) {
      variant = 'warning';
    } else {
      variant = 'destructive';
    }
    
    return (
      <Badge variant={variant}>
        {Math.round(confidence * 100)}% Confidence
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enhanced PDF Import</CardTitle>
        <CardDescription>Import assessment data with intelligent validation and suggestions</CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Import Document</TabsTrigger>
          <TabsTrigger value="review" disabled={!extractionResult}>Review Results</TabsTrigger>
          <TabsTrigger value="import" disabled={!extractionResult}>Import to Assessment</TabsTrigger>
        </TabsList>
        
        {/* Upload Tab */}
        <TabsContent value="upload" className="p-4 space-y-4">
          <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-md border-gray-300 hover:border-gray-400 transition-colors">
            <FileText className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              Upload a PDF assessment document
            </p>
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/90"
            />
          </div>
          
          {file && (
            <div className="flex justify-between items-center p-3 bg-background border rounded-md">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
              </div>
              <Button
                onClick={handleProcessPdf}
                disabled={isLoading}
                className="ml-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process Document'
                )}
              </Button>
            </div>
          )}
          
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing document</span>
                <span>{Math.round(extractionProgress)}%</span>
              </div>
              <Progress value={extractionProgress} />
            </div>
          )}
        </TabsContent>
        
        {/* Review Tab */}
        <TabsContent value="review" className="space-y-4 p-4">
          {extractionResult && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">
                    {extractionResult._documentType || 'Document'} 
                    {extractionResult._documentConfidence && (
                      renderConfidenceBadge(extractionResult._documentConfidence)
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {Object.keys(extractionResult).filter(k => !k.startsWith('_')).length} sections extracted
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTraining(!showTraining)}
                  >
                    {showTraining ? 'Hide Training' : 'Correction & Training'}
                  </Button>
                  <Button onClick={() => setActiveTab('import')}>
                    Continue to Import
                  </Button>
                </div>
              </div>
              
              {missingFields.length > 0 && (
                <Alert variant="warning" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Missing or Low Confidence Information</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">The following information was not found or has low confidence:</p>
                    <ul className="list-disc pl-5">
                      {missingFields.map((field, index) => (
                        <li key={index} className="text-sm">
                          {field.field} 
                          {field.importance && (
                            <Badge variant={field.importance === 'high' ? 'destructive' : 'warning'} className="ml-2">
                              {field.importance} importance
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Section review */}
              <div className="space-y-3">
                {Object.keys(extractionResult)
                  .filter(section => !section.startsWith('_'))
                  .map(section => (
                    <Collapsible key={section} className="border rounded-md">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <CollapsibleTrigger className="flex items-center">
                            <ChevronRight className="h-4 w-4 mr-2" />
                          </CollapsibleTrigger>
                          <h4 className="text-md font-medium">{section}</h4>
                          {extractionResult[section]?.confidence && (
                            <div className="ml-2">
                              {renderConfidenceBadge(
                                typeof extractionResult[section].confidence === 'object'
                                  ? Object.values(extractionResult[section].confidence).reduce((a, b) => a + b, 0) / 
                                    Object.values(extractionResult[section].confidence).length
                                  : extractionResult[section].confidence
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <CollapsibleContent className="p-4 pt-0 border-t">
                        <div className="space-y-2">
                          {Object.entries(extractionResult[section])
                            .filter(([key]) => key !== 'confidence' && !key.startsWith('_'))
                            .map(([key, value]) => (
                              <div key={key} className="grid grid-cols-3 gap-2">
                                <div className="font-medium text-sm">{key}</div>
                                <div className="col-span-2 text-sm break-words">
                                  {Array.isArray(value) 
                                    ? value.map((item, i) => <div key={i}>{item}</div>)
                                    : typeof value === 'object'
                                      ? JSON.stringify(value)
                                      : String(value)
                                  }
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                }
              </div>
              
              {/* Training Interface */}
              {showTraining && (
                <div className="mt-6">
                  <PatternTrainingInterface
                    extractionResult={extractionResult}
                    onSaveTraining={handleSaveTraining}
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        {/* Import Tab */}
        <TabsContent value="import" className="p-4 space-y-4">
          {extractionResult && (
            <>
              <Alert className="mb-4">
                <Check className="h-4 w-4" />
                <AlertTitle>Ready to Import</AlertTitle>
                <AlertDescription>
                  The extracted data is ready to be imported into your assessment.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-md font-medium">Import Summary</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Document Type:</div>
                    <div>{extractionResult._documentType || 'Unknown'}</div>
                    
                    <div>Sections:</div>
                    <div>{Object.keys(extractionResult).filter(k => !k.startsWith('_')).length}</div>
                    
                    <div>Overall Confidence:</div>
                    <div>
                      {extractionResult._documentConfidence 
                        ? `${Math.round(extractionResult._documentConfidence * 100)}%`
                        : 'N/A'
                      }
                    </div>
                    
                    <div>Missing Fields:</div>
                    <div>{missingFields.length}</div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setActiveTab('review')}>
                    Back to Review
                  </Button>
                  <Button 
                    onClick={handleImport}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Import to Assessment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-4">
        <div className="text-sm text-gray-500">
          Tip: For best results, use structured assessment reports with clear section headers
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedPdfImportComponent;
