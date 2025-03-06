import React from 'react';
import Link from 'next/link';

export default function SimpleNav() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Delilah V3.0 - Simple Nav</h1>
      <p className="mb-4">This is a simple navigation page without any UI component dependencies.</p>
      
      <div className="bg-blue-100 p-4 rounded mb-8 border border-blue-300">
        <h2 className="text-lg font-bold mb-2 text-blue-800">Full UI Available!</h2>
        <p className="mb-2 text-blue-700">The complete application UI with all functionality is now available.</p>
        <Link href="/dashboard">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to Full Dashboard
          </button>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Main Navigation</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Full Dashboard
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

      <div>
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
    </div>
  );
}
