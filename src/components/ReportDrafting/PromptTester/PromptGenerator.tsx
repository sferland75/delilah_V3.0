"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, RefreshCw } from "lucide-react";
import { getPromptTemplate } from "@/lib/report-drafting/prompt-templates";
import { getSampleData } from "@/lib/report-drafting/prompt-testing/sample-data";
import { DetailLevel, ReportStyle } from "@/lib/report-drafting/types";
import { Separator } from "@/components/ui/separator";
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

export default function PromptGenerator() {
  const [section, setSection] = useState<string>(sectionOptions[0].id);
  const [style, setStyle] = useState<ReportStyle>('clinical');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('standard');
  const [prompt, setPrompt] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate prompt when parameters change
  useEffect(() => {
    generatePrompt();
  }, [section, style, detailLevel]);

  const generatePrompt = async () => {
    try {
      setGenerating(true);
      
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
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Failed to generate prompt. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt).then(
      () => {
        setCopied(true);
        toast.success('Prompt copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        toast.error('Failed to copy prompt');
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prompt Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="section-select">Section</Label>
              <Select
                value={section}
                onValueChange={(value) => setSection(value)}
              >
                <SelectTrigger id="section-select">
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
              <Label htmlFor="style-select">Writing Style</Label>
              <Select
                value={style}
                onValueChange={(value) => setStyle(value as ReportStyle)}
              >
                <SelectTrigger id="style-select">
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
              <Label htmlFor="detail-select">Detail Level</Label>
              <Select
                value={detailLevel}
                onValueChange={(value) => setDetailLevel(value as DetailLevel)}
              >
                <SelectTrigger id="detail-select">
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

          <Separator className="my-6" />
          
          <div>
            <Label htmlFor="prompt-output">Generated Prompt</Label>
            <div className="relative mt-2">
              <Textarea
                id="prompt-output"
                value={prompt}
                readOnly
                className="h-[500px] font-mono text-sm"
              />
              {generating && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={generatePrompt} disabled={generating}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button onClick={copyToClipboard} disabled={generating || !prompt}>
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied' : 'Copy to Clipboard'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
