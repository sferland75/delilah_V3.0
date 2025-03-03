import React from 'react';
import IntelligentPdfImport from '@/components/IntelligentPdfImport';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EnhancedImportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar removed to avoid duplication - it's already included in _app.js */}
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Enhanced PDF Import</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload PDF reports or medical documents to automatically extract assessment data 
            with intelligent suggestions and validation.
          </p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
          <AlertTitle>New Intelligent Import Features</AlertTitle>
          <AlertDescription>
            <p>Our enhanced document processing system now includes:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Cross-section data validation to identify inconsistencies</li>
              <li>Smart content suggestions based on extracted data</li>
              <li>Missing information detection with importance ratings</li>
              <li>Interactive confidence visualization for better decision making</li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="import">Document Import</TabsTrigger>
            <TabsTrigger value="about">About Enhanced Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import">
            <IntelligentPdfImport />
          </TabsContent>
          
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About the Enhanced Import System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Delilah V3.0 now features an advanced document import system that uses pattern 
                  recognition and artificial intelligence to extract data from your assessment documents 
                  with greater accuracy and provides intelligent suggestions for enhancing the extracted data.
                </p>
                
                <h3 className="text-lg font-medium mt-4">Key Features</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 border rounded-md">
                    <h4 className="text-md font-medium">Cross-Section Data Validation</h4>
                    <p className="text-sm mt-1">
                      Automatically identifies inconsistencies across different assessment sections, 
                      such as symptoms that don't match documented functional limitations or contradictory 
                      information between sections.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="text-md font-medium">Smart Content Suggestions</h4>
                    <p className="text-sm mt-1">
                      Provides intelligent suggestions to enhance imported data based on 
                      detected patterns, relationships between different sections, and occupational 
                      therapy domain knowledge.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="text-md font-medium">Missing Information Detection</h4>
                    <p className="text-sm mt-1">
                      Identifies critical missing information in the imported data and 
                      prioritizes it based on clinical importance, helping ensure comprehensive 
                      assessments.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="text-md font-medium">Interactive Confidence Visualization</h4>
                    <p className="text-sm mt-1">
                      Displays confidence scores for extracted data with intuitive color coding, 
                      allowing you to quickly identify information that may need verification.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-4">How to Use</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong>Upload Document</strong>: Click to select a PDF file from your computer.</li>
                  <li><strong>Review Extracted Data</strong>: The system will process your document and display extracted information with confidence scores.</li>
                  <li><strong>Review Suggestions</strong>: Check the "Suggestions" tab to see intelligent recommendations for enhancing your data.</li>
                  <li><strong>Apply Suggestions</strong>: Accept suggestions that are relevant and helpful, then apply them to your data.</li>
                  <li><strong>Import Data</strong>: Select the sections you want to import and click "Import Selected".</li>
                </ol>
                
                <p className="mt-4">
                  The system uses adaptive pattern recognition that improves over time as more documents are processed. 
                  Your corrections and selections help train the system to better recognize patterns in future imports.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h3 className="font-medium text-yellow-800">Tips for best results:</h3>
          <ul className="mt-2 space-y-1 text-sm text-yellow-700 list-disc pl-5">
            <li>Use structured assessment reports or medical documentation with clear section headers</li>
            <li>Text-searchable PDFs work best - scanned documents may not extract properly</li>
            <li>Always review suggestions and validation warnings before importing</li>
            <li>Only select sections with high confidence scores (70%+) to minimize errors</li>
            <li>Remember to validate all imported information</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
