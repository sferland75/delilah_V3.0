"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReportDraftingContext } from "@/contexts/ReportDrafting/ReportDraftingContext";
import { ReportTemplate } from "@/lib/report-drafting/types";
import { AlertCircle } from "lucide-react";

interface TemplateCardProps {
  template: ReportTemplate;
  isSelected: boolean;
  onClick: () => void;
}

const TemplateCard = ({ template, isSelected, onClick }: TemplateCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected ? "border-2 border-blue-600 shadow-md" : "border hover:border-blue-400"
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Template preview or icon could go here */}
        <div className="h-32 bg-slate-100 flex items-center justify-center rounded">
          <span className="text-slate-400">Template Preview</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm">Preview</Button>
        {isSelected && <div className="text-blue-600 font-medium">Selected</div>}
      </CardFooter>
    </Card>
  );
};

export default function TemplateSelection() {
  const { 
    templates, 
    selectedTemplate, 
    isLoading, 
    error, 
    loadTemplates, 
    selectTemplate, 
    goToNextStep 
  } = useReportDraftingContext();

  useEffect(() => {
    // Load templates when component mounts
    if (templates.length === 0) {
      loadTemplates();
    }
  }, [loadTemplates, templates.length]);

  const handleTemplateSelect = async (templateId: string) => {
    await selectTemplate(templateId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600 mr-2"></div>
        <span>Loading templates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium">Error loading templates</h3>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => loadTemplates()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
        <h3 className="font-medium">No templates available</h3>
        <p className="text-sm mt-1">No report templates were found. Please check your connection and try again.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => loadTemplates()}
        >
          Refresh Templates
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Select a Report Template</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Choose a template that best fits your reporting needs. You'll be able to customize it in the next step.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onClick={() => handleTemplateSelect(template.id)}
          />
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          variant="default"
          disabled={!selectedTemplate}
          onClick={goToNextStep}
        >
          Next: Configure Report
        </Button>
      </div>
    </div>
  );
}
