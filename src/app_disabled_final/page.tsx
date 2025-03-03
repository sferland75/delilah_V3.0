'use client';

import Link from 'next/link';

// Instead of redirecting and causing a loop, let's render a simple page
// that lets users manually go to the Pages Router version
export default function AppRouterRoot() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Delilah V3.0</h1>
        <p className="mb-6 text-gray-600">
          You're currently viewing the App Router version of this application. 
          The main application uses the Pages Router.
        </p>
        <div className="space-y-4">
          <Link 
            href="/pages" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
          >
            Go to Main Application
          </Link>
        </div>
      </div>
    </div>
  );
}
