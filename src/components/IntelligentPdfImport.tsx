'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import PdfImportComponent from '@/components/PdfImportComponent';
import { IntelligentSuggestionService } from '@/services/IntelligentSuggestionService';
import { ValidationResult } from '@/services/validation/CrossSectionValidator';
import { ContentSuggestion } from '@/services/suggestions/ContentSuggestionService';
import { MissingInformation } from '@/services/validation/MissingInformationDetector';

export default function IntelligentPdfImport() {
  const { toast } = useToast();
  const { updateSection } = useAssessment();
  
  // State for intelligent suggestions
  const [extractedData, setExtractedData] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [missingInfo, setMissingInfo] = useState<MissingInformation[]>([]);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('import');
  const [sectionsToImport, setSectionsToImport] = useState<string[]>([]);
  
  // Intelligent suggestion service
  const suggestionService = new IntelligentSuggestionService();
  
  const handlePdfProcessed = (data: any, selectedSections: string[]) => {
    setExtractedData(data);
    setSectionsToImport(selectedSections);
    
    // Generate intelligent suggestions
    const suggestions = suggestionService.generateSuggestions(data);
    setValidationResults(suggestions.validationResults);
    setContentSuggestions(suggestions.contentSuggestions);
    setMissingInfo(suggestions.missingInformation);
    
    // If there are suggestions, switch to the suggestions tab
    if (suggestions.contentSuggestions.length > 0 || 
        suggestions.validationResults.length > 0 || 
        suggestions.missingInformation.length > 0) {
      setActiveTab('suggestions');
      
      toast({
        title: "Intelligent Analysis Complete",
        description: `We've analyzed your document and found ${
          suggestions.contentSuggestions.length + 
          suggestions.validationResults.length + 
          suggestions.missingInformation.length
        } items to review.`,
      });
    }
  };
  
  const handleAcceptSuggestion = (suggestionId: string) => {
    setAcceptedSuggestions(prev => [...prev, suggestionId]);
    
    toast({
      title: "Suggestion Accepted",
      description: "This suggestion will be applied when you import the data.",
    });
  };
  
  const handleApplySuggestions = () => {
    if (!extractedData || acceptedSuggestions.length === 0) return;
    
    // Apply accepted suggestions to the data
    const enhancedData = suggestionService.applySuggestions(extractedData, acceptedSuggestions);
    
    // Update the extracted data
    setExtractedData(enhancedData);
    
    // Generate new suggestions based on updated data
    const newSuggestions = suggestionService.generateSuggestions(enhancedData);
    setValidationResults(newSuggestions.validationResults);
    setContentSuggestions(newSuggestions.contentSuggestions);
    setMissingInfo(newSuggestions.missingInformation);
    
    // Clear accepted suggestions
    setAcceptedSuggestions([]);
    
    toast({
      title: "Suggestions Applied",
      description: "The accepted suggestions have been applied to your data.",
    });
  };
  
  const handleImportData = () => {
    if (!extractedData || sectionsToImport.length === 0) return;
    
    // First, apply any remaining accepted suggestions
    if (acceptedSuggestions.length > 0) {
      const finalData = suggestionService.applySuggestions(extractedData, acceptedSuggestions);
      importToAssessment(finalData);
    } else {
      importToAssessment(extractedData);
    }
  };
  
  const importToAssessment = (data: any) => {
    try {
      // Update the assessment context with the selected sections
      // This mapping should match the structure in PdfImportComponent
      const sectionKeyMap: {[key: string]: string} = {
        'demographics': 'demographics',
        'medicalHistory': 'pastMedicalHistory',
        'symptoms': 'symptoms',
        'functionalStatus': 'functionalStatus',
        'typicalDay': 'typicalDay',
        'environment': 'environment',
        'adls': 'adls',
        'attendantCare': 'attendantCare',
        'purpose': 'purpose'
      };
      
      sectionsToImport.forEach(sectionId => {
        const contextKey = sectionKeyMap[sectionId];
        if (contextKey && data[contextKey]) {
          console.log(`Enhanced Import - Importing ${sectionId} to ${contextKey}:`, data[contextKey]);
          updateSection(contextKey, data[contextKey]);
        }
      });
      
      toast({
        title: "Data Imported Successfully",
        description: `${sectionsToImport.length} sections were imported with intelligent enhancements.`,
      });
      
      // Reset state
      setExtractedData(null);
      setSectionsToImport([]);
      setValidationResults([]);
      setContentSuggestions([]);
      setMissingInfo([]);
      setAcceptedSuggestions([]);
      setActiveTab('import');
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the data. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const renderSuggestionList = () => {
    if (contentSuggestions.length === 0 && validationResults.length === 0 && missingInfo.length === 0) {
      return (
        <Alert className="mb-4">
          <AlertTitle>No suggestions available</AlertTitle>
          <AlertDescription>
            No data enhancement suggestions were found for this document.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* Content Suggestions */}
        {contentSuggestions.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Content Suggestions</h3>
            <div className="space-y-3">
              {contentSuggestions.map(suggestion => {
                const isAccepted = acceptedSuggestions.includes(suggestion.id);
                
                return (
                  <div 
                    key={suggestion.id} 
                    className="p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {suggestion.section}
                          </span>
                          <Badge className="ml-2" variant="outline">
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </Badge>
                          <Badge className="ml-2" variant={suggestion.source === 'relationship' ? 'default' : 'secondary'}>
                            {suggestion.source === 'pattern' ? 'Pattern' : 
                             suggestion.source === 'relationship' ? 'Data Relationship' : 'Domain Knowledge'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {suggestion.reason}
                        </p>
                        
                        <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm bg-gray-50 p-2 rounded">
                          <div>
                            <p className="font-medium text-gray-500">Current Value</p>
                            <p className="text-gray-700">
                              {Array.isArray(suggestion.currentValue) 
                                ? suggestion.currentValue.join(', ') || 'None'
                                : (suggestion.currentValue || 'None')}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Suggested Value</p>
                            <p className="text-gray-700">
                              {Array.isArray(suggestion.suggestedValue) 
                                ? suggestion.suggestedValue.join(', ')
                                : suggestion.suggestedValue}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {isAccepted ? (
                          <Badge className="bg-green-100 text-green-800 h-8">
                            Accepted
                          </Badge>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleAcceptSuggestion(suggestion.id)}
                          >
                            Accept
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Apply Suggestions Button */}
        {acceptedSuggestions.length > 0 && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleApplySuggestions}>
              Apply {acceptedSuggestions.length} Suggestion{acceptedSuggestions.length !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
        
        {/* Validation Issues */}
        {validationResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Data Validation Issues</h3>
            <div className="space-y-3">
              {validationResults.map((validation, index) => {
                const severityColor = 
                  validation.severity === 'high' ? 'text-red-700 bg-red-50 border-red-200' :
                  validation.severity === 'medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  'text-yellow-700 bg-yellow-50 border-yellow-200';
                
                return (
                  <div 
                    key={`validation-${index}`} 
                    className={`p-3 border rounded-md ${severityColor}`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">
                        {validation.section}
                      </span>
                      <Badge className="ml-2" variant={
                        validation.severity === 'high' ? 'destructive' :
                        validation.severity === 'medium' ? 'default' : 'outline'
                      }>
                        {validation.severity} severity
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">
                      {validation.message}
                    </p>
                    {validation.suggestedFix && (
                      <div className="mt-2 flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptSuggestion(validation.section + '-' + (validation.field || ''))}
                        >
                          Apply Fix
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Missing Information */}
        {missingInfo.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Missing Information</h3>
            <div className="space-y-3">
              {missingInfo.map((missing, index) => {
                const importanceColor = 
                  missing.importance === 'high' ? 'text-red-700 bg-red-50 border-red-200' :
                  missing.importance === 'medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  'text-yellow-700 bg-yellow-50 border-yellow-200';
                
                return (
                  <div 
                    key={`missing-${index}`} 
                    className={`p-3 border rounded-md ${importanceColor}`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">
                        {missing.section}
                        {missing.field && `: ${missing.field}`}
                      </span>
                      <Badge className="ml-2" variant={
                        missing.importance === 'high' ? 'destructive' :
                        missing.importance === 'medium' ? 'default' : 'outline'
                      }>
                        {missing.importance} importance
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">
                      {missing.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDataPreview = () => {
    if (!extractedData) return null;

    const sectionsToShow = Object.keys(extractedData)
      .filter(key => key !== 'confidence')
      .sort();

    return (
      <div className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle>Ready to Import</AlertTitle>
          <AlertDescription>
            The following data will be imported. Any accepted suggestions have been applied.
          </AlertDescription>
        </Alert>

        <div className="mt-4">
          {sectionsToShow.map(sectionKey => {
            // Find if this section is in our import list
            const isSelected = sectionsToImport.some(s => {
              const sectionKeyMap: {[key: string]: string} = {
                'demographics': 'demographics',
                'medicalHistory': 'pastMedicalHistory',
                'symptoms': 'symptoms',
                'functionalStatus': 'functionalStatus',
                'typicalDay': 'typicalDay',
                'environment': 'environment',
                'adls': 'adls',
                'attendantCare': 'attendantCare',
                'purpose': 'purpose'
              };
              return sectionKeyMap[s] === sectionKey;
            });

            if (!isSelected) return null;

            return (
              <div key={sectionKey} className="mb-6">
                <h3 className="text-lg font-medium border-b pb-2 mb-2">
                  {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
                </h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md overflow-auto max-h-40">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(extractedData[sectionKey], null, 2)}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleImportData}
            className="w-40"
          >
            Import Data
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Intelligent PDF Import</CardTitle>
        <CardDescription>
          Import assessment data with intelligent validation and suggestions.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="import">Import Document</TabsTrigger>
            <TabsTrigger value="suggestions">
              Suggestions
              {(contentSuggestions.length > 0 || validationResults.length > 0 || missingInfo.length > 0) && (
                <Badge className="ml-2" variant="secondary">
                  {contentSuggestions.length + validationResults.length + missingInfo.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!extractedData}>
              Preview Import
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="import">
            {/* Custom PDF Import Component with callback */}
            <PdfImportComponent 
              onDataExtracted={handlePdfProcessed}
            />
          </TabsContent>
          
          <TabsContent value="suggestions">
            {renderSuggestionList()}
          </TabsContent>
          
          <TabsContent value="preview">
            {renderDataPreview()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
