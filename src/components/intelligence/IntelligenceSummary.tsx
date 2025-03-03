'use client';

import { useIntelligenceContext } from '@/contexts/IntelligenceContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

export function IntelligenceSummary() {
  const { 
    suggestions = [], 
    validationWarnings = [], 
    improvementRecommendations = [],
    getTotalCompleteness = () => 0,
    getCompletionStatus = () => 'incomplete'
  } = useIntelligenceContext?.() || {};
  
  const totalCompleteness = getTotalCompleteness();
  const status = getCompletionStatus?.() || 'incomplete';
  
  const statusText = 
    status === 'complete' ? 'Complete' : 
    status === 'partial' ? 'In Progress' : 
    'Not Started';
  
  const statusColor = 
    status === 'complete' ? 'text-green-500' : 
    status === 'partial' ? 'text-amber-500' : 
    'text-red-500';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligence Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Assessment Completion</span>
            <span className={statusColor}>{statusText} ({totalCompleteness}%)</span>
          </div>
          <Progress value={totalCompleteness} className="h-2" />
        </div>
        
        <Tabs defaultValue="warnings">
          <TabsList className="w-full">
            <TabsTrigger value="warnings" className="flex-1">
              Warnings ({validationWarnings.length})
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex-1">
              Suggestions ({suggestions.length})
            </TabsTrigger>
            <TabsTrigger value="improvements" className="flex-1">
              Improvements ({improvementRecommendations.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="warnings">
            <ScrollArea className="h-64">
              {validationWarnings.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No validation warnings found.
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {validationWarnings.map((warning: any, index: number) => (
                    <Alert key={index} variant="destructive">
                      <AlertTitle>{warning?.title || 'Warning'}</AlertTitle>
                      <AlertDescription>{warning?.description || 'No description available'}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="suggestions">
            <ScrollArea className="h-64">
              {suggestions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No suggestions available.
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {suggestions.map((suggestion: any, index: number) => (
                    <Alert key={index}>
                      <AlertTitle>{suggestion?.title || 'Suggestion'}</AlertTitle>
                      <AlertDescription>{suggestion?.description || 'No description available'}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="improvements">
            <ScrollArea className="h-64">
              {improvementRecommendations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No improvement recommendations available.
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {improvementRecommendations.map((recommendation: any, index: number) => (
                    <Alert key={index}>
                      <AlertTitle>{recommendation?.title || 'Improvement'}</AlertTitle>
                      <AlertDescription>{recommendation?.description || 'No description available'}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
