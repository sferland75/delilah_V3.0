import React from 'react';

export default function BasicTest() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Basic Test Page</h1>
      <p>This is a basic test page to verify routing is working.</p>
      
      <div className="mt-6 p-4 border rounded-md">
        <h2 className="font-bold mb-2">Current Data:</h2>
        <div>Time: {new Date().toLocaleTimeString()}</div>
        <div>Date: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  );
}
