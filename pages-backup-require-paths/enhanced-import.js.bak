import React from 'react';
import Layout from '@/components/Layout';
import EnhancedPdfImportComponent from '@/components/EnhancedPdfImportComponent';
import { Toaster } from '@/components/ui/toaster';

const EnhancedImportPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Enhanced PDF Import</h1>
          <p className="text-muted-foreground">
            Import assessment data with intelligent pattern recognition and validation
          </p>
        </div>
        
        <EnhancedPdfImportComponent />
        
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">Tips for best results:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use structured assessment reports with clear section headers</li>
            <li>Text-searchable PDFs work best - scanned documents may not extract properly</li>
            <li>Always review suggestions and validation warnings before importing</li>
            <li>Only select sections with high confidence scores (70%+) to minimize errors</li>
            <li>Remember to validate all imported information</li>
          </ul>
        </div>
      </div>
      <Toaster />
    </Layout>
  );
};

export default EnhancedImportPage;
