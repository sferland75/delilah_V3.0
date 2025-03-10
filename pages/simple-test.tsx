import React from 'react';
import SimpleTypicalDay from '@/sections/6-TypicalDay/SimpleTypicalDay';

export default function SimpleTest() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold p-4">Simple Typical Day Test</h1>
      <div className="bg-white rounded-lg shadow">
        <SimpleTypicalDay />
      </div>
    </div>
  );
}
