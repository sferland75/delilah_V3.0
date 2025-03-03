import React from 'react';

export default function EditTrackingDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Delilah V3.0</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/" className="text-blue-600 hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/report-drafting" className="text-blue-600 hover:underline">
                    Report Drafting
                  </a>
                </li>
                <li>
                  <a href="/edit-tracking-demo" className="text-blue-600 hover:underline font-bold">
                    Edit Tracking Demo
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="py-8">{children}</main>
      <footer className="border-t bg-white p-4 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          Delilah V3.0 - Edit Tracking System Demo
        </div>
      </footer>
    </div>
  );
}
