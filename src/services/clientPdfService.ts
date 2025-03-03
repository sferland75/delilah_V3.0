/**
 * Client-side PDF Service
 * 
 * This file handles client-side specific PDF.js initialization
 * to address Next.js SSR and client/server compatibility issues.
 */

import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

// Setup for client-side only
let isInitialized = false;

export const initPdfJS = () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    // Set worker source path
    const pdfjsWorker = require('pdfjs-dist/legacy/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    isInitialized = true;
    console.log('PDF.js initialized on client side');
  }
};

export default pdfjs;
