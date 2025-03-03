'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import { processPdf, mapToAssessmentContext } from '@/services/pdfProcessingService';
import { initPdfJS } from '@/services/clientPdfService';
import { IntelligentSuggestionService } from '@/services/IntelligentSuggestionService';
import { ContentSuggestion } from '@/services/suggestions/ContentSuggestionService';
import { ValidationResult } from '@/services/validation/CrossSectionValidator';
import { MissingInformation } from '@/services/validation/MissingInformationDetector';

// List of all available sections in the assessment
const availableSections = [
  { id: 'demographics', label: 'Demographics', key: 'demographics' },
  { id: 'medicalHistory', label: 'Medical History', key: 'pastMedicalHistory' },
  { id: 'symptoms', label: 'Symptoms Assessment', key: 'symptoms' },
  { id: 'functionalStatus', label: 'Functional Status', key: 'functionalStatus' },
  { id: 'typicalDay', label: 'Typical Day', key: 'typicalDay' },
  { id: 'environment', label: 'Environmental Assessment', key: 'environment' },
  { id: 'adls', label: 'Activities of Daily Living', key: 'adls' },
  { id: 'attendantCare', label: 'Attendant Care', key: 'attendantCare' },
  { id: 'purpose', label: 'Purpose & Methodology', key: 'purpose' },
];

export interface EnhancedPdfImportComponentProps {
  onComplete?: (data: any) => void;
}

export default function EnhancedPdfImportComponent({ onComplete }: EnhancedPdfImportComponentProps) {
  const { data, updateSection } = useAssessment();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [confidenceScores, setConfidenceScores] = useState<{[key: string]: number}>({});
  const [fieldConfidenceScores, setFieldConfidenceScores] = useState<{[key: string]: {[field: string]: number}}>({});
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('sections');
  
  // Intelligent suggestion states
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [missingInfo, setMissingInfo] = useState<MissingInformation[]>([]);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState<string | null>(null);
  
  // Intelligent suggestion service
  const suggestionService = new IntelligentSuggestionService();
  
  // Initialize PDF.js on component mount (client-side only)
  useEffect(() => {
    initPdfJS();
  }, []);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setExtractedData(null);
      setProgress(0);
      setShowDetails(false);
      setActiveTab('sections');
      setValidationResults([]);
      setContentSuggestions([]);
      setMissingInfo([]);
      setAcceptedSuggestions([]);
    }
  };
  
  const handleProcessPdf = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(10);
    
    try {
      // Read the file as ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
      setProgress(30);
      
      // Process the PDF
      const extractedPdfData = await processPdf(fileBuffer);
      setProgress(50);
      
      // Map to assessment context format
      const contextData = mapToAssessmentContext(extractedPdfData);
      setProgress(70);
      
      // Generate intelligent suggestions
      const suggestions = suggestionService.generateSuggestions(contextData);
      setValidationResults(suggestions.validationResults);
      setContentSuggestions(suggestions.contentSuggestions);
      setMissingInfo(suggestions.missingInformation);
      
      setProgress(90);
      
      // Update state with extracted data
      setExtractedData(contextData);
      
      // Set confidence scores from both section detection and field extraction
      setConfidenceScores(contextData.confidence?.sections || {});
      setFieldConfidenceScores(contextData.confidence?.fields || {});
      
      // Set selected sections based on confidence scores
      // Only select sections with moderate to high confidence (> 0.5)
      const highConfidenceSections = Object.entries(contextData.confidence?.sections || {})
        .filter(([_, score]) => score > 0.5)
        .map(([section]) => section.toLowerCase());
      
      // Match the detected sections to our available sections
      const matchedSections = availableSections
        .filter(section => highConfidenceSections.includes(section.id.toLowerCase()))
        .map(section => section.id);
      
      setSelectedSections(matchedSections);
      
      setProgress(100);
      
      // Set the active tab to suggestions if there are any
      if (suggestions.contentSuggestions.length > 0 || 
          suggestions.validationResults.length > 0 || 
          suggestions.missingInformation.length > 0) {
        setActiveTab('suggestions');
      }
      
      toast({
        title: "PDF Processed Successfully",
        description: `Data extracted with ${suggestions.contentSuggestions.length} suggestions available.`,
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast({
        title: "PDF Processing Failed",
        description: "There was an error processing the PDF. Please try again with a different file.",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  const handleImportData = () => {
    if (!extractedData) return;
    
    try {
      // Apply accepted suggestions to the data
      let dataToImport = extractedData;
      if (acceptedSuggestions.length > 0) {
        dataToImport = suggestionService.applySuggestions(extractedData, acceptedSuggestions);
      }
      
      // Update the assessment context with the selected sections
      selectedSections.forEach(sectionId => {
        const section = availableSections.find(s => s.id === sectionId);
        if (section && dataToImport[section.key]) {
          updateSection(section.key, dataToImport[section.key]);
        }
      });
      
      toast({
        title: "Data Imported Successfully",
        description: `${selectedSections.length} sections imported with ${acceptedSuggestions.length} suggestions applied.`,
      });
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(dataToImport);
      }
      
      // Reset the state
      setFile(null);
      setExtractedData(null);
      setSelectedSections([]);
      setProgress(0);
      setShowDetails(false);
      setValidationResults([]);
      setContentSuggestions([]);
      setMissingInfo([]);
      setAcceptedSuggestions([]);
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the data. Please try again.",
        variant: "destructive",
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
  
  const handleRejectSuggestion = (suggestionId: string) => {
    // For UI purposes, we might want to track rejected suggestions
    toast({
      title: "Suggestion Rejected",
      description: "This suggestion will not be applied.",
    });
  };
  
  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-blue-100 text-blue-800';
    if (confidence >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const renderConfidenceBadge = (sectionId: string) => {
    const confidence = confidenceScores[sectionId] || 0;
    const color = getConfidenceBadgeColor(confidence);
    
    return (
      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${color}`}>
        {Math.round(confidence * 100)}% match
      </span>
    );
  };
  
  const renderFieldConfidence = (sectionId: string, field: string, confidence: number) => {
    const color = getConfidenceBadgeColor(confidence);
    
    return (
      <span className={`ml-1 px-1 py-0.5 rounded text-xs font-medium ${color}`}>
        {Math.round(confidence * 100)}%
      </span>
    );
  };
  
  const renderSectionPreview = (sectionId: string) => {
    const section = availableSections.find(s => s.id === sectionId);
    if (!section || !extractedData || !extractedData[section.key]) return null;
    
    const sectionData = extractedData[section.key];
    const sectionFieldConfidence = fieldConfidenceScores[sectionId] || {};
    
    switch (sectionId) {
      case 'demographics':
        return (
          <div className="mt-2 text-sm">
            {sectionData.personalInfo && (
              <>
                {sectionData.personalInfo.firstName && sectionData.personalInfo.lastName && (
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span> {sectionData.personalInfo.firstName} {sectionData.personalInfo.lastName}
                    {sectionFieldConfidence.name && renderFieldConfidence(sectionId, 'name', sectionFieldConfidence.name)}
                  </p>
                )}
                {sectionData.personalInfo.dateOfBirth && (
                  <p className="text-gray-700">
                    <span className="font-medium">DOB:</span> {sectionData.personalInfo.dateOfBirth}
                    {sectionFieldConfidence.dob && renderFieldConfidence(sectionId, 'dob', sectionFieldConfidence.dob)}
                  </p>
                )}
                {sectionData.personalInfo.gender && (
                  <p className="text-gray-700">
                    <span className="font-medium">Gender:</span> {sectionData.personalInfo.gender}
                    {sectionFieldConfidence.gender && renderFieldConfidence(sectionId, 'gender', sectionFieldConfidence.gender)}
                  </p>
                )}
                {sectionData.personalInfo.address && (
                  <p className="text-gray-700">
                    <span className="font-medium">Address:</span> {sectionData.personalInfo.address}
                    {sectionFieldConfidence.address && renderFieldConfidence(sectionId, 'address', sectionFieldConfidence.address)}
                  </p>
                )}
              </>
            )}
          </div>
        );
      
      case 'medicalHistory':
        return (
          <div className="mt-2 text-sm">
            {sectionData.primaryDiagnosis && (
              <p className="text-gray-700">
                <span className="font-medium">Primary Diagnosis:</span> {sectionData.primaryDiagnosis}
                {sectionFieldConfidence.primaryDiagnosis && renderFieldConfidence(sectionId, 'primaryDiagnosis', sectionFieldConfidence.primaryDiagnosis)}
              </p>
            )}
            {sectionData.conditions && sectionData.conditions.length > 0 && (
              <div className="mt-1">
                <span className="font-medium">Conditions:</span> 
                {sectionFieldConfidence.conditions && renderFieldConfidence(sectionId, 'conditions', sectionFieldConfidence.conditions)}
                <ul className="list-disc pl-5 mt-1">
                  {sectionData.conditions.slice(0, 3).map((condition: any, index: number) => (
                    <li key={index} className="text-gray-700">{typeof condition === 'string' ? condition : condition.condition}</li>
                  ))}
                  {sectionData.conditions.length > 3 && <li className="text-gray-500 italic">...and {sectionData.conditions.length - 3} more</li>}
                </ul>
              </div>
            )}
          </div>
        );
      
      // Other section previews follow a similar pattern
      
      default:
        return (
          <div className="mt-2 text-sm text-gray-500 italic">
            Preview not available for this section.
          </div>
        );
    }
  };
