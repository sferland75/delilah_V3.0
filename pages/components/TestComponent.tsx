import React from 'react';

const TestComponent = () => {
  console.log('TestComponent rendering');
  return (
    <div className="bg-purple-100 p-4 mb-4 rounded border border-purple-300">
      <h3 className="font-bold text-purple-700">Basic Test Component</h3>
      <p className="text-purple-700">This is a basic test component from pages/components directory.</p>
    </div>
  );
};

export default TestComponent;