import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PreviewProps {
  content: string;
}

export function Preview({ content }: PreviewProps) {
  if (!content) {
    return (
      <div className="p-4 text-center text-gray-500">
        No content generated yet. Use the Prompt Editor to generate content.
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <CardContent className="p-4 prose max-w-none">
          <div className="whitespace-pre-wrap">
            {content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}