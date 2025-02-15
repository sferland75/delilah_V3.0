import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DataViewerProps {
  data: any;
}

export function DataViewer({ data }: DataViewerProps) {
  return (
    <div className="p-4">
      <Card>
        <CardContent className="p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}