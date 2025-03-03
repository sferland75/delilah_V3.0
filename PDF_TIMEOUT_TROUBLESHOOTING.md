# PDF.js Timeout Troubleshooting Guide

## The Issue

PDF.js is timing out when trying to load PDF documents in the browser. This affects the pattern recognition system which relies on PDF.js for text extraction.

## Diagnosis

We've identified that:

1. The issue occurs with multiple PDF files
2. The process consistently gets stuck at the loading stage (around 20-40% completion)
3. Tests with the basic PDF.js implementation confirm a timeout after 30 seconds

This suggests a fundamental issue with PDF.js in the current environment rather than a problem with specific PDF files.

## Immediate Solutions

### 1. Try the Verify PDF.js Worker Script

```bash
node scripts/verify-pdfjs-worker.js
```

This script will verify that the PDF.js worker file is properly installed and copy it from node_modules if needed.

### 2. Use the Fallback Implementation

We've created a fallback implementation that doesn't rely on browser-based PDF.js:

```
http://localhost:3000/import/assessment-fallback
```

This page simulates the PDF import process without using PDF.js, which can be further developed into a server-side solution.

## Root Cause Analysis

The timeout could be caused by several factors:

### 1. Browser Limitations

Some browsers have stricter limits on worker thread execution or WebAssembly, which PDF.js uses internally.

**To verify:**
- Try different browsers (Chrome, Firefox, Edge)
- Check if you're using any browser extensions that might interfere with JavaScript processing

### 2. Network/Proxy Issues

If your environment uses corporate proxies or security tools, they might be interfering with worker threads.

**To verify:**
- Try on a different network
- Temporarily disable security software

### 3. PDF.js Version Compatibility

The version of PDF.js (2.16.105) might have issues with your specific environment.

**To try:**
- Install a different version of PDF.js:
  ```
  npm install pdfjs-dist@2.14.305 --save
  ```

### 4. System Resource Constraints

PDF.js can be memory-intensive, especially with large or complex PDFs.

**To verify:**
- Monitor system resource usage during processing
- Try with a very simple, small PDF file

## Long-term Solutions

### 1. Server-side PDF Processing

Move PDF processing to the server side using Node.js libraries:

- [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- [pdf2json](https://www.npmjs.com/package/pdf2json)
- [pdf-extract](https://www.npmjs.com/package/pdf-extract)

This avoids browser limitations entirely.

### 2. Web Worker Implementation

If browser-based processing is required, implement a dedicated web worker:

```javascript
// Create a dedicated worker
const pdfWorker = new Worker('/pdf-worker.js');

// Send message to worker
pdfWorker.postMessage({
  type: 'PROCESS_PDF',
  pdfData: arrayBuffer
});

// Listen for results
pdfWorker.onmessage = function(e) {
  if (e.data.type === 'RESULT') {
    // Process extracted text
  } else if (e.data.type === 'ERROR') {
    // Handle error
  } else if (e.data.type === 'PROGRESS') {
    // Update progress indicator
  }
};
```

### 3. Use a PDF Processing Service

Consider using a third-party API for PDF processing:

- [Adobe PDF Services API](https://developer.adobe.com/document-services/apis/pdf-extract/)
- [DocParser](https://docparser.com/)
- [Sensible](https://sensible.so/)

## Technical Notes

### Why PDF.js Times Out

PDF.js uses a worker thread to parse PDF documents without blocking the main UI thread. The worker does complex processing including:

1. Parsing the binary PDF structure
2. Loading and processing fonts
3. Running embedded JavaScript (if present in the PDF)
4. Rendering content using Canvas or SVG
5. Extracting text using various strategies

A timeout often indicates one of these steps is getting stuck, typically due to:

- A very complex PDF structure
- Custom or embedded fonts that require additional processing
- Security features in the PDF requiring special handling
- Memory limitations in the browser environment

### About the Pattern Recognition System

The pattern recognition system in Delilah V3.0 is designed to:

1. Extract text from PDF documents
2. Identify document sections using pattern matching
3. Extract structured data from each section
4. Provide confidence scores for extracted data

Without reliable PDF text extraction, this system cannot function properly. The fallback implementation provides an alternative approach that can be developed further based on your specific needs.
