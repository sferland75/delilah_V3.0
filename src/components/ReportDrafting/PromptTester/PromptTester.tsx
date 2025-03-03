"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { testPrompt, TestResult } from "@/lib/report-drafting/prompt-testing/test-runner";
import { DetailLevel, ReportStyle } from "@/lib/report-drafting/types";
import { toast } from "sonner";
import { PlayIcon, CheckCircle, XCircle, Info } from "lucide-react";

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

export default function PromptTester() {
  const [section, setSection] = useState<string>(sectionOptions[0].id);
  const [style, setStyle] = useState<ReportStyle>('clinical');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('standard');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  
  const runTest = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const testResult = await testPrompt(section, detailLevel, style);
      setResult(testResult);
      
      if (testResult.success) {
        toast.success(`Test passed with score ${testResult.score}/10`);
      } else {
        toast.error(`Test failed with score ${testResult.score}/10`);
      }
    } catch (error) {
      console.error('Error running prompt test:', error);
      toast.error('Failed to run prompt test');
    } finally {
      setTesting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prompt Test Runner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="section-select-test">Section</Label>
              <Select
                value={section}
                onValueChange={(value) => setSection(value)}
              >
                <SelectTrigger id="section-select-test">
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
              <Label htmlFor="style-select-test">Writing Style</Label>
              <Select
                value={style}
                onValueChange={(value) => setStyle(value as ReportStyle)}
              >
                <SelectTrigger id="style-select-test">
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
              <Label htmlFor="detail-select-test">Detail Level</Label>
              <Select
                value={detailLevel}
                onValueChange={(value) => setDetailLevel(value as DetailLevel)}
              >
                <SelectTrigger id="detail-select-test">
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
          
          <Button 
            onClick={runTest} 
            disabled={testing} 
            className="w-full"
            size="lg"
          >
            <PlayIcon className="mr-2 h-4 w-4" />
            {testing ? 'Running Test...' : 'Run Prompt Test'}
          </Button>
          
          {testing && (
            <div className="mt-6">
              <Label>Testing in progress...</Label>
              <Progress value={45} className="mt-2" />
            </div>
          )}
          
          {result && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Test Results</h3>
                <div className="flex items-center">
                  {result.success ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <Badge variant="success">PASS</Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <Badge variant="destructive">FAIL</Badge>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Quality Score</Label>
                  <div className="mt-1 flex items-center">
                    <Progress value={result.score * 10} className="flex-1 mr-2" />
                    <span className="text-sm font-medium">{result.score}/10</span>
                  </div>
                </div>
                
                <div>
                  <Label>Metrics</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-sm">Prompt Length: <span className="font-medium">{result.promptLength} chars</span></div>
                    <div className="text-sm">Response Length: <span className="font-medium">{result.responseLength} chars</span></div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Issues Found
                </Label>
                <ScrollArea className="h-32 w-full mt-2 border rounded-md">
                  <div className="p-4">
                    {result.issues.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No issues found</p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {result.issues.map((issue, index) => (
                          <li key={index} className="flex items-start">
                            <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </ScrollArea>
              </div>
              
              <Separator />
              
              <div>
                <Label>Generated Response Preview</Label>
                <ScrollArea className="h-[300px] w-full mt-2 border rounded-md">
                  <div className="p-4">
                    <pre className="whitespace-pre-wrap text-sm">{result.response}</pre>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-gray-500">
            Note: Running a test will generate a prompt using the selected parameters,
            send it to Claude 3.7 Sonnet, and evaluate the response for quality and adherence
            to professional standards.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
