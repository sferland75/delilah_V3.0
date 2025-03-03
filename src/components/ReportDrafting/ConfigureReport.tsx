"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useReportDraftingContext } from "@/contexts/ReportDrafting/ReportDraftingContext";
import { Input } from "@/components/ui/input";
import { SectionConfiguration, DetailLevel, ReportStyle } from "@/lib/report-drafting/types";
import { AlertCircle } from "lucide-react";
import { sectionMetadata } from "@/lib/report-drafting/templates";

interface SectionConfigProps {
  id: string;
  title: string;
  description: string;
  isIncluded: boolean;
  detailLevel: DetailLevel;
  completeness: { status: string; percentage: number };
  onIncludedChange: (id: string, included: boolean) => void;
  onDetailLevelChange: (id: string, level: DetailLevel) => void;
}

const SectionConfig = ({ 
  id, 
  title, 
  description, 
  isIncluded, 
  detailLevel,
  completeness,
  onIncludedChange, 
  onDetailLevelChange 
}: SectionConfigProps) => {
  const hasData = completeness.percentage > 0;
  const isComplete = completeness.status === 'complete';

  return (
    <Card className={`border ${!hasData ? 'bg-gray-50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`include-${id}`} 
              checked={isIncluded}
              disabled={!hasData}
              onCheckedChange={(checked) => onIncludedChange(id, checked as boolean)}
            />
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          {!hasData ? (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              No data available
            </span>
          ) : !isComplete ? (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded">
              {completeness.percentage}% complete
            </span>
          ) : (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
              Complete
            </span>
          )}
        </div>
      </CardHeader>
      {isIncluded && hasData && (
        <CardContent>
          <div className="pl-6">
            <h4 className="text-sm font-medium mb-2">Detail Level</h4>
            <RadioGroup 
              value={detailLevel} 
              onValueChange={(value) => onDetailLevelChange(id, value as DetailLevel)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="brief" id={`${id}-brief`} />
                <Label htmlFor={`${id}-brief`} className="text-sm">Brief</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id={`${id}-standard`} />
                <Label htmlFor={`${id}-standard`} className="text-sm">Standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comprehensive" id={`${id}-comprehensive`} />
                <Label htmlFor={`${id}-comprehensive`} className="text-sm">Comprehensive</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function ConfigureReport() {
  const { 
    selectedTemplate, 
    dataAvailability, 
    isLoading, 
    error, 
    createReportConfig,
    generateReportFromConfig,
    goToNextStep,
    goToPreviousStep
  } = useReportDraftingContext();

  const [reportTitle, setReportTitle] = useState<string>("");
  const [reportStyle, setReportStyle] = useState<ReportStyle>("clinical");
  const [sections, setSections] = useState<SectionConfiguration[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Initialize from selected template when component mounts or template changes
  useEffect(() => {
    if (selectedTemplate) {
      setReportTitle(selectedTemplate.defaultTitle || 'Assessment Report');
      setReportStyle(selectedTemplate.defaultStyle || 'clinical');
      
      // Ensure the sections have the right format
      if (selectedTemplate.defaultSections) {
        setSections(selectedTemplate.defaultSections.map(section => ({
          id: section.id,
          title: section.title || getSectionTitle(section.id),
          detailLevel: section.detailLevel || 'standard',
          included: section.included !== undefined ? section.included : true
        })));
      }
    }
  }, [selectedTemplate]);

  // Helper function to get section title
  const getSectionTitle = (sectionId: string): string => {
    const meta = sectionMetadata[sectionId as keyof typeof sectionMetadata];
    return meta ? meta.title : sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const handleSectionIncludeChange = (sectionId: string, included: boolean) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId ? { ...section, included } : section
      )
    );
  };

  const handleDetailLevelChange = (sectionId: string, detailLevel: DetailLevel) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId ? { ...section, detailLevel } : section
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    try {
      console.log("Configuring report with sections:", sections);
      
      // First create the report configuration
      const config = await createReportConfig(
        selectedTemplate.id,
        sections,
        reportStyle,
        reportTitle
      );
      
      if (config) {
        console.log("Report configuration created:", config);
        
        // Then generate the report from the configuration
        const report = await generateReportFromConfig();
        
        if (report) {
          console.log("Report generated successfully:", report);
          // Move to the next step (preview) only if we have a generated report
          goToNextStep();
        } else {
          console.error("Failed to generate report: No report returned");
        }
      } else {
        console.error("Failed to create report configuration");
      }
    } catch (error) {
      console.error("Error configuring or generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading || isGenerating) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600 mr-2"></div>
        <span>{isGenerating ? "Generating report..." : "Loading configuration..."}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium">Error configuring report</h3>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={goToPreviousStep}
          >
            Back to Template Selection
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
        <h3 className="font-medium">No template selected</h3>
        <p className="text-sm mt-1">Please select a template first.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={goToPreviousStep}
        >
          Back to Template Selection
        </Button>
      </div>
    );
  }

  // Group sections by category
  const assessmentSections = sections.filter(s => {
    const meta = sectionMetadata[s.id as keyof typeof sectionMetadata];
    return meta && meta.category === 'assessment';
  });

  const functionalSections = sections.filter(s => {
    const meta = sectionMetadata[s.id as keyof typeof sectionMetadata];
    return meta && meta.category === 'functional';
  });

  // If no sections are categorized, use all sections
  const uncategorizedSections = sections.filter(s => {
    const meta = sectionMetadata[s.id as keyof typeof sectionMetadata];
    return !meta || (!meta.category);
  });

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Configure Your Report</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Customize the report title, style, and sections to include.
      </p>
      
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="report-title" className="text-base font-medium block mb-2">Report Title</Label>
          <Input 
            id="report-title" 
            value={reportTitle} 
            onChange={(e) => setReportTitle(e.target.value)} 
            className="max-w-md"
          />
        </div>
        
        <div>
          <h4 className="text-base font-medium mb-2">Report Style</h4>
          <RadioGroup 
            value={reportStyle} 
            onValueChange={(value) => setReportStyle(value as ReportStyle)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="clinical" id="style-clinical" />
              <Label htmlFor="style-clinical">Clinical</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="conversational" id="style-conversational" />
              <Label htmlFor="style-conversational">Conversational</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="simplified" id="style-simplified" />
              <Label htmlFor="style-simplified">Simplified</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <h4 className="text-base font-medium mb-2">Report Sections</h4>
        <Accordion type="multiple" defaultValue={["assessment-sections", "functional-sections", "uncategorized-sections"]}>
          {assessmentSections.length > 0 && (
            <AccordionItem value="assessment-sections">
              <AccordionTrigger>Assessment Sections</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 mt-2">
                  {assessmentSections.map(section => {
                    const meta = sectionMetadata[section.id as keyof typeof sectionMetadata];
                    if (!meta) return null;
                    
                    return (
                      <SectionConfig
                        key={section.id}
                        id={section.id}
                        title={meta.title}
                        description={meta.description}
                        isIncluded={section.included}
                        detailLevel={section.detailLevel}
                        completeness={dataAvailability[section.id] || { status: 'incomplete', percentage: 0 }}
                        onIncludedChange={handleSectionIncludeChange}
                        onDetailLevelChange={handleDetailLevelChange}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {functionalSections.length > 0 && (
            <AccordionItem value="functional-sections">
              <AccordionTrigger>Functional & Environmental Sections</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 mt-2">
                  {functionalSections.map(section => {
                    const meta = sectionMetadata[section.id as keyof typeof sectionMetadata];
                    if (!meta) return null;
                    
                    return (
                      <SectionConfig
                        key={section.id}
                        id={section.id}
                        title={meta.title}
                        description={meta.description}
                        isIncluded={section.included}
                        detailLevel={section.detailLevel}
                        completeness={dataAvailability[section.id] || { status: 'incomplete', percentage: 0 }}
                        onIncludedChange={handleSectionIncludeChange}
                        onDetailLevelChange={handleDetailLevelChange}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {uncategorizedSections.length > 0 && (
            <AccordionItem value="uncategorized-sections">
              <AccordionTrigger>Additional Sections</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 mt-2">
                  {uncategorizedSections.map(section => {
                    return (
                      <SectionConfig
                        key={section.id}
                        id={section.id}
                        title={section.title || section.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        description={`Content for ${section.id}`}
                        isIncluded={section.included}
                        detailLevel={section.detailLevel}
                        completeness={dataAvailability[section.id] || { status: 'complete', percentage: 100 }}
                        onIncludedChange={handleSectionIncludeChange}
                        onDetailLevelChange={handleDetailLevelChange}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={sections.filter(s => s.included).length === 0 || isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </div>
    </div>
  );
}
