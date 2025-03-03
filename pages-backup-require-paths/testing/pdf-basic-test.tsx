import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

/**
 * Most basic PDF test possible - just tries to load PDF.js and see if it can
 * initialize correctly with minimum dependencies
 */
export default function PdfBasicTest() {
  const [status, setStatus] = useState('Not started');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setStatus(`File selected: ${file.name} (${file.size} bytes)`);
    }
  };

  const testPdfJs = async () => {
    setStatus('Starting test...');
    setError('');

    try {
      // Try dynamically importing PDF.js
      setStatus('Importing PDF.js...');
      const pdfjsLib = await import('pdfjs-dist');
      
      setStatus('PDF.js imported successfully. Version: ' + pdfjsLib.version);
      
      // Check if we're in a browser
      if (typeof window === 'undefined') {
        throw new Error('Not in browser environment');
      }
      
      // Try setting worker source
      setStatus('Setting worker source...');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
      
      setStatus('Worker source set successfully');
      
      if (!selectedFile) {
        setStatus('Test completed - basic PDF.js setup appears to be working');
        return;
      }
      
      // If a file is selected, try to read its metadata only (not full content)
      setStatus('Reading file...');
      const arrayBuffer = await readFileAsArrayBuffer(selectedFile);
      
      setStatus('Creating PDF document...');
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        disableStream: true, // Disable streaming for simpler test
        disableAutoFetch: true // Disable auto fetch for simpler test
      });
      
      setStatus('Waiting for document to load...');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF loading timed out after 30 seconds')), 30000)
      );
      
      // Use Promise.race to implement timeout
      const pdf = await Promise.race([
        loadingTask.promise,
        timeoutPromise
      ]);
      
      setStatus(`PDF loaded successfully. Pages: ${pdf.numPages}`);
      
      // Just get metadata, don't try to render anything
      const metadata = await pdf.getMetadata();
      setStatus(`Success! Metadata retrieved: ${JSON.stringify(metadata)}`);
      
    } catch (err) {
      console.error('PDF.js test failed:', err);
      setError(`Error: ${err.message}`);
      setStatus('Test failed');
    }
  };
  
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Error reading file'));
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Basic PDF.js Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                This is a minimal test to check if PDF.js can be loaded correctly.
              </p>
              
              <input
                type="file"
                id="fileInput"
                onChange={handleFileSelect}
                accept=".pdf"
                className="hidden"
              />
              
              <div className="flex space-x-2">
                <Button onClick={() => document.getElementById('fileInput').click()}>
                  Select PDF (Optional)
                </Button>
                
                <Button onClick={testPdfJs}>
                  Run Basic Test
                </Button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded min-h-16">
              <p className="font-mono text-sm">{status}</p>
              
              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
