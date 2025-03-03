import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '../@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../@/components/ui/card';
import { Progress } from '../@/components/ui/progress';
import { Spinner } from '../@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '../@/components/ui/alert';
import { Separator } from '../@/components/ui/separator';

/**
 * PDF Debug Component
 * 
 * This component provides a simple interface to test PDF.js functionality,
 * with detailed logging to help identify issues with PDF processing.
 */
export default function PdfDebug() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [pdfInfo, setPdfInfo] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [logs, setLogs] = useState([]);

  // Initialize PDF.js when component mounts
  useEffect(() => {
    try {
      // Configure PDF.js
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
        addLog('PDF.js worker configured');
        
        // Verify PDF.js version
        addLog(`PDF.js version: ${pdfjsLib.version}`);
      }
    } catch (error) {
      addLog(`Error initializing PDF.js: ${error.message}`, 'error');
      setError(`Failed to initialize PDF.js: ${error.message}`);
    }
  }, []);

  // Add a log message
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date() }]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      addLog(`File selected: ${selectedFile.name} (${formatBytes(selectedFile.size)})`);
    }
  };

  // Format bytes to human-readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Process the PDF file
  const processPdf = async () => {
    if (!file) {
      addLog('No file selected', 'error');
      setError('Please select a PDF file first');
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    setError('');
    setPdfInfo(null);
    setPdfText('');
    addLog('Starting PDF processing...');
    
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await readFileAsArrayBuffer(file);
      addLog('File read as ArrayBuffer');
      setProgress(10);
      
      // Create Uint8Array from ArrayBuffer
      const data = new Uint8Array(arrayBuffer);
      addLog(`Data length: ${data.length} bytes`);
      setProgress(20);
      
      // Load the PDF document
      addLog('Loading PDF document...');
      const loadingTask = pdfjsLib.getDocument({ 
        data,
        cMapPacked: true,
        disableRange: false,
        disableStream: false
      });
      
      // Track loading progress
      loadingTask.onProgress = (progressData) => {
        if (progressData.total && progressData.loaded) {
          const progressPercent = Math.round((progressData.loaded / progressData.total) * 100);
          addLog(`Loading progress: ${progressPercent}%`);
          setProgress(20 + Math.floor(progressPercent * 0.3)); // 20% to 50%
        }
      };
      
      const pdf = await loadingTask.promise;
      addLog(`PDF document loaded successfully`);
      setProgress(50);
      
      // Get document info
      const info = {
        numPages: pdf.numPages,
        fingerprint: pdf.fingerprint,
        pdfInfo: await pdf.getMetadata()
      };
      
      setPdfInfo(info);
      addLog(`Document has ${info.numPages} pages`);
      setProgress(60);
      
      // Extract text from all pages
      let fullText = '';
      addLog('Extracting text from pages...');
      
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          addLog(`Processing page ${i} of ${pdf.numPages}...`);
          const page = await pdf.getPage(i);
          
          addLog(`Getting text content from page ${i}...`);
          const content = await page.getTextContent();
          
          addLog(`Page ${i} has ${content.items.length} text items`);
          const pageText = content.items.map(item => item.str).join(' ');
          
          fullText += `\n--- PAGE ${i} ---\n${pageText}\n`;
          
          // Update progress based on page processing
          const pageProgress = Math.round(60 + ((i / pdf.numPages) * 40));
          setProgress(pageProgress);
        } catch (pageError) {
          addLog(`Error processing page ${i}: ${pageError.message}`, 'error');
          fullText += `\n--- PAGE ${i} ERROR ---\n${pageError.message}\n`;
        }
      }
      
      addLog('Text extraction complete');
      setPdfText(fullText);
      setProgress(100);
      
    } catch (error) {
      addLog(`Error processing PDF: ${error.message}`, 'error');
      setError(`Failed to process PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Read file as ArrayBuffer
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (e) => {
        addLog('Error reading file', 'error');
        reject(new Error('Error reading file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  // Clear everything
  const clearAll = () => {
    setFile(null);
    setProgress(0);
    setError('');
    setPdfInfo(null);
    setPdfText('');
    setLogs([]);
    addLog('All cleared');
  };

  // Get log entry color
  const getLogColor = (type) => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">PDF.js Debug Tool</h1>
        
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>PDF Processor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById('file-upload').click()}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {file ? 'Change File' : 'Select PDF File'}
                  </Button>
                  
                  {file && (
                    <div className="mt-2 text-sm">
                      Selected: {file.name} ({formatBytes(file.size)})
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={processPdf}
                    disabled={!file || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Spinner size="sm" className="mr-2" />
                        Processing...
                      </span>
                    ) : 'Process PDF'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                </div>
                
                {isLoading && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="text-right text-sm text-gray-500">
                      {progress}%
                    </div>
                  </div>
                )}
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {pdfInfo && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">PDF Information</h3>
                    <div className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
                      <pre className="text-xs">{JSON.stringify(pdfInfo, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Debug Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded h-64 overflow-auto">
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center">No logs yet</div>
                ) : (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className={`text-xs ${getLogColor(log.type)}`}>
                        <span className="text-gray-500">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        {' '}
                        <span className="font-medium">[{log.type.toUpperCase()}]</span>
                        {' '}
                        {log.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {pdfText && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Extracted Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">{pdfText}</pre>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-gray-500">
                Total characters: {pdfText.length}
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
