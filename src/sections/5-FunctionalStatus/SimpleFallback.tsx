import React from 'react';

export function SimpleFallbackRangeOfMotion() {
  return (
    <div className="p-6 border-2 border-red-200 bg-red-50 rounded-md">
      <h3 className="text-lg font-medium text-red-800 mb-2">Range of Motion Component Error</h3>
      <p className="text-red-700">
        The Range of Motion component encountered a loading error. This is a fallback component.
      </p>
    </div>
  );
}

export default SimpleFallbackRangeOfMotion;