'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AMAGuidesPage() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-slate-800">AMA Guides Assessment</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Assessment based on AMA Guides to the Evaluation of Permanent Impairment.
      </p>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AMA Guides Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This section contains the assessment tools based on the AMA Guides to the Evaluation of Permanent Impairment.
          </p>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
            <p>
              The content for this section is currently under development. It will include standardized 
              assessment tools and forms based on the AMA Guides.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
