"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPromptTemplate } from "@/lib/report-drafting/prompt-templates";
import { getSampleData } from "@/lib/report-drafting/prompt-testing/sample-data";
import { DetailLevel, ReportStyle } from "@/lib/report-drafting/types";
import { toast } from "sonner";

const sectionOptions = [
  { id: 'initial-assessment', label: 'Initial Assessment' },
  { id: 'medical-history', label: 'Medical History' },
  { id: 'symptoms-assessment', label: 'Symptoms Assessment' },
  { id: 'functional-status', label: 'Functional Status' },
  { id: 'typical-day', label: 'Typical Day' },
  { id: 'environmental-assessment', label: 'Environmental Assessment' },
  { id: 'activities-daily-living', label: 'Activities of Daily Living' },
  { id: 'attendant-care', label: 'Attendant Care' }
];

const styleOptions = [
  { id: 'clinical', label: 'Clinical' },
  { id: 'conversational', label: 'Conversational' },
  { id: 'simplified', label: 'Simplified' }
];

const detailOptions = [
  { id: 'brief', label: 'Brief' },
  { id: 'standard', label: 'Standard' },
  { id: 'comprehensive', label: 'Comprehensive' }
];

// Function to highlight sections in the prompt
function highlightSections(text: string) {
  // Highlight main section headers
  let highlighted = text.replace(
    /^(# [A-Z\s]+)$/gm,
    '<div class="text-xl font-bold text-blue-600 mt-4 mb-2">$1</div>'
  );
  
  // Highlight sub-section headers
  highlighted = highlighted.replace(
    /^(## [A-Z\s]+)$/gm,
    '<div class="text-lg font-semibold text-green-600 mt-3 mb-1">$1</div>'
  );
  
  // Highlight lists
  highlighted = highlighted.replace(
    /^(- .+)$/gm,
    '<div class="pl-4 border-l-2 border-gray-300 my-1">$1</div>'
  );
  
  // Convert newlines to <br> for HTML rendering
  highlighted = highlighted.replace(/\n/g, '<br>');
  
  return highlighted;
}

export default function PromptVisualizer() {
  const [section, setSection] = useState<string>(sectionOptions[0].id);
  const [style, setStyle] = useState<ReportStyle>('clinical');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('standard');
  const [prompt, setPrompt] = useState<string>('');
  const [highlightedPrompt, setHighlightedPrompt] = useState<string>('');
  
  // Generate prompt when parameters change
  useEffect(() => {
    generatePrompt();
  }, [section, style, detailLevel]);
  
  const generatePrompt = async () => {
    try {
      // Get sample data for the selected section
      const sampleData = getSampleData(section);
      
      // Generate the prompt
      const generatedPrompt = getPromptTemplate(section, {
        detailLevel,
        style,
        sectionData: sampleData,
        clientName: 'John Smith',
        assessmentDate: '2025-02-25'
      });
      
      setPrompt(generatedPrompt);
      setHighlightedPrompt(highlightSections(generatedPrompt));
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Failed to generate prompt. Please try again.');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prompt Template Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="section-select-viz">Section</Label>
              <Select
                value={section}
                onValueChange={(value) => setSection(value)}
              >
                <SelectTrigger id="section-select-viz">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sectionOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="style-select-viz">Writing Style</Label>
              <Select
                value={style}
                onValueChange={(value) => setStyle(value as ReportStyle)}
              >
                <SelectTrigger id="style-select-viz">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="detail-select-viz">Detail Level</Label>
              <Select
                value={detailLevel}
                onValueChange={(value) => setDetailLevel(value as DetailLevel)}
              >
                <SelectTrigger id="detail-select-viz">
                  <SelectValue placeholder="Select detail level" />
                </SelectTrigger>
                <SelectContent>
                  {detailOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="visual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visual">Visual Format</TabsTrigger>
              <TabsTrigger value="raw">Raw Text</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual">
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-[600px] w-full pr-4">
                    <div 
                      className="p-4 prompt-visualization"
                      dangerouslySetInnerHTML={{ __html: highlightedPrompt }}
                    />
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="raw">
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-[600px] w-full pr-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm p-4">
                      {prompt}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
