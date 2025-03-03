import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ marginBottom: '2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
      
      <Link href="/">
        <div style={{ 
          padding: '0.5rem 1rem', 
          background: '#4299e1', 
          color: 'white',
          borderRadius: '0.25rem',
          textDecoration: 'none',
          display: 'inline-block',
          cursor: 'pointer'
        }}>
          Return to Home
        </div>
      </Link>
    </div>
  );
}
