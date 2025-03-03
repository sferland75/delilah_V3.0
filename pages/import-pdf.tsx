import React from 'react';
import PdfImportComponent from '@/components/PdfImportComponent';
import Link from 'next/link';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function ImportPdfPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar removed to avoid duplication - it's already included in _app.js */}
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Import Assessment from PDF</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload PDF reports or medical documents to automatically extract assessment data.
          </p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <AlertTitle>Try our new enhanced import system!</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <div>
              Experience enhanced PDF imports with intelligent suggestions, cross-section validation, 
              and missing information detection.
            </div>
            <Link href="/enhanced-import" passHref>
              <Button className="ml-4">
                Try Enhanced Import
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
        
        <PdfImportComponent />
        
        <div className="mt-8 bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h3 className="font-medium text-yellow-800">Tips for best results:</h3>
          <ul className="mt-2 space-y-1 text-sm text-yellow-700 list-disc pl-5">
            <li>Use structured assessment reports or medical documentation with clear section headers</li>
            <li>Text-searchable PDFs work best - scanned documents may not extract properly</li>
            <li>Always review extracted data for accuracy - automatic extraction may miss or misinterpret information</li>
            <li>Only select sections with high confidence scores (70%+) to minimize errors</li>
            <li>Remember to validate all imported information</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
