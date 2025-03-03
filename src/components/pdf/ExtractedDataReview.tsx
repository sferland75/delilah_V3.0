'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SectionData {
  [key: string]: {
    value: string;
    confidence: number;
    source?: string;
  };
}

interface ExtractedData {
  demographics?: SectionData;
  medicalHistory?: SectionData;
  symptoms?: SectionData;
  functionalStatus?: SectionData;
  [key: string]: SectionData | undefined;
}

interface ExtractedDataReviewProps {
  data: ExtractedData;
}

export function ExtractedDataReview({ data }: ExtractedDataReviewProps) {
  const [editedData, setEditedData] = useState<ExtractedData>(data);
  
  const handleDataChange = (section: string, field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section]?.[field],
          value
        }
      }
    }));
  };
  
  // Function to get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-emerald-500';
    if (confidence >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Function to get confidence label
  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'High';
    if (confidence >= 70) return 'Good';
    if (confidence >= 50) return 'Medium';
    return 'Low';
  };
  
  // Get all sections
  const sections = Object.keys(data);
  
  return (
    <div className="w-full">
      <Tabs defaultValue={sections[0]} className="w-full">
        <TabsList className="w-full">
          {sections.map(section => (
            <TabsTrigger 
              key={section} 
              value={section}
              className="flex-1"
            >
              {section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {sections.map(section => (
          <TabsContent key={section} value={section}>
            <ScrollArea className="h-96">
              <div className="space-y-4 p-2">
                {Object.entries(data[section] || {}).map(([field, fieldData]) => (
                  <Card key={field}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor={`${section}-${field}`} className="font-medium">
                          {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Badge 
                          variant="outline"
                          className={`${getConfidenceColor(fieldData.confidence)} text-white`}
                        >
                          {getConfidenceLabel(fieldData.confidence)} ({fieldData.confidence}%)
                        </Badge>
                      </div>
                      
                      <Input
                        id={`${section}-${field}`}
                        value={editedData[section]?.[field]?.value || ''}
                        onChange={(e) => handleDataChange(section, field, e.target.value)}
                        className={fieldData.confidence < 70 ? 'border-amber-500' : ''}
                      />
                      
                      {fieldData.source && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Source: {fieldData.source}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
