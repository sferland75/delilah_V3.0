import React from 'react';
import Link from 'next/link';
import { useAssessmentContext } from '@/contexts/AssessmentContext';

export default function Home() {
  // Access the assessment context for UI updates
  const { currentAssessmentId, data, hasUnsavedChanges, saveCurrentAssessment } = useAssessmentContext || {};

  // Get client name from assessment data
  const getClientName = () => {
    if (data?.demographics?.personalInfo) {
      const { firstName, lastName } = data.demographics.personalInfo;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
    }
    return currentAssessmentId ? "Unnamed Client" : null;
  };

  // Simple handler to save assessment data
  const handleSave = () => {
    if (saveCurrentAssessment) {
      saveCurrentAssessment();
      alert("Assessment saved successfully!");
    } else {
      alert("Save functionality not available");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Delilah V3.0 - Simple Nav</h1>
      <p className="mb-8">This is a simple navigation page without any UI component dependencies.</p>

      {/* New Assessment Status */}
      {currentAssessmentId && (
        <div className="p-4 mb-6 bg-green-100 border border-green-500 rounded-md">
          <h2 className="text-lg font-bold text-green-800">Current Assessment: {getClientName()}</h2>
          <p className="mb-2 text-green-700">
            Assessment data is loaded and ready.
            {hasUnsavedChanges && " You have unsaved changes."}
          </p>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={!hasUnsavedChanges}
          >
            Save Assessment
          </button>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Main Navigation</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Dashboard
            </button>
          </Link>
          <Link href="/import-pdf">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Import PDF
            </button>
          </Link>
          <Link href="/report-drafting">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Reports
            </button>
          </Link>
          <Link href="/full-assessment">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Full Assessment
            </button>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Assessment Sections</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/assessment-sections">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
              All Sections
            </button>
          </Link>
          <Link href="/medical-full">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
              Medical History
            </button>
          </Link>
          <Link href="/emergency-symptoms">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
              Symptoms
            </button>
          </Link>
        </div>
      </div>

      {/* Verification section to show that the code is updated */}
      <div className="p-4 mt-8 bg-yellow-100 border border-yellow-500 rounded-md">
        <h2 className="text-lg font-bold text-yellow-800">Code Updated: {new Date().toLocaleTimeString()}</h2>
        <p className="text-yellow-700">
          This section confirms the index.tsx file has been updated with new functionality.
        </p>
      </div>
    </div>
  );
}
