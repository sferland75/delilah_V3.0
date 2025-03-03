// Test PDF Import Page
// Created manually to fix batch file syntax issues

import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { processPdfText, mapToApplicationModel } from '../utils/pdf-import';

export default function TestPdfImport() {
  const [file, setFile] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [processedData, setProcessedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Configure PDF.js
    if (typeof window !== 'undefined') {
      window.pdfjsLib = pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
      window.STANDARD_FONTS_PATH = '/standard_fonts/';
      pdfjsLib.GlobalWorkerOptions.standardFontDataUrl = '/standard_fonts/';
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };

  const extractText = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      const loadingTask = pdfjsLib.getDocument({ data });
      const pdf = await loadingTask.promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      setPdfText(fullText);

      // Process the text
      console.log('Processing PDF text...');
      const processed = processPdfText(fullText);
      console.log('Mapping to application model...');
      const appData = mapToApplicationModel(processed);

      setProcessedData(appData);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError(`Error processing PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to determine confidence level class
  const getConfidenceClass = (score) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Test PDF Import</h1>

      {/* PDF Upload */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Upload PDF</h2>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4"
          disabled={isProcessing}
        />

        <button
          onClick={extractText}
          disabled={!file || isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Process PDF'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {processedData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Confidence Scores</h2>
            <div className="space-y-2">
              {Object.entries(processedData.confidence || {}).map(([section, score]) => (
                <div key={section} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span>{section}</span>
                    <span>{Math.round(score * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${getConfidenceClass(score)}`}
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Extracted Data</h2>
            <div className="overflow-auto max-h-96">
              <pre className="text-xs">
                {JSON.stringify(processedData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Raw Text (Expandable) */}
      {pdfText && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Raw PDF Text</h2>
          <details>
            <summary className="cursor-pointer">Show/Hide Text</summary>
            <div className="mt-2 p-2 bg-gray-100 rounded max-h-96 overflow-auto">
              <pre className="text-xs whitespace-pre-wrap">{pdfText}</pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
