// PatternTrainingInterface.jsx
// UI for training the pattern recognition system
// Part of Delilah V3.0 PDF Import Pattern Recognition Enhancement

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Check, AlertTriangle, X, ChevronDown, ChevronRight, FileText, Save, RefreshCw } from 'lucide-react';

/**
 * Pattern Training Interface Component
 * Allows users to train the pattern recognition system by correcting extraction results
 */
const PatternTrainingInterface = ({ extractionResult, onSaveTraining }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [correctedData, setCorrectedData] = useState(null);
  const [documentType, setDocumentType] = useState('OT_ASSESSMENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainingResult, setTrainingResult] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  // Document type options
  const documentTypes = [
    { value: 'OT_ASSESSMENT', label: 'Occupational Therapy Assessment' },
    { value: 'MEDICAL_REPORT', label: 'Medical Report' },
    { value: 'PSYCHOLOGY_REPORT', label: 'Psychology Report' },
    { value: 'REHABILITATION_PLAN', label: 'Rehabilitation Plan' }
  ];
  
  // Initialize corrected data from extraction result
  useEffect(() => {
    if (extractionResult && !correctedData) {
      // Deep clone to avoid modifying the original
      setCorrectedData(JSON.parse(JSON.stringify(extractionResult)));
    }
  }, [extractionResult, correctedData]);
  
  /**
   * Handle changes to the corrected data
   * @param {String} section - Section name
   * @param {String} field - Field name
   * @param {any} value - New field value
   */
  const handleFieldChange = (section, field, value) => {
    setCorrectedData(prev => {
      // Create a new object to maintain immutability
      const updated = { ...prev };
      
      // Ensure section exists
      if (!updated[section]) {
        updated[section] = {};
      }
      
      // Update the field
      updated[section][field] = value;
      
      return updated;
    });
  };
  
  /**
   * Handle document type selection
   * @param {String} value - Selected document type
   */
  const handleDocumentTypeChange = (value) => {
    setDocumentType(value);
  };
  
  /**
   * Submit corrections for training
   */
  const handleSubmitCorrections = async () => {
    if (!correctedData || !extractionResult) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call an API
      // For this example, we'll simulate the training process
      const trainingResponse = await simulateTraining(extractionResult, correctedData, documentType);
      
      setTrainingResult(trainingResponse);
      
      // Call the parent component's callback
      if (onSaveTraining) {
        onSaveTraining(trainingResponse);
      }
    } catch (error) {
      console.error('Error submitting corrections:', error);
      setTrainingResult({
        success: false,
        error: error.message || 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Simulate the training process
   * @param {Object} original - Original extraction
   * @param {Object} corrected - Corrected data
   * @param {String} type - Document type
   * @returns {Promise<Object>} - Training result
   */
  const simulateTraining = async (original, corrected, type) => {
    // In a real implementation, this would make an API call to the backend
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // Calculate differences
        const differences = calculateDifferences(original, corrected);
        
        resolve({
          success: true,
          id: 'training-' + Date.now(),
          timestamp: new Date().toISOString(),
          documentType: type,
          differences,
          patternImprovements: {
            // Simplified pattern improvements for demo
            sections: Object.keys(differences).length,
            fieldsImproved: countFieldImprovements(differences),
            confidence: 0.85
          }
        });
      }, 1000);
    });
  };
  
  /**
   * Calculate differences between original and corrected data
   * @param {Object} original - Original extraction
   * @param {Object} corrected - Corrected data
   * @returns {Object} - Differences
   */
  const calculateDifferences = (original, corrected) => {
    const differences = {};
    
    // Process each section
    Object.keys(corrected).forEach(section => {
      // Skip metadata sections
      if (section.startsWith('_')) return;
      
      // If section doesn't exist in original, it's all new
      if (!original[section]) {
        differences[section] = {
          added: true,
          fields: {}
        };
        
        // All fields in this section are new
        Object.keys(corrected[section]).forEach(field => {
          if (field !== 'confidence' && !field.startsWith('_')) {
            differences[section].fields[field] = {
              type: 'added',
              original: null,
              corrected: corrected[section][field]
            };
          }
        });
        
        return;
      }
      
      // Compare fields within existing sections
      differences[section] = {
        fields: {}
      };
      
      // Check fields in corrected data
      Object.keys(corrected[section]).forEach(field => {
        // Skip confidence and metadata
        if (field === 'confidence' || field.startsWith('_')) return;
        
        const originalValue = original[section][field];
        const correctedValue = corrected[section][field];
        
        // Compare values
        if (originalValue === undefined) {
          differences[section].fields[field] = {
            type: 'added',
            original: null,
            corrected: correctedValue
          };
        } else if (JSON.stringify(originalValue) !== JSON.stringify(correctedValue)) {
          differences[section].fields[field] = {
            type: 'modified',
            original: originalValue,
            corrected: correctedValue
          };
        }
      });
      
      // Check for removed fields
      Object.keys(original[section]).forEach(field => {
        // Skip confidence and metadata
        if (field === 'confidence' || field.startsWith('_')) return;
        
        if (corrected[section][field] === undefined) {
          differences[section].fields[field] = {
            type: 'removed',
            original: original[section][field],
            corrected: null
          };
        }
      });
      
      // Remove empty sections
      if (Object.keys(differences[section].fields).length === 0) {
        delete differences[section];
      }
    });
    
    return differences;
  };
  
  /**
   * Count the number of improved fields
   * @param {Object} differences - Calculated differences
   * @returns {Number} - Number of improved fields
   */
  const countFieldImprovements = (differences) => {
    let count = 0;
    
    Object.keys(differences).forEach(section => {
      count += Object.keys(differences[section].fields).length;
    });
    
    return count;
  };
  
  // If no data is available, show a placeholder
  if (!extractionResult || !correctedData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Pattern Training Interface</CardTitle>
          <CardDescription>No extraction data available to train with</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              Import a document first to extract data for training.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pattern Recognition Training</CardTitle>
        <CardDescription>
          Correct extraction errors to improve pattern recognition accuracy
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content Editing</TabsTrigger>
          <TabsTrigger value="diff">
            Differences {showDiff && Object.keys(calculateDifferences(extractionResult, correctedData)).length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {Object.keys(calculateDifferences(extractionResult, correctedData)).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="training">Training Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="documentType">Document Type:</Label>
              <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                <SelectTrigger id="documentType" className="w-[300px]">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Section editors */}
            {Object.keys(correctedData).filter(section => !section.startsWith('_')).map(section => (
              <Collapsible key={section} className="border rounded-md p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CollapsibleTrigger className="flex items-center">
                      <ChevronRight className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <h3 className="text-lg font-medium">{section}</h3>
                    {extractionResult[section]?.confidence && (
                      <Badge variant={extractionResult[section].confidence > 0.7 ? "success" : "warning"}>
                        {Math.floor(extractionResult[section].confidence * 100)}% Confidence
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CollapsibleContent className="mt-2 space-y-2">
                  {correctedData[section] && Object.keys(correctedData[section])
                    .filter(field => field !== 'confidence' && !field.startsWith('_'))
                    .map(field => (
                      <div key={field} className="grid grid-cols-3 gap-2">
                        <Label className="self-center">{field}</Label>
                        <Input 
                          value={correctedData[section][field] || ''}
                          onChange={(e) => handleFieldChange(section, field, e.target.value)}
                          className="col-span-2"
                        />
                      </div>
                    ))}
                  
                  {/* Add new field button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newField = prompt('Enter new field name:');
                      if (newField && newField.trim() !== '') {
                        handleFieldChange(section, newField.trim(), '');
                      }
                    }}
                  >
                    Add Field
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            ))}
            
            {/* Add new section button */}
            <Button 
              variant="outline"
              onClick={() => {
                const newSection = prompt('Enter new section name:');
                if (newSection && newSection.trim() !== '') {
                  setCorrectedData(prev => ({
                    ...prev,
                    [newSection.trim()]: { confidence: 0.7 }
                  }));
                }
              }}
            >
              Add Section
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="diff" className="p-4">
          <div className="space-y-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDiff(!showDiff)}
            >
              {showDiff ? 'Hide All Differences' : 'Show All Differences'}
            </Button>
            
            <div className="space-y-2">
              {showDiff && (
                <>
                  {Object.keys(calculateDifferences(extractionResult, correctedData)).length === 0 ? (
                    <Alert>
                      <Check className="h-4 w-4" />
                      <AlertTitle>No Differences</AlertTitle>
                      <AlertDescription>
                        No differences found between original and corrected data.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    Object.entries(calculateDifferences(extractionResult, correctedData)).map(([section, data]) => (
                      <Card key={section} className="overflow-hidden">
                        <CardHeader className="bg-muted pb-2">
                          <CardTitle className="text-md">
                            {section} {data.added && <Badge>New Section</Badge>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="text-left p-2">Field</th>
                                <th className="text-left p-2">Change</th>
                                <th className="text-left p-2">Original</th>
                                <th className="text-left p-2">Corrected</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(data.fields).map(([field, change]) => (
                                <tr key={field} className="border-t">
                                  <td className="p-2">{field}</td>
                                  <td className="p-2">
                                    <Badge 
                                      variant={
                                        change.type === 'added' ? 'success' : 
                                        change.type === 'modified' ? 'warning' : 
                                        'destructive'
                                      }
                                    >
                                      {change.type}
                                    </Badge>
                                  </td>
                                  <td className="p-2 font-mono text-sm">
                                    {change.original !== null ? JSON.stringify(change.original) : '-'}
                                  </td>
                                  <td className="p-2 font-mono text-sm">
                                    {change.corrected !== null ? JSON.stringify(change.corrected) : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="training" className="p-4">
          <div className="space-y-4">
            {!trainingResult ? (
              <div className="space-y-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Training Ready</AlertTitle>
                  <AlertDescription>
                    Click the button below to submit your corrections for training.
                  </AlertDescription>
                </Alert>
                
                <Button
                  onClick={handleSubmitCorrections}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Submit Corrections for Training
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert variant={trainingResult.success ? "success" : "destructive"}>
                  {trainingResult.success ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {trainingResult.success ? "Training Successful" : "Training Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    {trainingResult.success ? (
                      <>
                        Training ID: <code>{trainingResult.id}</code><br />
                        Document Type: <strong>{trainingResult.documentType}</strong><br />
                        Improved Fields: <strong>{trainingResult.patternImprovements.fieldsImproved}</strong>
                      </>
                    ) : (
                      <>Error: {trainingResult.error}</>
                    )}
                  </AlertDescription>
                </Alert>
                
                {trainingResult.success && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Pattern Improvements</CardTitle>
                      <CardDescription>
                        The system has learned from your corrections
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Sections Improved:</div>
                          <div>{trainingResult.patternImprovements.sections}</div>
                          
                          <div className="font-medium">Fields Improved:</div>
                          <div>{trainingResult.patternImprovements.fieldsImproved}</div>
                          
                          <div className="font-medium">New Confidence:</div>
                          <div>{Math.floor(trainingResult.patternImprovements.confidence * 100)}%</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" onClick={() => setTrainingResult(null)} className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Start New Training
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PatternTrainingInterface;
