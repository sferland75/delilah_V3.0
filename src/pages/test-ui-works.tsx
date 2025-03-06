import React from 'react';
import Link from 'next/link';

export default function TestUIWorks() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'red', fontSize: '24px', marginBottom: '20px' }}>
        UI TEST PAGE - CREATED AT {new Date().toLocaleTimeString()}
      </h1>
      
      <p style={{ marginBottom: '20px' }}>
        If you can see this page, the file system updates are working.
        This is a simple test page created to check if new files are being served.
      </p>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Navigation Options:</h2>
        <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>
            <Link href="/">
              <a style={{ color: 'blue', textDecoration: 'underline' }}>Home Page</a>
            </Link>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <Link href="/dashboard">
              <a style={{ color: 'blue', textDecoration: 'underline' }}>Full Dashboard (New)</a>
            </Link>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <Link href="/simple-nav">
              <a style={{ color: 'blue', textDecoration: 'underline' }}>Simple Navigation</a>
            </Link>
          </li>
        </ul>
      </div>
      
      <button 
        style={{ 
          backgroundColor: 'green', 
          color: 'white', 
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button click works!')}
      >
        Click to Test JavaScript
      </button>
    </div>
  );
}
