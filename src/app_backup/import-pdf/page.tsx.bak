'use client';

import PdfImportComponent from '@/components/PdfImportComponent';

export default function ImportPdfPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Import Assessment from PDF</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload PDF reports or medical documents to automatically extract assessment data.
        </p>
      </div>
      
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
    </div>
  );
}
