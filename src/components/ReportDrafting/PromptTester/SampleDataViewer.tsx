"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { getSampleData } from "@/lib/report-drafting/prompt-testing/sample-data";
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

export default function SampleDataViewer() {
  const [section, setSection] = useState<string>(sectionOptions[0].id);
  const [sampleData, setSampleData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Get sample data for the selected section
    const data = getSampleData(section);
    setSampleData(data);
  }, [section]);
  
  const copyToClipboard = () => {
    const textToCopy = JSON.stringify(sampleData, null, 2);
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopied(true);
        toast.success('Sample data copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        toast.error('Failed to copy sample data');
      }
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sample Data Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="section-select-data">Section</Label>
            <Select
              value={section}
              onValueChange={(value) => setSection(value)}
            >
              <SelectTrigger id="section-select-data">
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
          
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              disabled={!sampleData}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copied' : 'Copy JSON'}
            </Button>
          </div>
          
          <Tabs defaultValue="formatted" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="formatted">Formatted View</TabsTrigger>
              <TabsTrigger value="raw">Raw JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="formatted">
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-[500px] w-full pr-4">
                    {sampleData && (
                      <div className="space-y-4 p-2">
                        {Object.entries(sampleData).map(([key, value]) => (
                          <div key={key} className="border p-3 rounded-md">
                            <h3 className="font-medium text-blue-600">{key}</h3>
                            <div className="text-sm mt-1">
                              {typeof value === 'object' ? (
                                <pre className="bg-slate-50 p-2 rounded text-xs overflow-auto">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              ) : (
                                <span className="font-mono">{String(value)}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="raw">
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-[500px] w-full pr-4">
                    <pre className="font-mono text-xs p-4 whitespace-pre-wrap">
                      {sampleData ? JSON.stringify(sampleData, null, 2) : 'No data available'}
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
