'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/**
 * SectionDebug component for debugging section rendering issues
 * 
 * Place this component at the top of problematic section components
 * to help identify rendering and data issues.
 */
export const SectionDebug = ({ 
  sectionName, 
  contextData, 
  formData, 
  isVisible = true, 
  children 
}: {
  sectionName: string;
  contextData?: any;
  formData?: any;
  isVisible?: boolean;
  children?: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!isVisible) return null;
  
  return (
    <Card className="mb-4 border border-yellow-300">
      <CardHeader className="bg-yellow-50 py-2">
        <CardTitle className="text-sm flex justify-between items-center">
          <span>Debugging: {sectionName}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-3 bg-gray-50">
          <Tabs defaultValue="structure">
            <TabsList>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="context">Context Data</TabsTrigger>
              <TabsTrigger value="form">Form Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="structure" className="p-2">
              <div className="text-xs bg-white p-3 rounded border">
                <h4 className="font-bold mb-2">Component Rendering:</h4>
                <ul className="list-disc list-inside">
                  <li>Component mounted: ✅</li>
                  <li>Children present: {children ? '✅' : '❌'}</li>
                  <li>Context data available: {contextData ? '✅' : '❌'}</li>
                  <li>Form data available: {formData ? '✅' : '❌'}</li>
                </ul>
                <div className="mt-4 bg-gray-100 p-2 rounded">
                  <p className="text-xs text-gray-700">
                    If you see this component rendering but your form sections are not displaying,
                    check the following:
                  </p>
                  <ul className="text-xs list-disc list-inside mt-2">
                    <li>React state updates during rendering</li>
                    <li>Missing error boundaries</li>
                    <li>Form initialization errors</li>
                    <li>Data mapping issues</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="context" className="p-2">
              <div className="text-xs bg-white p-3 rounded border overflow-auto max-h-60">
                <h4 className="font-bold mb-2">Context Data:</h4>
                <pre className="text-xs">{JSON.stringify(contextData || {}, null, 2)}</pre>
              </div>
            </TabsContent>
            
            <TabsContent value="form" className="p-2">
              <div className="text-xs bg-white p-3 rounded border overflow-auto max-h-60">
                <h4 className="font-bold mb-2">Form Data:</h4>
                <pre className="text-xs">{JSON.stringify(formData || {}, null, 2)}</pre>
              </div>
            </TabsContent>
          </Tabs>
          
          {children && (
            <div className="mt-3 p-3 border rounded bg-white">
              <h4 className="text-xs font-bold mb-2">Debug Component Output:</h4>
              {children}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default SectionDebug;