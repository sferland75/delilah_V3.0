"use client";

import React, { useEffect } from 'react';
import configureStandardFonts from '@/utils/pdf-import/configurePdfJs';

/**
 * Client component to handle PDF.js configuration
 */
export default function PdfConfigLoader() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      configureStandardFonts();
    }
  }, []);

  // Return null since this is just a utility component
  return null;
}
