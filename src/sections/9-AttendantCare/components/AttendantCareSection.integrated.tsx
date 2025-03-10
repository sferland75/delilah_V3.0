'use client';

import React from 'react';
import { AttendantCareSection } from './AttendantCareSection';

/**
 * This is the integrated version of the attendant care section.
 * It simply wraps the standard AttendantCareSection component.
 */
export function AttendantCareSectionIntegrated() {
  return <AttendantCareSection />;
}

// Also export as default for easier importing
export default AttendantCareSectionIntegrated;
