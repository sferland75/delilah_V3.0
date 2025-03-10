import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAssessmentContext } from '@/contexts/AssessmentContext';

export default function Home() {
  // Access the assessment context for UI updates
  const { currentAssessmentId, data, hasUnsavedChanges, saveCurrentAssessment } = useAssessmentContext || {};
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastSaved, setLastSaved] = useState(null);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);

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
      setLastSaved(new Date());
      alert("Assessment saved successfully!");
    } else {
      alert("Save functionality not available");
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Set up autosave
  useEffect(() => {
    if (!autosaveEnabled || typeof window === 'undefined') return;
    
    const interval = setInterval(() => {
      if (hasUnsavedChanges && saveCurrentAssessment) {
        console.log("Auto-saving...");
        saveCurrentAssessment();
        setLastSaved(new Date());
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [autosaveEnabled, hasUnsavedChanges, saveCurrentAssessment]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Delilah V3.0 - Simple Nav</h1>
      <p className="mb-8">This is a simple navigation page without any UI component dependencies.</p>

      {/* Field Testing Banner */}
      <div className="p-4 mb-6 bg-purple-100 border border-purple-500 rounded-md">
        <h2 className="text-lg font-bold text-purple-800">Field Testing Status</h2>
        <div className="flex items-center mt-2">
          <div className={`h-3 w-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p className="text-purple-700">
            {isOnline ? 'Online: Changes saved to server' : 'Offline: Changes saved locally'}
          </p>
        </div>
        {lastSaved && (
          <p className="text-purple-700 mt-1">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
        <div className="mt-2">
          <label className="flex items-center text-purple-700">
            <input 
              type="checkbox" 
              checked={autosaveEnabled}
              onChange={() => setAutosaveEnabled(!autosaveEnabled)}
              className="mr-2"
            />
            Enable autosave every 30 seconds
          </label>
        </div>
      </div>

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
          <Link href="/field-test-settings">
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
              Field Testing
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

      {/* Field Testing Banner */}
      <div className="p-4 mt-8 bg-purple-100 border border-purple-500 rounded-md">
        <h2 className="text-lg font-bold text-purple-800">Field Testing Available</h2>
        <p className="text-purple-700 mb-2">
          New field testing capabilities have been added for v3.0. Configure autosave, backup, and offline data persistence.
        </p>
        <Link href="/field-test-settings">
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
            Configure Field Testing
          </button>
        </Link>
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
