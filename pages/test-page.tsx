import React from 'react';

export default function TestPage() {
  alert('Test page is loading');
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'lightyellow',
      border: '4px solid red',
      margin: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: 'red',
        fontSize: '32px'
      }}>
        Test Page
      </h1>
      <p style={{fontSize: '18px'}}>
        This is a basic test page with no dependencies or imports.
      </p>
      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: 'lightblue',
        border: '2px solid blue'
      }}>
        <p>If you can see this, routing to basic pages is working.</p>
      </div>
    </div>
  );
}