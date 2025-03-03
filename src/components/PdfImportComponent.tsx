'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAssessment } from '@/contexts/AssessmentContext';
import { processPdf, mapToAssessmentContext } from '@/services/pdfProcessingService';
import { initPdfJS } from '@/services/clientPdfService';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

// Interface for component props
interface PdfImportComponentProps {
  onDataExtracted?: (data: any, selectedSections: string[]) => void;
}

export default function PdfImportComponent({ onDataExtracted }: PdfImportComponentProps = {}) {
  const { data, updateSection } = useAssessment();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [extractionFailed, setExtractionFailed] = useState(false);
  const [extractionFailureReason, setExtractionFailureReason] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [confidenceScores, setConfidenceScores] = useState<{[key: string]: number}>({});
  const [fieldConfidenceScores, setFieldConfidenceScores] = useState<{[key: string]: {[field: string]: number}}>({});
  const [showDetails, setShowDetails] = useState(false);
  const [rawPdfText, setRawPdfText] = useState<string>('');
  
  // Initialize PDF.js on component mount (client-side only)
  useEffect(() => {
    initPdfJS();
  }, []);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setExtractedData(null);
      setExtractionFailed(false);
      setExtractionFailureReason('');
      setRawPdfText('');
      setProgress(0);
      setShowDetails(false);
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
      setProgress(70);
      
      // Check if extraction failed completely
      if (extractedPdfData._extractionFailed) {
        console.error("PDF Import - Extraction completely failed:", extractedPdfData._reason);
        setExtractionFailed(true);
        setExtractionFailureReason(extractedPdfData._reason || 'Unable to extract data from this document format');
        setProgress(100);
        
        toast({
          title: "PDF Processing Issue",
          description: "Could not extract structured data from this document. Please try a different format.",
          variant: "destructive",
        });
        
        setIsProcessing(false);
        return;
      }
      
      // Map to assessment context format
      const contextData = mapToAssessmentContext(extractedPdfData);
      setProgress(90);
      
      // Check if mapping failed
      if (contextData._extractionFailed) {
        console.error("PDF Import - Mapping failed:", contextData._reason);
        setExtractionFailed(true);
        setExtractionFailureReason(contextData._reason || 'Unable to process extracted data');
        setProgress(100);
        
        toast({
          title: "PDF Processing Issue",
          description: "Could not process the extracted data. Please try a different document.",
          variant: "destructive",
        });
        
        setIsProcessing(false);
        return;
      }
      
      // Log the extraction results for debugging
      console.log("PDF Import - Raw extracted data:", extractedPdfData);
      console.log("PDF Import - Mapped context data:", contextData);
      
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
      
      console.log("PDF Import - Sections with confidence > 0.5:", highConfidenceSections);
      
      // Match the detected sections to our available sections
      const matchedSections = availableSections
        .filter(section => highConfidenceSections.includes(section.id.toLowerCase()))
        .map(section => section.id);
      
      setSelectedSections(matchedSections);
      
      setProgress(100);
      
      toast({
        title: "PDF Processed Successfully",
        description: `Data extracted from ${file.name}. Please review and select sections to import.`,
      });
      
      // Call the callback function if provided
      if (onDataExtracted) {
        onDataExtracted(contextData, matchedSections);
      }
    } catch (error) {
      console.error("PDF Import - Error processing PDF:", error);
      setExtractionFailed(true);
      setExtractionFailureReason(error.message || 'An unknown error occurred');
      
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
      // Log the selected sections and data being imported
      console.log("PDF Import - Importing sections:", selectedSections);
      console.log("PDF Import - Data being imported:", extractedData);
      
      // Update the assessment context with the selected sections
      selectedSections.forEach(sectionId => {
        const section = availableSections.find(s => s.id === sectionId);
        if (section && extractedData[section.key]) {
          console.log(`PDF Import - Importing ${section.id} to ${section.key}:`, extractedData[section.key]);
          updateSection(section.key, extractedData[section.key]);
        } else {
          console.log(`PDF Import - Data not found for section ${sectionId}`);
        }
      });
      
      toast({
        title: "Data Imported Successfully",
        description: `${selectedSections.length} sections were imported into the assessment.`,
      });
      
      // Reset the state
      setFile(null);
      setExtractedData(null);
      setSelectedSections([]);
      setProgress(0);
      setShowDetails(false);
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the data. Please try again.",
        variant: "destructive",
      });
    }
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
      
      case 'symptoms':
        return (
          <div className="mt-2 text-sm">
            {sectionData.physical && sectionData.physical.length > 0 && (
              <div className="mt-1">
                <span className="font-medium">Physical Symptoms:</span>
                {sectionFieldConfidence.reportedSymptoms && renderFieldConfidence(sectionId, 'reportedSymptoms', sectionFieldConfidence.reportedSymptoms)}
                <ul className="list-disc pl-5 mt-1">
                  {sectionData.physical.slice(0, 3).map((symptom: any, index: number) => (
                    <li key={index} className="text-gray-700">{symptom.symptom}</li>
                  ))}
                  {sectionData.physical.length > 3 && <li className="text-gray-500 italic">...and {sectionData.physical.length - 3} more</li>}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'functionalStatus':
        return (
          <div className="mt-2 text-sm">
            {sectionData.mobility && (
              <>
                {sectionData.mobility.ambulation && (
                  <p className="text-gray-700">
                    <span className="font-medium">Mobility Status:</span> {sectionData.mobility.ambulation}
                    {sectionFieldConfidence.mobilityStatus && renderFieldConfidence(sectionId, 'mobilityStatus', sectionFieldConfidence.mobilityStatus)}
                  </p>
                )}
                {sectionData.mobility.limitations && sectionData.mobility.limitations.length > 0 && (
                  <div className="mt-1">
                    <span className="font-medium">Limitations:</span>
                    {sectionFieldConfidence.functionalLimitations && renderFieldConfidence(sectionId, 'functionalLimitations', sectionFieldConfidence.functionalLimitations)}
                    <ul className="list-disc pl-5 mt-1">
                      {sectionData.mobility.limitations.slice(0, 2).map((limitation: string, index: number) => (
                        <li key={index} className="text-gray-700">{limitation}</li>
                      ))}
                      {sectionData.mobility.limitations.length > 2 && <li className="text-gray-500 italic">...and {sectionData.mobility.limitations.length - 2} more</li>}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        );
      
      case 'typicalDay':
        return (
          <div className="mt-2 text-sm">
            {sectionData.morning && sectionData.morning.routines && sectionData.morning.routines.length > 0 && (
              <div>
                <span className="font-medium">Morning Routine:</span>
                {sectionFieldConfidence.morningRoutine && renderFieldConfidence(sectionId, 'morningRoutine', sectionFieldConfidence.morningRoutine)}
                <ul className="list-disc pl-5 mt-1">
                  {sectionData.morning.routines.slice(0, 2).map((routine: string, index: number) => (
                    <li key={index} className="text-gray-700">{routine}</li>
                  ))}
                  {sectionData.morning.routines.length > 2 && <li className="text-gray-500 italic">...and more</li>}
                </ul>
              </div>
            )}
            {sectionData.evening && sectionData.evening.routines && sectionData.evening.routines.length > 0 && (
              <div className="mt-1">
                <span className="font-medium">Evening Routine:</span>
                {sectionFieldConfidence.eveningRoutine && renderFieldConfidence(sectionId, 'eveningRoutine', sectionFieldConfidence.eveningRoutine)}
                <ul className="list-disc pl-5 mt-1">
                  {sectionData.evening.routines.slice(0, 2).map((routine: string, index: number) => (
                    <li key={index} className="text-gray-700">{routine}</li>
                  ))}
                  {sectionData.evening.routines.length > 2 && <li className="text-gray-500 italic">...and more</li>}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'environment':
        return (
          <div className="mt-2 text-sm">
            {sectionData.dwelling && (
              <>
                {sectionData.dwelling.homeType && (
                  <p className="text-gray-700">
                    <span className="font-medium">Home Type:</span> {sectionData.dwelling.homeType}
                    {sectionFieldConfidence.homeType && renderFieldConfidence(sectionId, 'homeType', sectionFieldConfidence.homeType)}
                  </p>
                )}
              </>
            )}
            {sectionData.accessibility && sectionData.accessibility.barriers && sectionData.accessibility.barriers.length > 0 && (
              <div className="mt-1">
                <span className="font-medium">Barriers:</span>
                {sectionFieldConfidence.barriers && renderFieldConfidence(sectionId, 'barriers', sectionFieldConfidence.barriers)}
                <ul className="list-disc pl-5 mt-1">
                  {sectionData.accessibility.barriers.slice(0, 2).map((barrier: string, index: number) => (
                    <li key={index} className="text-gray-700">{barrier}</li>
                  ))}
                  {sectionData.accessibility.barriers.length > 2 && <li className="text-gray-500 italic">...and {sectionData.accessibility.barriers.length - 2} more</li>}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'adls':
        return (
          <div className="mt-2 text-sm">
            {sectionData.basic && (
              <div className="mt-1">
                <span className="font-medium">Basic ADLs:</span>
                <ul className="list-disc pl-5 mt-1">
                  {Object.entries(sectionData.basic).slice(0, 3).map(([adl, details]: [string, any], index: number) => (
                    <li key={index} className="text-gray-700">
                      {adl.charAt(0).toUpperCase() + adl.slice(1)}: {details.level || 'Not specified'}
                    </li>
                  ))}
                  {Object.keys(sectionData.basic).length > 3 && <li className="text-gray-500 italic">...and more</li>}
                </ul>
              </div>
            )}
          </div>
        );
      
      case 'attendantCare':
        return (
          <div className="mt-2 text-sm">
            {sectionData.selfCare && sectionData.selfCare.needs && sectionData.selfCare.needs.length > 0 && (
              <div className="mt-1">
                <span className="font-medium">Self-Care Needs:</span>
                {sectionFieldConfidence.personalCare && renderFieldConfidence(sectionId, 'personalCare', sectionFieldConfidence.personalCare)}
                <ul className="list-disc pl-5 mt-1">
                  {sectionData.selfCare.needs.slice(0, 2).map((need: string, index: number) => (
                    <li key={index} className="text-gray-700">{need}</li>
                  ))}
                  {sectionData.selfCare.needs.length > 2 && <li className="text-gray-500 italic">...and {sectionData.selfCare.needs.length - 2} more</li>}
                </ul>
              </div>
            )}
            {sectionData.selfCare && typeof sectionData.selfCare.hours === 'number' && (
              <p className="text-gray-700 mt-1">
                <span className="font-medium">Hours:</span> {sectionData.selfCare.hours.toFixed(1)} hours/day
              </p>
            )}
          </div>
        );
      
      case 'purpose':
        return (
          <div className="mt-2 text-sm">
            {sectionData.assessmentPurpose && (
              <p className="text-gray-700">
                <span className="font-medium">Purpose:</span> {sectionData.assessmentPurpose}
                {sectionFieldConfidence.assessmentPurpose && renderFieldConfidence(sectionId, 'assessmentPurpose', sectionFieldConfidence.assessmentPurpose)}
              </p>
            )}
          </div>
        );
      
      default:
        return (
          <div className="mt-2 text-sm text-gray-500 italic">
            Preview not available for this section.
          </div>
        );
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Import Data from PDF</CardTitle>
        <CardDescription>
          Upload an OT assessment or medical report to extract relevant information.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {!extractedData && !extractionFailed ? (
            <>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label 
                  htmlFor="pdf-upload" 
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Click to select a PDF file
                </Label>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Processing PDF... This may take a moment.
                  </p>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleProcessPdf} 
                  disabled={!file || isProcessing}
                  className="w-40"
                >
                  Process PDF
                </Button>
              </div>
            </>
          ) : extractionFailed ? (
            <Alert className="bg-red-50 text-red-800 border-red-200">
              <AlertTitle>Unable to Extract Data</AlertTitle>
              <AlertDescription>
                <p className="mb-4">We couldn't extract structured data from this document. The system encountered the following issue:</p>
                <p className="bg-red-100 p-3 rounded-md font-mono text-sm">{extractionFailureReason}</p>
                <div className="mt-4">
                  <h4 className="font-medium">Suggestions:</h4>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    <li>Try a document with a clearer structure and formatting</li>
                    <li>Ensure the PDF has selectable text (not just a scanned image)</li>
                    <li>If using a scanned document, try running OCR first</li>
                    <li>Try a document that follows standard OT assessment format</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={() => {
                      setFile(null);
                      setExtractionFailed(false);
                      setExtractionFailureReason('');
                    }}
                    variant="outline"
                  >
                    Try Another Document
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertTitle>Review Extracted Data</AlertTitle>
                <AlertDescription>
                  <p>Select the sections you want to import into your assessment. Sections with higher confidence scores are more likely to contain accurate data.</p>
                  <Button 
                    variant="link" 
                    className="mt-2 p-0 h-auto text-blue-700"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? 'Hide section details' : 'Show section details'}
                  </Button>
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-3">
                {availableSections.map(section => {
                  // Check if we have data for this section
                  const hasData = extractedData && extractedData[section.key];
                  const sectionId = section.id.toUpperCase();
                  const confidence = confidenceScores[sectionId] || 0;
                  
                  return (
                    <div key={section.id} className={`p-3 rounded-md ${hasData ? 'bg-gray-50' : 'bg-gray-100 opacity-60'}`}>
                      <div className="flex items-center">
                        <Checkbox
                          id={`section-${section.id}`}
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={() => handleSectionToggle(section.id)}
                          disabled={!hasData}
                        />
                        <Label
                          htmlFor={`section-${section.id}`}
                          className="ml-2 font-medium cursor-pointer"
                        >
                          {section.label}
                          {hasData && renderConfidenceBadge(sectionId)}
                        </Label>
                      </div>
                      
                      {!hasData && (
                        <p className="mt-1 ml-6 text-sm text-gray-500">
                          No data detected for this section
                        </p>
                      )}
                      
                      {hasData && showDetails && renderSectionPreview(section.id)}
                      
                      {hasData && confidence < 0.6 && (
                        <p className="mt-1 ml-6 text-sm text-yellow-600">
                          <span className="font-medium">⚠️ Low confidence:</span> This section may require manual review and editing.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {extractedData || extractionFailed ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setExtractedData(null);
                setExtractionFailed(false);
                setExtractionFailureReason('');
                setSelectedSections([]);
                setShowDetails(false);
              }}
            >
              Cancel
            </Button>
            
            {extractedData && !extractionFailed && (
              <Button 
                onClick={handleImportData}
                disabled={selectedSections.length === 0}
                className="w-40"
              >
                Import Selected
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="ml-auto"
          >
            Back
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
